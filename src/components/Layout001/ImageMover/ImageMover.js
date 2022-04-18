import React from 'react';
import './ImageMover.scss';
import deleteIcon from '../../../assets/icons/delete.svg';
import editIcon from '../../../assets/icons/edit.svg';

class ImageMover extends React.Component {
  
  constructor(props) {
    super(props);


  }

  
  state = {
    urlState: 'unknown',
  }

  extractFilename = url => {
    let parts = url.split('/');
    return parts[parts.length-1]
  }
  showImage = () => {
    const {url} = this.props;

    let parts = url.split('.');
    if (parts.length === 1) return '';

    let extension = parts[parts.length - 1];

    console.log('ImageMover.js showImage', 'extension', extension);

    switch(extension.toLowerCase()) {
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'bmp':
        return <img className="image-mover__image" src={url} />
      
      default:
        return (
          <div className="image-mover__document">{this.extractFilename(url)}</div>
        )
    }
  }


  render() {
    const {url, index, clickHandler, state} = this.props;

    return (
      <div className='image-mover'>
          {this.showImage()}
          <div 
            className={state ? "image-mover__up" : "image-mover__up image-mover--inactive"}
            onClick={(e) => clickHandler(e, index, 'up')}>
          </div>
          <div 
            className={state ? "image-mover__down" : "image-mover__down image-mover--inactive"}
            onClick={(e) => clickHandler(e, index, 'down')}>
          </div>        <div 
            className={state ? "image-mover__left" : "image-mover__left image-mover--inactive"}
            onClick={(e) => clickHandler(e, index, 'left')}>
          </div>        <div 
            className={state ? "image-mover__right" : "image-mover__right image-mover--inactive"}
            onClick={(e) => clickHandler(e, index, 'right')}>
          </div>
          <div className='image-mover__edit-container'>
            {state ?  
              <img
                className='image-mover__delete'
                src={deleteIcon} /> : ''}
          </div>  
      </div>
    )
  }
}

export default ImageMover