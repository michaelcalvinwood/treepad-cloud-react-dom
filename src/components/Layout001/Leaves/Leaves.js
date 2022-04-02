import './Leaves.scss';
import 'react-quill/dist/quill.snow.css';
import React from 'react';
import treepadIcon from '../../../assets/icons/treepadcloud-icon.svg';
import axios from 'axios';
import ModuleQuill from '../../modules/ModuleQuill/ModuleQuill';

// add items to quill toolbar
const modules = {
  toolbar: [
      ['image']
  ]
}

class Leaves extends React.Component {

  state = {
    moduleId: 0,
    moduleName: '',
    moduleIcon: '',
    moduleContent: ''
  }

  setContent = content => {
    console.log (`Leaves.js setContent`, content);
    this.setState({moduleContent: content})
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
    console.log('Leaves.js saveModuleContent', this.state.moduleContent);

    const {moduleSaved} = this.props;

    const request = {
      url: `${process.env.REACT_APP_BASE_URL}/modules/${this.state.moduleName}/${this.props.branchId}`,
      method: 'post',
      data: {
        content: this.state.moduleContent
      },
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
      }
    }

    axios(request)
    .then(res => {

    })
    .catch(err => {

    })

    moduleSaved();
  }

  displayModule = () => {
    return (<div>this.state.moduleId</div>)
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
      console.log(`Branches.js getActiveModule axios`, res.data)
      
      this.setState({
        moduleContent: res.data.content,
      })
    })
    .catch(err => {
      console.error(`Branches.js getActiveModule axios error`, err);
    })
  }

  getActiveModule = () => {
    const { branchId } = this.props;
    if (branchId === this.state.moduleId) return;

    this.setState({moduleId: branchId});

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
      
      this.setState({
        moduleName: res.data.moduleName,
        moduleIcon: res.data.moduleIcon
      })
      
      this.getActiveModuleContent(res.data.moduleName, branchId);
    })
    .catch(err => {
      console.error(`Leaves.js getActiveModule axios error`, err);
    })
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
    console.log(`Leaves.js render`, 'branchId', branchId, 'moduleId', this.state.moduleId);

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

    if (!this.state.moduleId) {
      return this.displayLandingPage(sectionClassName)
    }

    return (
      <section className={sectionClassName}>
        <img className="leaves__link" src={linkIcon} />
        <img className="leaves__close" src={closeIcon} />
        <div className="leaves__title-container">
            <div className="leaves__title">      
              <img 
                className='leaves__icon' 
                src={`${process.env.REACT_APP_BASE_URL}${this.state.moduleIcon}`} 
                alt="leaf" />
              <p className='leaves__name'>{this.state.moduleName}</p>
            </div>
        </div>
        <div className='leaves__content'>
          <ModuleQuill
            content={this.state.moduleContent}
            setContent={this.setContent} />
        </div>
        </section>
    )
  }
  
}

export default Leaves