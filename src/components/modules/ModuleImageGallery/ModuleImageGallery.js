import React, { Component } from 'react';
import './ModuleImageGallery.scss';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import displayImagesIcon from '../../../assets/icons/display-images.svg';
import editImagesIcon from '../../../assets/icons/edit-images.svg';
import uploadImagesIcon from '../../../assets/icons/upload-images.svg';
import ImageMover from '../../Layout001/ImageMover/ImageMover';
import ImageGallery from 'react-image-gallery';
import ShowImageGallery from '../../Layout001/ShowImageGallery/ShowImageGallery';
import UploadModuleAssets from '../../Layout001/UploadModuleAssets/UploadModuleAssets';


export class ModuleImageGallery extends Component {


    displayImages = () => {
      
            return (
                <ShowImageGallery
                    content={this.props.content}
                    setButton={this.setButton}
                    userId={this.props.userId} />
            )
        
    }


    componentDidUpdate() {
        // console.log('ModuleImageGallery componentDidUpate', 'content', this.props.content);
    }

  render() {
    let {userId, content, setContent, view} = this.props;

    return (
        <UploadModuleAssets
            view={view}
            userId={userId}
            content={content}
            setContent={setContent}
            display={this.displayImages}
            turnDisplayOff={() => {}} />
    )
  }
}

export default ModuleImageGallery