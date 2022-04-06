import React from 'react';
import './ImageMover.scss';

function ImageMover({url, index, clickHandler, state}) {
  return (
    <div className='image-mover'>
        <img className="image-mover__image" src={url} />
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
    </div>
  )
}

export default ImageMover