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
import IconDocker from './IconDocker/IconDocker';

class Layout001 extends Component {

  state = {
    branchPool: [],
    branchId: 0,
    treeId: -2,
    controlState: null,
    saveModule: false,
    moduleId: 0,
    moduleName: '',
    moduleIcon: '',
    moduleContent: []
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
        console.clear();
        console.log (`Layout001.js getBranchPool(${userId}) axios response.data`, res.data.message[0]);
        this.setBranchPool(res.data.message[0].user_id, JSON.parse(res.data.message[0].branch_pool));
    })
    .catch(err => {
        console.error (`Layout001.js getBranchPool(${userId}) axios error`, err);
    })
  }

  updateModuleId = moduleId => {
    this.setState({moduleId: moduleId})
  }

  updateModuleName = moduleName => {
    this.setState({moduleName: moduleName})
  }

  updateModuleIcon = moduleIcon => {
    this.setState({moduleIcon: moduleIcon})
  }

  updateModuleContent = moduleContent => {
    this.setState({moduleContent: moduleContent})
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
  
  saveModuleContentSync = (branchId) => {
    const {moduleName, moduleContent} = this.state;
    console.log('Leaves.js saveModuleContentSync', branchId, moduleName, moduleContent);

    if (!moduleName) return;

    const request = {
      url: `${process.env.REACT_APP_BASE_URL}/modules/${moduleName}/${branchId}`,
      method: 'post',
      data: {
        content: JSON.stringify(moduleContent)
      },
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
      }
    }

    axios(request)
    .then(res => {
      console.log('Leaves.js saveModuleContent axios', res.data);
    })
    .catch(err => {
      console.error('Leaves.js saveModuleContent axios', err);
    })

  }

  controlHandler = type => {
    console.log(`Layout001.js controlHandler(${type})`);
    
    let saveModule;

    if (type === null) saveModule = false;
    else saveModule = type.toLowerCase() === 'save' ? true : false;
    
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
        method: 'delete',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        }
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

  setBranch = (branchId) => {
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
    const {windowState, windowHeight, windowWidth, toggleWindow, setWindowState, setTheTree, userId, userName} = this.props;

    console.log (`Layout001.js render()`);

    if (windowWidth > 768) {
      return (
        <div className="app">
          <Controls
            windowState={windowState}
            toggleWindow={toggleWindow}
            linkIcon={linkIcon}
            closeIcon={closeIcon}
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
            updateActiveModule={this.updateActiveModule}
            saveModuleContentSync={this.saveModuleContentSync}/>
          <Leaves 
            windowState={windowState}
            toggleWindow={toggleWindow}
            linkIcon={linkIcon}
            closeIcon={closeIcon}
            branchId={this.state.branchId}
            saveModule={this.state.saveModule}
            moduleSaved={this.moduleSaved}
            userId={userId}
            moduleId={this.state.moduleId}
            moduleName={this.state.moduleName}
            moduleIcon={this.state.moduleIcon}
            moduleContent={this.state.moduleContent}
            updateModuleId={this.updateModuleId}
            updateModuleName={this.updateModuleName}
            updateModuleIcon={this.updateModuleIcon}
            updateModuleContent={this.updateModuleContent}/>
          <Trees 
            windowState={windowState}
            toggleWindow={toggleWindow}
            setTheTree={this.setTheTree}
            userName={userName}
            userId={userId}
            iconList={iconList}
            treeId={this.state.treeId}
            linkIcon={linkIcon}
            closeIcon={closeIcon}/>
          <IconDocker
            windowState={windowState}
            setWindowState={setWindowState}
            />
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
