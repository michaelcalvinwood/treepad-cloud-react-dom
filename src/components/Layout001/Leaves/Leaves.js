import './Leaves.scss';
import 'react-quill/dist/quill.snow.css';
import React from 'react';
import treepadIcon from '../../../assets/icons/treepadcloud-icon.svg';
import axios from 'axios';
import ModuleSelector from '../ModuleSelector/ModuleSelector';

import ModuleQuill from '../../modules/ModuleQuill/ModuleQuill';
import ModuleImageGallery from '../../modules/ModuleImageGallery/ModuleImageGallery';
import ModuleVideoGallery from '../../modules/ModuleVideoGallery/ModuleVideoGallery';

// add items to quill toolbar
// const modules = {
//   toolbar: [
//       ['image']
//   ]
// }

class Leaves extends React.Component {

  setContent = content => {
    console.log (`Leaves.js setContent`, content);

    this.props.updateModuleContent(content);
  }

  changeModule = () => {
    this.saveModuleContent();

    this.props.updateModuleId(0);
    this.props.updateModuleName('');
    this.props.updateModuleIcon('');
    this.props.updateModuleContent('');

  }

  displayLandingPage = sectionClassName => {
    return (
      <section className={sectionClassName}>
        <div className='leaves__landing-page'>
          <div className='leaves__landing-page-container'>
            <img className='leaves__landing-page-icon' src={treepadIcon} />
            <h1 className='leaves__landing-page-title'>TreePad Cloud</h1>  
          </div>
        </div>
        </section>
    )
  }

  saveModuleContent = () => {
    const {moduleName, moduleContent, moduleSaved, branchId} = this.props;

    console.log('Leaves.js saveModuleContent', 'moduleName', moduleName, 'moduleContent', moduleContent);

    if (!moduleName) return moduleSaved();

    const request = {
      url: `${process.env.REACT_APP_BASE_URL}/modules/${moduleName}/${branchId}`,
      method: 'post',
      data: {
        content: JSON.stringify(this.props.moduleContent)
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

    moduleSaved();
  }

  displayModule = () => {
    return (<div>this.props.moduleId</div>)
  }

  getActiveModuleContent = (moduleName, branchId) => {
    const request = {
      url: `${process.env.REACT_APP_BASE_URL}/modules/${moduleName}/${branchId}`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
      }
    }

    axios(request)
    .then(res => {
      console.log(`Branches.js getActiveModule ${moduleName} for ${branchId} axios`, res)
      
      this.props.updateModuleContent(JSON.parse(res.data.content));
    })
    .catch(err => {
      console.error(`Branches.js getActiveModule axios error`, err);
      
      this.props.updateModuleContent([]);
    })
  }

  getActiveModule = (override) => {
    const { branchId } = this.props;
    console.log('Leaves.js getActiveModule', 'branchId', branchId, 'moduleId', this.props.moduleId, 'override', override);
    if (branchId === false) return;
    
    if (override === undefined) {
      if (branchId === this.props.moduleId) return;
    }

    this.props.updateModuleId(branchId);
    this.props.updateModuleName('');
    this.props.updateModuleIcon('');
  
    const request = {
      url: `${process.env.REACT_APP_BASE_URL}/modules/${branchId}`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
      }
    }

    axios(request)
    .then(res => {
      console.log(`Leaves.js getActiveModule axios`, res.data)
  
      this.props.updateModuleName(res.data.moduleName);
      this.props.updateModuleIcon(res.data.moduleIcon);
      this.getActiveModuleContent(res.data.moduleName, branchId);
    })
    .catch(err => {
      this.props.updateModuleContent([]);
    })
  }

  setActiveModule = (moduleName) => {
    const { branchId } = this.props;
    console.log('Leaves.js setActiveModule', 'branchId', branchId, 'moduleName', moduleName);
    if (branchId === false) return;
    
    this.props.updateModuleId(branchId);
    this.props.updateModuleName('');
    this.props.updateModuleIcon('');
  
    const request = {
      url: `${process.env.REACT_APP_BASE_URL}/modules/${branchId}`,
      method: 'put',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
      },
      data: {
        module: moduleName ? moduleName : 'null'
      }
    }

    axios(request)
    .then(res => {
      console.log(`Leaves.js setActiveModule axios`, res.data)
  
      this.props.updateModuleName(res.data.moduleName);
      this.props.updateModuleIcon(res.data.moduleIcon);
      this.getActiveModuleContent(res.data.moduleName, branchId);
    })
    .catch(err => {
      this.props.updateModuleContent([]);
    })
  }
 
  
  displayModuleTitle = () => {
    console.log('Leaves.js displayModuleTitle', 'moduleName', this.props.moduleName, "color:red");
    if (!this.props.moduleName) {
      return (<p className='leaves__default-title'>Branch Contents</p>)
    }

    return (
      
        <div className="leaves__title">      
          <img 
            className='leaves__icon' 
            onClick={this.changeModule}
            src={`${process.env.REACT_APP_BASE_URL}${this.props.moduleIcon}`} 
            alt="leaf" />
          <p className='leaves__name'>{this.props.moduleName.replaceAll('_', ' ')}</p>
        </div>
    )
  }

  componentDidUpdate() {
    this.getActiveModule();

    if (this.props.saveModule) this.saveModuleContent();
  }

  componentDidMount() {
    this.getActiveModule();

    if (this.props.saveModule) this.saveModuleContent();
  }


  // This is the main workhorse. Every time a new module is added, simply import the component at the top, and add a case 


  displayModule = () => {
    const {userId, branchId, moduleName, moduleContent} = this.props;

    console.log(`Leaves.js displayModule ${moduleName}`, moduleContent);

    if (!moduleName) {
      return (
        <ModuleSelector
          branchId={branchId}
          getActiveModule={this.getActiveModule}/>
      )
    }

    // 

    switch(this.props.moduleName) {
      case 'quill':
        return (
          <ModuleQuill
            content={moduleContent}
            setContent={this.setContent} />
        )
      case 'image_gallery':
        return (
          <ModuleImageGallery
            userId={userId}
            content={moduleContent}
            setContent={this.setContent}
          />
        )
      case 'videos':
        return (
          <ModuleVideoGallery
            userId={userId}
            content={moduleContent}
            setContent={this.setContent}
          />
        )
      default:
        return (
          <div className='leaves__no-module'>
              <p className='leaves__no-module-notice'>
                {`The ${this.props.moduleName} module is not installed on the server. Please contact system administrator.`}
              </p>
              <p className='leaves__no-module-notice'>
                {`Please click the ${this.props.moduleName} icon to choose another module.`}
              </p>
          </div>
        )
    }
  }


  render () {
    const {windowState, toggleWindow, linkIcon, closeIcon, branchId} = this.props;
    console.log(`Leaves.js render`, 'branchId', branchId, 'moduleId', this.props.moduleId);

    // if (!branchId) return this.displayLandingPage();

    let sectionClassName = 'leaves leaves--active';
    let contentClassName = 'leaves__content';
  
    if (windowState.trees) sectionClassName += '-trees';
    if (windowState.branches) sectionClassName += '-branches';
    if (windowState.leaves) {
      sectionClassName += '-leaves';
    } 
    if (windowState.controls) sectionClassName += '-controls';
  
    // console.log (sectionClassName)

    if (!this.props.moduleId) {
      return this.displayLandingPage(sectionClassName)
    }

    return (
      <section className={sectionClassName}>
        <img className="leaves__link" src={linkIcon} />
        <img className="leaves__close" src={closeIcon} />
        <div className="leaves__title-container">
           {this.displayModuleTitle()}
        </div>
        <div className='leaves__content'>
          {this.displayModule()}
        </div>
        </section>
    )
  }
  
}

export default Leaves