import './Layout001.scss';

import { Component } from 'react';
import Trees from './Trees/Trees';
import Controls from './Controls/Controls';
import Branches from './Branches/Branches';
import Leaves from './Leaves/Leaves';
import '../../styles/fontawesome/css/all.css'
import GetUser from './GetUser/GetUser';
import iconList from '../../assets/data/svg-filenames.json';
import axios from 'axios';
import linkIcon from '../../assets/icons/cloud.svg'
import editSectionIcon from '../../assets/icons/edit-section.svg';

class App extends Component {

  state = {
    userName: localStorage.getItem('userName') || false,
    userId: localStorage.getItem('userId') || 2, // Important: Change to false after adding signup
    branchPool: [],
    selectedTree: localStorage.getItem('selectedTree') || -2,
    selectedBranch: localStorage.getItem('selectedBranch') || false,
    controlState: null
  }
  
  controlHandler = type => {
    console.log(`Layout001.js controlHandler(${type})`);
    this.setState({
      controlState: type
    })
  }

  setUser = (userId, userName) => {
    this.setState({
      userName: userName,
      userId: userId
    })

    console.log ('Layou001 setUser', userName, userId);
  }

  addBranchToBranchPool = branchId => {
    console.log(`Layout001.js addBranchToBranchPool(${branchId}:${typeof branchId})`);
    let modifiedPool = [...this.state.branchPool];
    modifiedPool.push(branchId);
    this.setState({
      branchPool: modifiedPool
    })
  }

  setBranchPool = (userId, branchPool, treeId, removedBranch = false) => {
    console.log(`Layout001.js setBranchPool(${userId}, ${branchPool})`);

    this.setState({
      branchPool: branchPool
    })

    if (removedBranch) {
      const request = {
        url: `${process.env.REACT_APP_BASE_URL}/branch-pool/${userId}/${treeId}/${removedBranch}`,
        method: 'delete'
      }
      axios(request)
      .then(res => {
        console.log(`Layout001.js setBranchPool axios res.data`, res.data);
        const {userId, branchId} = res.data;
        this.addBranchToBranchPool(branchId);
      })
      .catch(err => {
        console.error(`Layout001.js setBranchPool axios error`, err);
      })
    }
  }

  setTheTree = treeId => {
    console.log (`Layout001.js setTree(${treeId})`);

    this.setState({
      selectedTree: treeId,
      selectedBranch: false
    })
  }

  setBranch = branchId => {
    this.setState({
      selectedBranch: branchId
    })
  }

  componentDidMount() {
    window.addEventListener('resize', this.windowResize);
  }

  render () {
    const {windowState, windowHeight, windowWidth, clickHandler,setTheTree} = this.props;

    console.log (`Layout001.js render() state`, this.state);

    if (!this.state.userName || !this.state.userId) {
      return (
        <GetUser 
          setUser={this.setUser}
          setBranchPool={this.setBranchPool} />
      )
    }

    if (windowWidth > 768) {
      return (
        <div className="app">
          <Controls
            windowState={windowState}
            clickHandler={clickHandler}
            controlHandler={this.controlHandler}/>
          <Branches
            windowState={windowState}
            clickHandler={clickHandler}
            treeId={this.state.selectedTree}
            branchId={this.state.selectedBranch}
            branchPool={this.state.branchPool}
            setBranchPool={this.setBranchPool}
            userId={this.state.userId}
            linkIcon={linkIcon}
            editSectionIcon={editSectionIcon}
            controlState={this.state.controlState}
            controlHandler={this.controlHandler}/>
          <Leaves 
            windowState={windowState}
            clickHandler={clickHandler}
            linkIcon={linkIcon}
            editSectionIcon={editSectionIcon}/>
          <Trees 
            windowState={windowState}
            iconClickHandler={clickHandler}
            clickHandler={this.setTheTree}
            userName={this.state.userName}
            userId={this.state.userId}
            iconList={iconList}
            selectedTree={this.state.selectedTree}
            linkIcon={linkIcon}
            editSectionIcon={editSectionIcon}/>
          {/* <Modals modalName=''/> */}
        </div>
      )
    }
    return (
      <div>
        Screen dimensions not supported
      </div>
    ) 
  }
}

export default App;
