import './Layout001.scss';

import { Component } from 'react';
import Trees from './Trees/Trees';
import Controls from './Controls/Controls';
import Branches from './Branches/Branches';
import Leaves from './Leaves/Leaves';
import '../../styles/fontawesome/css/all.css'
import iconList from '../../assets/data/svg-filenames.json';
import axios from 'axios';
import linkIcon from '../../assets/icons/cloud.svg'
import closeIcon from '../../assets/icons/close.svg';

class Layout001 extends Component {

  state = {
    branchPool: [],
    branchId: 0,
    treeId: -2,
    controlState: null,
    saveModule: false,
    
  }

  getBranchPool = userId => {
    const request = {
        url: `${process.env.REACT_APP_BASE_URL}/branch-pool/${userId}`,
        method: 'get',
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        }
    }

    axios(request)
    .then(res => {
        console.log (`Layout001.js getBranchPool(${userId}) axios response.data`, res.data.message[0]);
        this.setBranchPool(res.data.message[0].user_id, JSON.parse(res.data.message[0].branch_pool));
    })
    .catch(err => {
        console.error (`Layout001.js getBranchPool(${userId}) axios error`, err);
    })
  }

  updateActiveModule = moduleId => {
    this.setState({activeModule: moduleId});
  }

  updateActiveModuleType = (moduleName, moduleIcon) => {
    this.setState({
      activeModuleName: moduleName,
      activeModuleIcon: moduleIcon
    })
  }

  updateActiveModuleContent = content => {
    this.setState({activeModuleContent: content})
  }
  
  controlHandler = type => {
    console.log(`Layout001.js controlHandler(${type})`);
    if (type === null) {
      this.setState({
        controlState: null,
      })
      return;
    }

    const saveModule = type.toLowerCase() === 'save' ? true : false;
    this.setState({
      controlState: type,
      saveModule: saveModule
    })
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
      treeId: treeId,
      branchId: false
    })
  }

  setBranch = branchId => {
    console.log(`Layout001.js setBranch (${branchId}:${typeof branchId})`);
    this.setState({
      branchId: branchId
    })
  }

  moduleSaved = () => {
    this.setState({saveModule: false});
  }

  componentDidMount() {
    window.addEventListener('resize', this.windowResize);
    this.getBranchPool(this.props.userId);
  }

  render () {
    const {windowState, windowHeight, windowWidth, toggleWindow, setTheTree, userId, userName} = this.props;

    console.log (`Layout001.js render()`);

    if (windowWidth > 768) {
      return (
        <div className="app">
          <Controls
            windowState={windowState}
            toggleWindow={toggleWindow}
            controlHandler={this.controlHandler}/>
          <Branches
            windowState={windowState}
            toggleWindow={toggleWindow}
            treeId={this.state.treeId}
            branchId={this.state.branchId}
            branchPool={this.state.branchPool}
            setBranchPool={this.setBranchPool}
            setBranch={this.setBranch}
            userId={userId}
            linkIcon={linkIcon}
            closeIcon={closeIcon}
            controlState={this.state.controlState}
            controlHandler={this.controlHandler}
            moduleId={this.activeModule}
            updateActiveModule={this.updateActiveModule}/>
          <Leaves 
            windowState={windowState}
            toggleWindow={toggleWindow}
            linkIcon={linkIcon}
            closeIcon={closeIcon}
            branchId={this.state.branchId}
            saveModule={this.state.saveModule}
            moduleSaved={this.moduleSaved}/>
          <Trees 
            windowState={windowState}
            icontoggleWindow={toggleWindow}
            setTheTree={this.setTheTree}
            userName={userName}
            userId={userId}
            iconList={iconList}
            treeId={this.state.treeId}
            linkIcon={linkIcon}
            closeIcon={closeIcon}/>
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

export default Layout001;
