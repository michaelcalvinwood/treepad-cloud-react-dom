import './Branches.scss';
import React from 'react';
import axios from 'axios';
import * as url from '../../../utils/url-helper';
// import branchOpenIcon from '../../../assets/icons/branch-open.svg';
// import branchClosedIcon from '../../../assets/icons/branch-closed.svg';
import branchOpenIcon from '../../../assets/icons/chevron-open-2.svg';
import branchClosedIcon from '../../../assets/icons/chevron-closed-2.svg';
import { isCompositeComponent } from 'react-dom/test-utils';
import UrlSelector from '../UrlSelector/UrlSelector';

class Branches extends React.Component {

  constructor() {
    super();
    // this.fetchingTree is set to the treeId of the tree whose branches are being fetched.
    this.fetchingTree = -1;
    this.counter = 0;
  }

  state = {
    branches: [],
    branchUpdateTs: 0,
    treeId: false,
    lastUpdate: 0,
    branchUrl: 'private',
    displayCloudLink: false
  }

  setCloudLink = state => {
    const { setUrlSelector, userName, branchId } = this.props;

    setUrlSelector('Branch View', `http://${userName}.${window.location.host}/b/${branchId}`);
  }

  /*
   * handleInputChange: Each branch has a handleInputChange listener triggered when the branch name is changed
   */

  handleInputChange = (e, branchId) => {

    const updatedBranches = this.state.branches.map(branch => {
      if (branch.branchId === branchId) {
        branch.name = e.target.value;
        branch.ts = Date.now(); // branch.ts lets the save state know that the name has changed and therefore needs to be updated in the database
        this.props.setBranchHasChanged(true);
      }
      return branch;
    });
    this.setState({
      branches: updatedBranches
    })
  }

  /*
   * handleInputKeyUp: Each branch has a handleInputKeyUp listener triggered when any key is pressed while that branch is in focus.
   * This handler checks to see if the key corresponds to a branch change keyboard sequence: e.g. <ctrl><up> (move branch up one sibling)
   */

  handleInputKeyUp = (e, branchId) => {

    switch (e.code.toLowerCase()) {
      case 'enter':
        if (e.shiftKey) {
          this.insertChild(branchId);
          return true;
        }

        if (e.ctrlKey) {
          this.insertParent(branchId);
          return true;
        }

        this.insertSibling(branchId);
        return true;
      case 'arrowup':
        if (e.shiftKey) {
          this.moveBranch(branchId, 'up');
          return true;
        }
        this.changeFocus(branchId, 'up');
        break;
      case 'arrowdown':
        if (e.shiftKey) {
          this.moveBranch(branchId, 'down');
          return true;
        }
        this.changeFocus(branchId, 'down');
        break;
      case 'arrowright':
        if (e.shiftKey) {
          this.moveBranch(branchId, 'right');
          return true;
        }
        this.changeFocus(branchId, 'right');
        break;
      case 'arrowleft':
        if (e.shiftKey) {
          this.moveBranch(branchId, 'left');
          return true;
        }
        this.changeFocus(branchId, 'left');
        break;
      case 'backspace':
        if (e.ctrlKey) {
          this.deleteBranch(branchId);
        }
        if (e.shiftKey) {
          this.deleteBranch(branchId);
        }
      default:
    }

  }

  handleInputFocus = (e, branchId) => {
    this.props.setBranch(Number(branchId));
  }

  // Insert branches: sibling, child and parent

  branchIdIndex = (arr, branchId) => {
    for (let i = 0; i < arr.length; ++i) {
      if (arr[i].branchId === branchId) return i;
    }
    return false;
  }

  toggleBranchStatus = (e, branchId) => {

    let modifiedBranches = [...this.state.branches];

    const index = this.branchIdIndex(modifiedBranches, branchId);

    if (index === false) {
      console.error(`Branches.js toggleBranchStatus could not find ${branchId} of type ${typeof BranchId} in modifiedBranches`, modifiedBranches)
      return true;
    }

    if (modifiedBranches[index].status === null) return true;

    if (modifiedBranches[index].status === 'o') modifiedBranches[index].status = 'c'
    else modifiedBranches[index].status = 'o';

    this.setState({
      branches: modifiedBranches,
    })

    this.props.setBranch(branchId);

  }

  deleteBranch = branchId => {
    console.clear();

    console.log('Branches deleteBranch', 'branchId', branchId);

    let modifiedBranches = [...this.state.branches];

    // there must always be at least one branch
    if (modifiedBranches.length === 1) {
      alert("Cannot delete branch.\n\nThere must always be at least one branch remaining.");
      return false;
    }

    let index = this.branchIdIndex(modifiedBranches, branchId);

    const parentIndex = this.parentIndex(modifiedBranches, index);

    const numChildren = this.numChildren(modifiedBranches, index);

    if (modifiedBranches.length <= (numChildren + 1)) {
      alert("Cannot delete branch.\n\nThere must always be at least one branch remaining.");
      return false;
    }

    modifiedBranches.splice(index, numChildren + 1);

    if (!this.numChildren(modifiedBranches, parentIndex)) modifiedBranches[parentIndex].status = null;

    this.setState({ branches: modifiedBranches });

    --index;

    if (index >= 0) this.props.setBranch(modifiedBranches[index].branchId);
  }

  hasChild = (branches, index) => {
    if (index >= (branches.length - 1)) return false;
    let curLevel = branches[index].level;
    let nextLevel = branches[index + 1].level;

    return nextLevel > curLevel ? true : false;
  }

  changeFocus = (branchId, direction) => {
    let modifiedBranches = [...this.state.branches];

    let curIndex = this.branchIdIndex(modifiedBranches, branchId);

    if (curIndex === false) {
      console.error(`Branches.js changeFocus could not find ${branchId} of type ${typeof BranchId} in modifiedBranches`, modifiedBranches)
      return false;
    }

    let available;
    let status = 'o';
    let statusLevel = 0;

    switch (direction) {
      case 'up':
        if (curIndex === 0) return;
        // find first open branch prior to curIndex        
        for (let i = 0; i < curIndex; ++i) {
          if (status === 'o') {
            available = i;
            if (modifiedBranches[i].status === 'c') {
              status = 'c';
              statusLevel = modifiedBranches[i].level;
            }
          } else {
            if (modifiedBranches[i].level <= statusLevel) {
              status = 'o';
              available = i;
            }
          }
        }

        this.props.setBranch(modifiedBranches[available].branchId);
        return true;
      case 'down':
        if (curIndex === (modifiedBranches.length - 1)) {
          return;
        }
        // find first open branch that occurs after curIndex
        for (let i = 0; i < modifiedBranches.length; ++i) {
          if (status === 'o') {
            available = i;
            if (i > curIndex) break;
            if (modifiedBranches[i].status === 'c') {
              status = 'c';
              statusLevel = modifiedBranches[i].level;
            }
          } else {
            if (modifiedBranches[i].level <= statusLevel) {
              status = 'o';
              available = i;
              if (i > curIndex) break;
            }
          }
        }

        this.props.setBranch(modifiedBranches[available].branchId);
        return true;
      case 'left':
        if (modifiedBranches[curIndex].status !== 'o') return;
        modifiedBranches[curIndex].status = 'c';
        this.setState({ branches: modifiedBranches });
        return true;
      case 'right':
        if (modifiedBranches[curIndex].status !== 'c') return;
        modifiedBranches[curIndex].status = 'o';
        this.setState({ branches: modifiedBranches });
        return true;
    }
  }

  numChildren = (branches, index) => {
    const curLevel = branches[index].level;
    let numChildren = 0;
    let i;
    for (i = index + 1; i < branches.length; ++i) {
      if (branches[i].level <= curLevel) break;
      ++numChildren;
    }
    return numChildren;
  }

  parentIndex = (branches, index) => {
    const curLevel = branches[index].level;
    if (curLevel === 1) return index;
    if (index === 0) return index;

    let i;
    for (i = index - 1; i > 0; --i) {
      if (branches[i].level < curLevel) break;
    }

    return i;
  }

  moveSelfAndChildrenUnderParent = (branches, index) => {
    const parentIndex = parentIndex(branches, index);
    const desiredIndex = parentIndex + 1;

    const numChildren = this.numChildren(branches, index);

    const removed = branches.splice(index, numChildren + 1); //remove self and children

    for (let i = 0; i < (numChildren + 1); ++i) {
      branches.splice(desiredIndex + i, 0, removed[i]);
    }

    return desiredIndex;
  }

  moveSelfAndChildrenToEndOfParent = (branches, index) => {
    const curLevel = branches[index].level;
    const numChildren = this.numChildren(branches, index);

    let i;
    for (i = index + 1; i < branches.length; ++i) {
      if (branches[i].level < curLevel) break;
    }

    const desiredIndex = i - numChildren - 1; // desired index will change children are removed

    const removed = branches.splice(index, numChildren + 1); //remove self and children
    for (let i = 0; i < (numChildren + 1); ++i) {
      branches.splice(desiredIndex + i, 0, removed[i]);
    }

    return desiredIndex;
  }

  /*
   * moveBranch: moves the target branch and all its descendants in the chosen direction.
   * direction can be 'up', 'down', 'left', 'right'
   */

  moveBranch = (branchId, direction) => {
    console.clear();

    let modifiedBranches = [...this.state.branches];

    let curIndex = this.branchIdIndex(modifiedBranches, branchId);

    if (curIndex === false) {
      console.error(`Branches.js moveBranch could not find ${branchId} of type ${typeof BranchId} in modifiedBranches`, modifiedBranches)
      return false;
    }

    let curLevel = modifiedBranches[curIndex].level;
    let nextLevel;
    let numChildren;
    let i;
    let desiredIndex = 0;
    let removed;
    let prevLevel;
    let parentIndex;

    switch (direction) {
      // move branch and its descendants up
      case 'up':
        // if branch is already first then nothing to do
        if (curIndex === 0) return;

        curLevel = modifiedBranches[curIndex].level;
        prevLevel = modifiedBranches[curIndex - 1].level

        if (prevLevel < curLevel) return;


        // get desired index
        for (i = curIndex - 1; i > 0; --i) {
          if (modifiedBranches[i].level <= curLevel) break;
        }
        desiredIndex = i;

        // if desired index is the same then nothing to do
        if (curIndex === desiredIndex) return true;

        // find num descendants that need to move as well
        numChildren = this.numChildren(modifiedBranches, curIndex);

        // remove self plus any children
        removed = modifiedBranches.splice(curIndex, numChildren + 1);

        // add self and children at desired index
        for (i = 0; i < removed.length; ++i) modifiedBranches.splice(desiredIndex + i, 0, removed[i])

        // update state with the changed branches      
        this.setState({ branches: modifiedBranches });
        break;
      // move branch and its descendants down
      case 'down':
        // if branch is already last then nothing to do
        if (curIndex === modifiedBranches.length - 1) return;

        // get desired index
        numChildren = this.numChildren(modifiedBranches, curIndex);

        desiredIndex = curIndex + 1;

        // if desired index is the same then nothing to do
        if (curIndex === desiredIndex) return true;

        if (desiredIndex < modifiedBranches.length) {
          if (modifiedBranches[desiredIndex].level < modifiedBranches[curIndex].level) return;
        }

        // remove self plus any children
        removed = modifiedBranches.splice(curIndex, numChildren + 1);

        // add self and children at desired index
        for (i = 0; i < removed.length; ++i) modifiedBranches.splice(desiredIndex + i, 0, removed[i])

        // update state with the changed branches      
        this.setState({ branches: modifiedBranches });
        break;
      case 'left':
        // if branch is already at the top level then there is nothing to do

        console.log('Branches moveBranch left', 'curLevel', curLevel);

        if (curLevel == 1) {
          return false;
        }
        console.log('Bra')

        parentIndex = this.parentIndex(modifiedBranches, curIndex);
        curIndex = this.moveSelfAndChildrenToEndOfParent(modifiedBranches, curIndex);

        console.log('Branches.js moveBranch', 'curIndex', curIndex, 'modifiedBranches', modifiedBranches);

        numChildren = this.numChildren(modifiedBranches, curIndex);

        for (i = curIndex; i < curIndex + numChildren + 1; ++i) {
          --modifiedBranches[i].level;
        }

        // check to see if any children are left, otherwise set status to null (i.e. no children)
        if (!this.numChildren(modifiedBranches, parentIndex)) modifiedBranches[parentIndex].status = null;

        this.setState({ branches: modifiedBranches });

        break;
      case 'right':
        // if branch is first then it cannot become a child therefore nothing to do
        if (curIndex === 0) return;

        curLevel = modifiedBranches[curIndex].level;

        // if we already have five levels then nothing to do
        if (Number(curLevel) >= 5) return;

        prevLevel = modifiedBranches[curIndex - 1].level;

        // if the current branch is already indented compared to the branch above then nothing to do

        console.log('Branches.js moveBranch right', 'prevLeve', prevLevel, 'curLevel', curLevel)
        if (prevLevel < curLevel) return;

        // TODO: precheck all descendants. If descendant already has a level of 5 then alert user that max levels are already being used and cannot move

        if (prevLevel === curLevel) {
          modifiedBranches[curIndex - 1].status = 'o';
          ++modifiedBranches[curIndex].level;

          // increase the level of all descendants
          for (i = curIndex + 1; i < modifiedBranches.length; ++i) {
            if (modifiedBranches[i].level <= curLevel) break;
            ++modifiedBranches[i].level;
          }

          this.setState({ branches: modifiedBranches });
          return;
        }

        // at this point, the previous level is an indented descendant of an upper branch.
        // find that branch and assign it as the new parent of the current branch

        for (i = curIndex - 1; i > 0; --i) {
          if (modifiedBranches[i].level === curLevel) {
            if (modifiedBranches[i].status === null) modifiedBranches[i].status = 'o';
            ++modifiedBranches[curIndex].level;
            this.setState({ branches: modifiedBranches });
            return;
          }
        }
        break;

    }

  }

  insertBranch = (branchId, relativeLevel) => {

    console.clear();
    let i;

    let { userId, branchPool, setBranchPool } = this.props;

    // TO DO: Handle branchPool.length === 0 here

    if (!branchPool.length) {
      console.error('Branches.js insertBranch branchPool is empty');
      return;
    }

    let modifiedBranches = [...this.state.branches];

    let index = this.branchIdIndex(modifiedBranches, branchId);

    if (index === false) {
      console.error(`Branches.js insertBranch could not find ${branchId} of type ${typeof BranchId} in modifiedBranches`, modifiedBranches)
      return false;
    }

    // Save the branch and module information
    this.saveBranches();
    this.props.saveModuleContentSync(branchId);

    let curLevel = Number(modifiedBranches[index].level);

    const desiredLevel = curLevel + relativeLevel;

    if (desiredLevel < 1 || desiredLevel > 5) return false;

    const newBranchId = branchPool.shift().toString();

    // TO DO add check to see if newBranchId alread in use in case of race condition
    // if in use then shift again.

    // setBranchPool assigns the current branchPool to state and removes the newBranchId from the users table in the database
    setBranchPool(userId, branchPool, this.state.treeId, newBranchId)

    // TO DO: if level + relativeLevel < 0 or > 5 then return false and do nothing

    if (relativeLevel === 1) modifiedBranches[index].status = 'o';

    const newBranch = {
      branchId: newBranchId,
      level: (Number(modifiedBranches[index].level) + relativeLevel).toString(),
      status: null,
      name: null,
      ts: Date.now()
    }

    let insertionIndex;

    // index now references the branchId of the branch that has requested the branch insert
    // if there are no descendants then the insertionIndex = index; else the insertionIndex is the last descendant

    /*
     * If inserting a sibling then we need to skip all the descendant's of the current branch
     */
    let numChildren = 0;

    if (relativeLevel === 0) {
      numChildren = this.numChildren(modifiedBranches, index);
      index += numChildren;
    }

    if (relativeLevel === -1) {
      for (i = index + 1; i < modifiedBranches.length; ++i) {
        if (modifiedBranches[i].level < curLevel) break;
      }
      index = i - 1;
    }

    modifiedBranches.splice(index + 1, 0, newBranch);

    this.setState({
      branches: modifiedBranches,
    })

    this.props.setBranch(newBranchId);
  }

  insertChild = (branchId = this.props.branchId) => {
    this.insertBranch(branchId, 1);
  }

  insertSibling = (branchId = this.props.branchId) => {
    this.insertBranch(branchId, 0);
  }

  insertParent = (branchId = this.props.branchId) => {
    this.insertBranch(branchId, -1);
  }

  /*
   * saveBranchName: updates the database setting the name of the provided branchId
   */

  saveBranchName = (branchId, branchName) => {
    const request = {
      url: `${process.env.REACT_APP_BASE_URL}/branches/name/save/`,
      method: "post",
      data: {
        branchId: branchId,
        branchName: branchName
      },
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
      }
    }

    axios(request)
      .then(res => {

      })
      .catch(err => {
        // TO DO reset branch.ts to 0 so we can try again later; and turn Save red
      })
  }

  /*
   * saveBranches: updates the database with the current branch order and all branch names
   */

  saveBranches = () => {
    if (!this.state.branches.length) return false;
    const curTime = Date.now();

    const branchOrder = this.state.branches.map(branch => branch.status ? `${branch.branchId}:${branch.level}:${branch.status}` : `${branch.branchId}:${branch.level}`);
    const branchNames = [];
    for (let i = 0; i < this.state.branches.length; ++i) {
      let branch = this.state.branches[i];

      if (branch.ts > this.state.branchUpdateTs) {
        let id = branch.branchId;
        let name = branch.name;
        branchNames.push({ id: id, name: name });
        branch.ts = curTime;
      }
    }

    const request = {
      url: `${process.env.REACT_APP_BASE_URL}/branches/order/save/${this.state.treeId}`,
      method: "post",
      data: {
        branchOrder: JSON.stringify(branchOrder),
      },
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
      }
    }
    axios(request)
      .then(res => {
      })
      .catch(err => {
        console.error(`Branches.js saveBranches axios error`, err);
      })

    branchNames.forEach(branch => this.saveBranchName(branch.id, branch.name));

    this.setState({
      branchUpdateTs: curTime
    })

    this.props.setBranchHasChanged(false);

  }


  assignBranchName = (branchId, branchName) => {
    const branches = [...this.state.branches];
    let branch = branches.find(branch => branch.branchId === branchId);
    if (branch) {
      branch.name = branchName;
      branch.ts = Date.now();

      this.setState({
        branches: branches
      })
    }
  }

  getBranchName = branchId => {
    const request = {
      url: `${process.env.REACT_APP_BASE_URL}/branches/name/${branchId}`,
      method: "get",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
      }
    }

    axios(request)
      .then(res => {
        this.assignBranchName(res.data.message[0].branch_id.toString(), res.data.message[0].branch_name);
      })
      .catch(err => {

      })
  }

  getBranches = treeId => {
    const request = {
      url: process.env.REACT_APP_BASE_URL + '/branches/order/' + treeId,
      method: "get",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
      }
    }

    this.fetchingTree = treeId;

    axios(request)
      .then(response => {

        let { branch_order, tree_id } = response.data.message[0];

        branch_order = JSON.parse(branch_order);

        const curTime = Date.now();

        let branches = branch_order.map(branch => {
          let branchParts = branch.split(':');
          let item = {};

          item.branchId = branchParts[0];
          item.level = branchParts[1];
          if (!branchParts[2]) item.status = null;
          else item.status = branchParts[2];

          item.name = null;
          item.ts = curTime;
          return item
        });

        const activeBranch = branches.length ? Number(branches[0].branchId) : 0

        this.props.setBranch(activeBranch);

        this.setState({
          branches: branches,
          activeModule: 0,
          treeId: tree_id,
          lastUpdate: Date.now()
        })

        if (!branches.length) return;

        branches.forEach(branch => this.getBranchName(branch.branchId));

        this.getActiveModule(activeBranch);
      })
      .catch(err => {
        console.error('Error getting branch order', request);

      })
  }

  setBranchFocus = () => {
    const target = `.branches__branch-${this.props.branchId}`;
    const el = document.querySelector(target);

    if (el) el.focus();
  }


  componentDidUpdate() {
    let { treeId, controlState, controlHandler, branchId } = this.props;

    branchId = branchId.toString();
    this.setBranchFocus(branchId);

    switch (controlState) {
      case 'Insert-Sibling':
        controlHandler(null);
        this.insertSibling(branchId);
        break;
      case 'Insert-Child':
        controlHandler(null);
        this.insertChild(branchId);
        break;
      case 'Insert-Parent':
        controlHandler(null);
        this.insertParent(branchId);
        break;
      case 'auto-save':
      case 'Save':
        controlHandler(null);
        this.saveBranches();
        break;
      case 'Up':
        controlHandler(null);
        this.moveBranch(branchId, 'up');
        break;
      case 'Down':
        controlHandler(null);
        this.moveBranch(branchId, 'down');
        break;
      case 'Indent':
        controlHandler(null);
        this.moveBranch(branchId, 'right');
        break;
      case 'Outdent':
        controlHandler(null);
        this.moveBranch(branchId, 'left');
        break;
      case 'Delete':
        controlHandler(null);
        this.deleteBranch(branchId);
        break;
    }

    if (treeId <= 0) return;

    if (treeId !== this.fetchingTree) this.getBranches(treeId);

  }

  componentDidMount() {
    const { treeId, branchId } = this.props;

    if (treeId <= 0) return;

    if (treeId !== this.state.treeId) this.getBranches(treeId);

  }

  displayBranchContent = () => {
    const { view, isAllowed } = this.props;

    console.log('Branches.js displayBranchContent', 'view', view);

    if (this.state.branches === false) return (<></>);

    console.log(`Branches.js displayBranchContent`, 'this.state.branches', this.state.branches);

    let closedLevel = 100;
    return (
      this.state.branches
        .filter(branch => {
          if (view === 'userView') return true;
          return isAllowed(branch.branchId) ? true : false;
        })
        .map(branch => {
          // assign classnames
          let className = `branches__branch branches__branch-${branch.branchId} branches__branch--level-${branch.level}`
          let containerClassName = `branches__branch-container branches__branch-container--level-${branch.level}`;
          let imageClassName = 'branches__image';
          let imageSource = branchOpenIcon;

          if (branch.level > closedLevel) {
            className += ' branches__branch--hidden';
            containerClassName += ' branches__branch-container--hidden';
            imageClassName += ' branches__image--hidden';
          }
          if (branch.level <= closedLevel) closedLevel = 100;

          if (branch.status !== null) {
            className += ` branches__branch--status-${branch.status}`;
            imageClassName += ` branches__image--status-${branch.status}`;
            if (branch.status === 'c') {
              imageSource = branchClosedIcon;
              if (branch.level < closedLevel) closedLevel = Number(branch.level);
            }
          }
          if (branch.branchId == this.props.branchId) {
            className += ' branches__branch--active';
            containerClassName += ' branches__branch-container--active';
          }

          return (
            <div
              className={containerClassName}
              key={branch.branchId.toString()}
              tabIndex="0"
            >

              {branch.status === 'c' ?
                <img
                  className={imageClassName}
                  src={branchClosedIcon}
                  onClick={e => this.toggleBranchStatus(e, branch.branchId)} /> :
                <img
                  className={imageClassName}
                  src={imageSource}
                  onClick={e => this.toggleBranchStatus(e, branch.branchId)} />}
              <input
                className={className}
                onChange={e => this.handleInputChange(e, branch.branchId)}
                onKeyUp={e => this.handleInputKeyUp(e, branch.branchId)}
                onFocus={e => this.handleInputFocus(e, branch.branchId)}
                type='text'
                value={branch.name === null ? '' : branch.name} />
            </div>
          )
        })
    )
  }

  render() {
    const { windowState, toggleWindow, treeId, linkIcon, closeIcon, branchPool, userName, branchId, view } = this.props;

    let mainClassName = 'branches branches--active';

    if (windowState.trees) mainClassName += '-trees';
    if (windowState.branches) mainClassName += '-branches';
    if (windowState.leaves) mainClassName += '-leaves';
    if (windowState.controls) mainClassName += '-controls';

    let titleClassName = 'branches__title';
    let contentClassName = 'branches__content'

    if (!windowState.branches) {
      titleClassName += ' branches__title--closed';
      contentClassName += ' branches__content--closed';
    } else if (treeId <= 0) {
      contentClassName += ' branches__content--closed';
    }

    if (view !== 'userView') {
      return (
        <section className={mainClassName}>
          <div className={contentClassName}>
            {this.displayBranchContent()}
          </div>
        </section>
      )
    }

    return (
      <section className={mainClassName}>
        <img
          className="branches__link"
          src={linkIcon}
          onClick={() => this.setCloudLink()} />
        <img
          className="branches__close"
          src={closeIcon}
          onClick={e => toggleWindow(e, 'branches')} />

        <div
          className={titleClassName}
        >
          {this.state.branchUrl}
        </div>
        <div className={contentClassName}>
          {this.displayBranchContent()}
        </div>
      </section>
    )
  }

}

export default Branches