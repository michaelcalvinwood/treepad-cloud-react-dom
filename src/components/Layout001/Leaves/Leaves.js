import './Leaves.scss';
import leafIcon from '../../../assets/icons/leaf.svg';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import React from 'react';

// add items to quill toolbar
const modules = {
  toolbar: [
      ['image']
  ]
}

class Leaves extends React.Component {

  handleQuill = content => {
    console.log (content);
  }

  render () {
    const {windowState, clickHandler, linkIcon} = this.props;

    const  modules  = {
      toolbar: [
          [{ font: [] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ script:  "sub" }, { script:  "super" }],
          ["blockquote", "code-block"],
          [{ list:  "ordered" }, { list:  "bullet" }],
          [{ indent:  "-1" }, { indent:  "+1" }, { align: [] }],
          ["link", "image", "video"],
          ["clean"],
      ],
  };
  
    console.group('Leaves');
    console.log(windowState);
  
    let sectionClassName = 'leaves leaves--active';
    let titleClassName = 'leaves__title';
    let contentClassName = 'leaves__content';
  
    if (windowState.trees) sectionClassName += '-trees';
    if (windowState.branches) sectionClassName += '-branches';
    if (windowState.leaves) {
      sectionClassName += '-leaves';
    } else {
      titleClassName += ' -closed';
    }
    if (windowState.controls) sectionClassName += '-controls';
  
    console.log (sectionClassName)
   
    console.groupEnd();
    return (
      <section className={sectionClassName}>
        <div className={titleClassName}>
        <img className="leaves__link" src={linkIcon} />
          <img 
            className='leaves__icon' 
            onClick={e => clickHandler(e, 'leaves')} 
            src={leafIcon} 
            alt="leaf" />
        </div>
        <div className='leaves__content'>
          <ReactQuill 
            className="leaves__quill" 
            onChange={this.handleQuill}
            modules={modules} 
            theme="snow"/>
        </div>
        </section>
    )
  }
  
}

export default Leaves