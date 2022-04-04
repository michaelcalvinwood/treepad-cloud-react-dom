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


export class ModuleImageGallery extends Component {

    state = {
        uploadImages: true,
        editImages: false,
        displayImages: false
    }
    
    setButton = (e, button) => {
        switch (button) {
            case 'upload':
                this.setState({
                    uploadImages: true,
                    editImages: false,
                    displayImages: false
                })
                return;
            case 'edit':
                this.setState({
                    uploadImages: false,
                    editImages: true,
                    displayImages: false
                })
                    return;
            case 'display':
                this.setState({
                    uploadImages: false,
                    editImages: false,
                    displayImages: true
                })
                return;
        }
    }

    moveItem = (index, relativeMovement) => {
        console.log('ModuleImageGallery moveItem', 'index', index, 'relativeMovement', relativeMovement)
        let modifiedContent = [...this.props.content];

        let desiredIndex;
        
        if (relativeMovement <= 0) {
            desiredIndex = index + relativeMovement;
        } else {
            desiredIndex = index + relativeMovement; // when moving forward the index will change when first spliced
        }
        
        if (desiredIndex < 0) return;
        if (desiredIndex >= modifiedContent.length) return;

        const removed = modifiedContent.splice(index, 1);

        console.log('content', this.props.content);
        console.log ('ModuleImageGallery moveItem', 'removed', removed);
        modifiedContent.splice(desiredIndex, 0, removed[0]);

        this.props.setContent(modifiedContent);

    }

    clickHandler = (e, index, direction) => {
        e.stopPropagation();
        console.log ('ModuleImageGallery.js clickHandler', 'index', index, 'direction', direction);
        console.log ('event', e);

        const {content} = this.props.content;

        if (direction === 'left') {
            return this.moveItem(index, -1);
        }

        if (direction === 'right') {
            return this.moveItem(index, +1)
        }

        const workspaceWidth = document.querySelector('.module-image-gallery__work-space').offsetWidth;
        const imageWidth = document.querySelector('.image-mover__image').offsetWidth + 32; // 2rem padding = 32px
        console.log ('workspaceWidth', workspaceWidth, 'imageWidth', imageWidth);

        let spaceAvailable = workspaceWidth - 64; // subract the 1rem padding from both sides

        let numPicsPerRow = Math.floor(spaceAvailable/imageWidth);

        console.log("pics per row", numPicsPerRow);

        if (direction === 'up') {
            return this.moveItem(index, -numPicsPerRow);
        }

        this.moveItem(index, +numPicsPerRow);
    }

    handleUploadedFiles = files => {
        console.log('ModuleImageGallery handleUploadedFiles', files);

        if (!files.length) return;

        let modifiedContent = this.props.content;

        if (!modifiedContent) modifiedContent = [];

        const formData = new FormData();
        for (let i = 0; i < files.length; i += 1) {
            console.log(files[i]);
            let fileName = files[i].name;
            const parts = fileName.split(/\.(?=[^.]*$)/);
            parts[0] = parts[0].replace(/\W+/g, "-");
            fileName = parts.join(".");
            console.log('ModuleImageGallery handleUploadedFiles', 'sanitized fileName', fileName)
            formData.append("image", files[i], fileName);
            modifiedContent.push(fileName);
        }

        const request = {
            url: `${process.env.REACT_APP_BASE_URL}/assets`,
            method: 'post',
            headers: {
                'Content-Type': `multipart/form-data`,
                'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
            },
            data: formData 
        }
        axios(request)
        .then(res => {
            this.props.setContent(modifiedContent);
            // this.setState({uploadImages: false, editImages: true, displayImages: false});
            console.log('ModuleImageGallery handleUploadedFiles axios', res.data);
            
        })
        .catch(err => {
            console.error('ModuleImageGallery handleUploadedFiles axios', err);
        })
    }

    displayPics = () => {
        const {content} = this.props;
        console.log('ModuleImageGallery.js displayPics', 'content type', typeof content, 'content', content)
        if (!content.length) {
            return (
                <p>Drag 'n' drop some files here, or click to select files</p>
            )
        }
        return content.map((fileName, index) => {
            return <ImageMover 
                url={`${process.env.REACT_APP_BASE_URL}/asset/${this.props.userId}/${fileName}`} 
                index={index}
                clickHandler={this.clickHandler}
                state={this.state.editImages}/>
        })
    }

    bubbleBlocker = e => {
       
        e.stopPropagation();
        e.preventDefault();
        return false;
    }

    uploadImages = () => {
        if (!this.state.uploadImages && !this.state.editImages) return;

        return (
            <Dropzone 
                onDrop={acceptedFiles => this.handleUploadedFiles(acceptedFiles)}
                PreviewComponent={this.preview}>
                    {({getRootProps, getInputProps}) => (
                    <div onClick={e => this.bubbleBlocker(e)}>
                        <section className="module-image-gallery__dropzone-container">
                                <div className='module-image-gallery__dropzone' {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    {this.displayPics()}
                                </div>
                        </section>
                    </div>
                    )}
            </Dropzone>
        )
    }

    displayImages = () => {
        if (this.state.displayImages) {
            return (
                <ShowImageGallery
                    content={this.props.content}
                    setButton={this.setButton}
                    userId={this.props.userId} />
            )
        }
    }


    componentDidUpdate() {
        console.log('ModuleImageGallery componentDidUpate', 'content', this.props.content);
    }

  render() {
    let {content, setContent} = this.props;

    return (
      <div className="module-image-gallery">
          <div className="module-image-gallery__actions">
              <div 
              className={this.state.uploadImages ? "module-image-gallery__action-card module-image-gallery__action-card--active" : "module-image-gallery__action-card"}
              onClick={(e) => this.setButton(e, 'upload')}>
                  <img 
                    className="module-image-gallery__action-image"
                    src={uploadImagesIcon}/>
                  <p className="module-image-gallery__action-title">
                    Upload
                  </p>
              </div>
              <div 
                className={this.state.editImages ? "module-image-gallery__action-card module-image-gallery__action-card--active" : "module-image-gallery__action-card"}
                onClick={(e) => this.setButton(e, 'edit')} >
                  <img 
                    className="module-image-gallery__action-image"
                    src={editImagesIcon}/>
                  <p className="module-image-gallery__action-title">
                    Edit
                  </p>
              </div>
              <div 
                className="module-image-gallery__action-card"
                onClick={(e) => this.setButton(e, 'display')}>
                  <img 
                    className="module-image-gallery__action-image"
                    src={displayImagesIcon}/>
                  <p className="module-image-gallery__action-title">
                    Display
                  </p>
              </div>
          </div>
          <div className="module-image-gallery__work-space">
            {this.uploadImages()}
            {this.displayImages()}
            
          </div>
         
          
      </div>
    )
  }
}

export default ModuleImageGallery