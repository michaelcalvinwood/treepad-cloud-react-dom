import './Branches.scss';
import branchIcon from '../../../assets/icons/branch.svg';
import React from 'react';
import axios from 'axios';
import * as url from '../../../utils/url-helper';

class Branches extends React.Component {

    constructor() {
      super();
      // this.fetchingTree is set to the treeId of the tree whose branches are being fetched.
      this.fetchingTree = -1;
    }

    state = {
      branches: [],
      branchUpdateTs: 0,
      treeId: false,
      lastUpdate: 0,
    }

// input event handlers

    handleInputChange = (e, branchId) => {
      console.log (`Branches.js handleInputChange ${branchId}: ${e.target}`);
      const updatedBranches = this.state.branches.map(branch => {
        console.log (branch.branchId, branchId);
        if (branch.branchId === branchId) branch.name = e.target.value;
        return branch;
      });
      console.log (updatedBranches);
      this.setState({
        branches: updatedBranches
      })
    } 

    handleInputKeyUp = (e, branchId) => {
      console.log(`Branches.js handleInputKeyUp(${e}, ${branchId})`, e);

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

        default:
          console.log ("Branches.js handleKeyUp", branchId, e.key, e.shiftKey)
      }
      
    }
    
    handleInputFocus = (e, branchId) => {
      console.error(`Branches.js handleInputFocus`, 'branchid', branchId);

      this.props.setBranch(Number(branchId));
      
    }

// Insert branches: sibling, child and parent

    branchIdIndex = (arr, branchId) => {
      for (let i = 0; i < arr.length; ++i) {
        console.log(`Branches.js branchIdIndex compare ${arr[i].branchId}:${typeof arr[i].branchId} to ${branchId}:${typeof branchId}`)
        if (arr[i].branchId === branchId) return i;
      }
      return false;
    }

    insertBranch = (branchId, relativeLevel) => {
      let {userId, branchPool, setBranchPool} = this.props;

      // TO DO: Handle branchPool.length === 0 here

      console.log (`Branches.js insertBranch(${branchId}:${typeof branchId},${relativeLevel}:${typeof relativeLevel}) branchPool`, branchPool);

      if (!branchPool.length) {
        console.error('Branches.js insertBranch branchPool is empty');
        return;
      }
      
      let modifiedBranches = [...this.state.branches];

      const index = this.branchIdIndex(modifiedBranches, branchId);

      if (index === false) {
        console.error (`Branches.js insertBranch could not find ${branchId} of type ${typeof BranchId} in modifiedBranches`, modifiedBranches)
        return false;
      }

      const desiredLevel = Number(modifiedBranches[index].level)+relativeLevel;

      if (desiredLevel < 1 || desiredLevel > 5) return false;

      console.log(`Branches.js insertBranch this.state.branches`, this.state.branches); 

      const newBranchId = branchPool.shift().toString();

      console.log(`Branches.js insertBranch newBranchId`, newBranchId)

      // TO DO add check to see if newBranchId alread in use in case of race condition
      // if in use then shift again.
      
      // setBranchPool assigns the current branchPool to state and removes the newBranchId from the users table in the database
      setBranchPool(userId, branchPool, this.state.treeId, newBranchId)

      // TO DO: if level + relativeLevel < 0 or > 5 then return false and do nothing
      
      const newBranch = {
        branchId: newBranchId,
        level: (Number(modifiedBranches[index].level)+relativeLevel).toString(),
        status: relativeLevel > 0 ? 'o' : null,
        name: null,
        ts: Date.now()
      }

      modifiedBranches.splice(index+1, 0, newBranch);

      console.log("Branches.js insertBranch modifiedBranches (after insertion)", modifiedBranches)

      this.setState({
        branches: modifiedBranches,
      })

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

// save branch info

    saveBranchName = (branchId, branchName) => {
      console.log(`Branches.js saveBranchName(${branchId}, ${branchName})`);

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

    saveBranches = () => {
      console.log(`Branches.js saveBranches thist.state.branches`, this.state.branches);

      if (!this.state.branches.length) return false;
      const curTime = Date.now();


      const branchOrder = this.state.branches.map(branch => branch.status ? `${branch.branchId}:${branch.level}:${branch.status}` : `${branch.branchId}:${branch.level}`);
      const branchNames = [];
      for (let i = 0; i < this.state.branches.length; ++i) {
        let branch = this.state.branches[i];
        console.log(`Branches.js saveBranches i, branch, branch.ts, this.state.branchUpdateTs`, i, branch, branch.ts, this.state.branchUpdateTs);

        if (branch.ts > this.state.branchUpdateTs) {
          let id = branch.branchId;
          let name = branch.name;
          branchNames.push({id: id, name: name});
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
      .then (res => {
        console.log (`Branches.js saveBranches axios success`, res.data);
      })
      .catch(err => {
        console.error (`Branches.js saveBranches axios error`, err);
      })

      branchNames.forEach(branch => this.saveBranchName(branch.id, branch.name));

      this.setState({
        branchUpdateTs: curTime
      })

    }


    assignBranchName = (branchId, branchName) => {
      console.log (`Branches.js assignBranchName (${branchId}, ${branchName})`);
      const branches = [...this.state.branches];
      let branch = branches.find(branch => branch.branchId === branchId);
      if (branch) {
        branch.name = branchName;
        branch.ts = Date.now();

        this.setState({
          branches: branches
        })
      }
      console.log (`Branches.js assignBranchName branch`, branch);
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
        console.log(`Branches.js getBranchName(${branchId} axios success)`, res.data.message[0]);
        this.assignBranchName(res.data.message[0].branch_id.toString(), res.data.message[0].branch_name);
      })
      .catch(err => {

      })
    }

    getBranches = treeId => {
        console.log (`Branches.js getBranches(${treeId})`);
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

          let {branch_order, tree_id} = response.data.message[0];

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

          console.log ('Branches.js axios success branches to be added to state', branches);

          const activeBranch = branches.length ? Number(branches[0].branchId) : 0

          this.props.setBranch(activeBranch);

          this.setState ({
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
          console.log ('Error getting branch order', request);
          
        })
    }

    setBranchFocus = () => {
      const target = `.branches__branch-${this.props.branchId}`;
      const el = document.querySelector(target);

      console.log(`Branches.js setBranchFocus`, 'target branch class', target)

      if (el) el.focus();
    }


    componentDidUpdate() {
      const {treeId, controlState, controlHandler, branchId} = this.props;

      console.log(`Branches.js componentDidUpdate`, `treeId`, treeId, 'branchId', branchId, 'controlState', controlState);

      switch (controlState) {
        case 'Insert-Sibling':
          controlHandler(null);
          this.insertSibling(this.props.branchId.toString());
          break;
        case 'Insert-Child':
            controlHandler(null);
            this.insertChild(this.props.branchId.toString());
            break;
        case 'Insert-Parent':
          controlHandler(null);
          this.insertParent(this.props.branchId.toString());
          break;
        case 'Save':
          controlHandler(null);
          this.saveBranches();
          break;
      }
      

      this.setBranchFocus(branchId);

      console.log ("Branches.js componentDidUpdate", "treeId", treeId, 'cur branches', this.state.branches);

      if (treeId <= 0) return;

      if (treeId !== this.fetchingTree) this.getBranches(treeId);
      
    }

    componentDidMount() {
      const {treeId, branchId} = this.props;

      console.log ("Branches did mount", treeId);

      if (treeId <= 0) return;

      if (treeId !== this.state.treeId) this.getBranches(treeId);
      
    }

    // keyHandler = (key, e) => {
    //   console.log ('key pressed', key, e);
    // }

    displayBranchContent = () => {
      if (this.state.branches === false) return (<></>);

      console.log(`Branches.js displayBranchContent`, 'this.state.branches', this.state.branches);

      return (
        this.state.branches.map(branch => {
          let className = `branches__branch branches__branch-${branch.branchId} branches__branch--level-${branch.level}`
          if (branch.status !== null) className += ` branches__branch--status-${branch.status}`;
          if (branch.branchId == this.props.branchId) className += ` branches__branch--active`;
          if (Number(branch.branchId) === this.props.branchId) className += ' branches__branch--active';
          console.log(`Branches.js displayBranchContent mapping branch ${branch.branchId}`);
          return (
            <div key={branch.branchId.toString()}>
              <input
                className={className}
                onChange={e => this.handleInputChange(e, branch.branchId)}
                onKeyUp={e => this.handleInputKeyUp(e, branch.branchId)}
                onFocus={e => this.handleInputFocus(e, branch.branchId)}
                type='text'
                value={branch.name === null ? '' : branch.name}/>
            </div>
          )
        })
      )
    }


    render() {
      const {windowState, clickHandler, treeId, linkIcon, closeIcon, branchPool} = this.props;
    
      // console.log(`Branches.js render url.state()`, url.state());
      // console.log(windowState);
  
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
  
      // console.log ("branches mainClassName", mainClassName);

      // console.log(window.location)

     
      // if (window.location.href === 'http://localhost:3000/hello') window.history.pushState({ 'page_id': 1, 'user_id': 5 }, '', './goodbye');
  
      
  
    return (
        <section className={mainClassName}>
          {/* debug */}
          {/* <div>{`Branch Pool: ${branchPool}`}</div>
          <div className='branches__branch-list'>{`Branch Order: ${JSON.stringify(this.state.branches)}`}</div> */}

          <img className="branches__link" src={linkIcon} />
          <img className="branches__close" src={closeIcon} />
          
            <div 
              className={titleClassName}
              onClick={e => clickHandler(e, 'branches')} >
                {/* {this.state.activeBranch} */}
                
                <img className="branches__icon" src={branchIcon} alt="branches" />
                {/* <p>{this.props.branchId}</p>
                <p>{JSON.stringify(this.state.branches)}</p> */}
            </div>
            <div className={contentClassName}>
                {this.displayBranchContent()}
            </div>
                
        </section>
    )
    }
    
}

export default Branches