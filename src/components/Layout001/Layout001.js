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
import UrlSelector from './UrlSelector/UrlSelector';

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
    moduleContent: [],
    branchHasChanged: false,
    moduleHasChanged: false,
    displayCloudLink: false,
    cloudLinkType: 'Branch View',
    cloudLinkUrl: '', 
  }

  setCloudLink = state => {
    this.setState({displayCloudLink: state});
  }

  setUrlSelector = (linkType, linkUrl) => {
    this.setState({
      displayCloudLink: true,
      cloudLinkType: linkType,
      cloudLinkUrl: linkUrl
    })
  }

  setBranchHasChanged = state => {
    this.setState({branchHasChanged: state})
  }

  setModuleHasChanged = state => {
    this.setState({moduleHasChanged: state})
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
    })
    .catch(err => {
      console.error('Leaves.js saveModuleContent axios', err);
    })

  }

  controlHandler = type => {
    let saveModule;

    if (type === null) saveModule = false;
    else saveModule = type.toLowerCase() === 'save' ? true : false;
    
    this.setState({
      controlState: type,
      saveModule: saveModule
    })
  }

  addBranchToBranchPool = branchId => {
    let modifiedPool = [...this.state.branchPool];
    modifiedPool.push(branchId);
    this.setState({
      branchPool: modifiedPool
    })
  }

  setBranchPool = (userId, branchPool, treeId, removedBranch = false) => {
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
        const {userId, branchId} = res.data;
        this.addBranchToBranchPool(branchId);
      })
      .catch(err => {
        console.error(`Layout001.js setBranchPool axios error`, err);
      })
    }
  }

  setTheTree = treeId => {
    this.setState({
      treeId: treeId,
      branchId: false
    })
  }

  setBranch = (branchId) => {
    this.setState({
      branchId: branchId
    })
  }

  moduleSaved = () => {
    this.setState({saveModule: false});
  }

  handleKeyUp = e => {
    e.preventDefault();
    if (e.code === 'ShiftLeft') {
      this.controlHandler('Save');
    }

    return false;
  }

  componentDidUpdate() {
    const {viewTreeId, viewBranchId} = this.props;
    if (viewTreeId && viewTreeId !== this.state.treeId) {
      this.setTheTree(viewTreeId);
    }
    if (viewBranchId && viewBranchId !== this.state.branchId) {
      this.setBranch(viewBranchId);
    }
  }

  componentDidMount() {
    const {viewTreeId, viewBranchId} = this.props;

    window.addEventListener('resize', this.windowResize);
    window.addEventListener('keyup', this.handleKeyUp);
    this.getBranchPool(this.props.userId);
    if (viewTreeId && viewTreeId !== this.state.treeId) {
      this.setTheTree(viewTreeId);
    }
    if (viewBranchId && viewBranchId !== this.state.branchId) {
      this.setBranch(viewBranchId);
    }
  }

  render () {
    const {windowState, windowHeight, windowWidth, toggleWindow, setWindowState, setTheTree, userId, userName, view} = this.props;

    if (windowWidth > 768) {
      return (
        <div 
          className="app">
            <Controls
              windowState={windowState}
              toggleWindow={toggleWindow}
              linkIcon={linkIcon}
              closeIcon={closeIcon}
              controlHandler={this.controlHandler}
              branchHasChanged={this.state.branchHasChanged}
              moduleHasChanged={this.state.moduleHasChanged}/>
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
              saveModuleContentSync={this.saveModuleContentSync}
              setBranchHasChanged={this.setBranchHasChanged}
              setUrlSelector={this.setUrlSelector}
              userName={userName}/>
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
              updateModuleContent={this.updateModuleContent}
              setModuleHasChanged={this.setModuleHasChanged}
              userName={userName}
              view={view}/>
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
              view={view}
              />
            <UrlSelector
              display={this.state.displayCloudLink}
              linkType={this.state.cloudLinkType}
              url={this.state.cloudLinkUrl}
              setCloudLink={this.setCloudLink} />
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
