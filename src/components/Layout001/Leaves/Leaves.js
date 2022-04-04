import './Leaves.scss';
import 'react-quill/dist/quill.snow.css';
import React from 'react';
import treepadIcon from '../../../assets/icons/treepadcloud-icon.svg';
import axios from 'axios';
import ModuleSelector from '../ModuleSelector/ModuleSelector';
// import leaf modules
import ModuleQuill from '../../modules/ModuleQuill/ModuleQuill';
import ModuleImageGallery from '../../modules/ModuleImageGallery/ModuleImageGallery';

// add items to quill toolbar
const modules = {
  toolbar: [
      ['image']
  ]
}

class Leaves extends React.Component {

  // state = {
  //   moduleId: 0,
  //   moduleName: '',
  //   moduleIcon: '',
  //   moduleContent: []
  // }

  setContent = content => {
    console.log (`Leaves.js setContent`, content);
    // this.setState({moduleContent: content})

    this.props.updateModuleContent(content);
  }

  // resetModule = () => {
  //   this.setState({
  //     moduleId: 0,
  //     moduleName: '',
  //     moduleIcon: '',
  //     moduleContent: []
  //   })
  // }

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
      console.warn(`Leaves.js getActiveModule axios`, res.data)
  
      this.props.updateModuleName(res.data.moduleName);
      this.props.updateModuleIcon(res.data.moduleIcon);
      this.getActiveModuleContent(res.data.moduleName, branchId);
    })
    .catch(err => {
      this.props.updateModuleContent([]);
    })
  }
 
  displayModule = () => {
    console.log(`Leaves.js displayModule ${this.props.moduleName}`, this.props.moduleContent);

    if (!this.props.moduleName) {
      return (
        <ModuleSelector
          branchId={this.props.branchId}
          getActiveModule={this.getActiveModule}/>
      )
    }

    switch(this.props.moduleName) {
      case 'quill':
        return (
          <ModuleQuill
            content={this.props.moduleContent}
            setContent={this.setContent} />
        )
      case 'image_gallery':
        return (
          <ModuleImageGallery
            content={this.props.moduleContent}
            setContent={this.setContent}
            userId={this.props.userId} />
        )
      default:
        return (<div>No module</div>)

    }
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