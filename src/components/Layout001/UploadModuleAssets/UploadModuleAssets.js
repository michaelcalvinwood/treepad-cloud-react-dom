import React, { Component } from 'react';
import './UploadModuleAssets.scss';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import displayImagesIcon from '../../../assets/icons/display-images.svg';
import editImagesIcon from '../../../assets/icons/edit-images.svg';
import uploadImagesIcon from '../../../assets/icons/upload-images.svg';
import ImageMover from '../../Layout001/ImageMover/ImageMover';


export class UploadModuleAssets extends Component {
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
                this.props.turnDisplayOff();
                return;
            case 'edit':
                this.setState({
                    uploadImages: false,
                    editImages: true,
                    displayImages: false
                })
                this.props.turnDisplayOff();
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
        console.log('UploadModuleAssets moveItem', 'index', index, 'relativeMovement', relativeMovement)
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
        console.log ('UploadModuleAssets moveItem', 'removed', removed);
        modifiedContent.splice(desiredIndex, 0, removed[0]);

        this.props.setContent(modifiedContent);

    }

    clickHandler = (e, index, direction) => {
        e.stopPropagation();
        console.log ('UploadModuleAssets.js clickHandler', 'index', index, 'direction', direction);
        console.log ('event', e);

        const {content} = this.props.content;

        if (direction === 'left') {
            return this.moveItem(index, -1);
        }

        if (direction === 'right') {
            return this.moveItem(index, +1)
        }

        const workspaceWidth = document.querySelector('.upload-module-assets__work-space').offsetWidth;
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

    getFileExtension = fileName => {
        if (!fileName.length) return false;

        const parts = fileName.split('.');

        if (parts.length === 1) return false;

        // abuse prevention
        if (fileName.indexOf('-thumbnail-320x240-0001.png') !== -1) return false;
                
        return parts[parts.length - 1];
    }

    getThumbnailName = (fn, extension) => {
        let parts = [];
        let fileName = '';
        switch (extension.toLowerCase()) {
            case 'gif':
            case 'png':
            case 'jpeg':
            case 'jpg':
                return false;
            case 'mp4':
                parts = fn.split('.');
                parts.pop(); // get rid of extension
                console.log (parts, typeof parts);
                fileName = parts.join('.');
                fileName += '-thumbnail-320x240-0001.png';
                return fileName;
            default:
                return `${fileName}.ThUmBnAiL.jpg`;
        }
    }

    handleUploadedFiles = files => {
        console.log('UploadModuleAssets handleUploadedFiles', files);

        if (!files.length) return;

        let modifiedContent = this.props.content;

        if (!modifiedContent) modifiedContent = [];

        const formData = new FormData();

        let thumbnailStack = [];

        for (let i = 0; i < files.length; i += 1) {
            console.log('UploadModuleAssets handleUploadedFiles', 'file[i]', files[i]);
            let fileName = files[i].name;
            const parts = fileName.split(/\.(?=[^.]*$)/);
            parts[0] = parts[0].replace(/\W+/g, "-");
            fileName = parts.join(".");
            let extension = this.getFileExtension(fileName);
            if (extension) {
                console.log('UploadModuleAssets handleUploadedFiles', 'sanitized fileName', fileName)
                formData.append("image", files[i], fileName);
                
                let thumbnailName = this.getThumbnailName(fileName, extension);
                
                // If image, content stores the name of the image. Else, content stores the name of the thumbnail.
                // Thumbnails with the corresponding name are generated on the server when the file is received. (knex-commands.js uploadAssets())

                if (thumbnailName) {
                    modifiedContent.push(thumbnailName);
                    thumbnailStack.push(fileName);
                }
                else {
                    modifiedContent.push(fileName);
                }
                
            } else {
                alert (`Cannot upload ${fileName}. All files must contain a valid extension (e.g. .jpg, .png, .docx, .mp4, ...)`);
            }
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
            console.log('UploadModuleAssets handleUploadedFiles axios', res.data);
            
            this.createThumbnails(thumbnailStack);
        })
        .catch(err => {
            console.error('UploadModuleAssets handleUploadedFiles axios', err);
        })
    }

    displayPics = () => {
        const {content} = this.props;
        console.log('UploadModuleAssets.js displayPics', 'content type', typeof content, 'content', content)
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

    display = () => {
        if (this.state.displayImages) {
            return this.props.display();
        }
    }

    uploadImages = () => {
        if (!this.state.uploadImages && !this.state.editImages) return;

        return (
            <Dropzone 
                onDrop={acceptedFiles => this.handleUploadedFiles(acceptedFiles)}
                PreviewComponent={this.preview}>
                    {({getRootProps, getInputProps}) => (
                    <div onClick={e => this.bubbleBlocker(e)}>
                        <section className="upload-module-assets__dropzone-container">
                                <div className='upload-module-assets__dropzone' {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    {this.displayPics()}
                                </div>
                        </section>
                    </div>
                    )}
            </Dropzone>
        )
    }

    render() {
        let {content, setContent, view} = this.props;
        
        if (view !== 'userView') return this.props.display();
        
        return (
          <div className="upload-module-assets">
              <div className="upload-module-assets__actions">
                  <div 
                  className={this.state.uploadImages ? "upload-module-assets__action-card upload-module-assets__action-card--active" : "upload-module-assets__action-card"}
                  onClick={(e) => this.setButton(e, 'upload')}>
                      <img 
                        className="upload-module-assets__action-image"
                        src={uploadImagesIcon}/>
                      <p className="upload-module-assets__action-title">
                        Upload
                      </p>
                  </div>
                  <div 
                    className={this.state.editImages ? "upload-module-assets__action-card upload-module-assets__action-card--active" : "upload-module-assets__action-card"}
                    onClick={(e) => this.setButton(e, 'edit')} >
                      <img 
                        className="upload-module-assets__action-image"
                        src={editImagesIcon}/>
                      <p className="upload-module-assets__action-title">
                        Edit
                      </p>
                  </div>
                  <div 
                    className={this.state.displayImages ? "upload-module-assets__action-card upload-module-assets__action-card--active" : "upload-module-assets__action-card"}
                    onClick={(e) => this.setButton(e, 'display')}>
                      <img 
                        className="upload-module-assets__action-image"
                        src={displayImagesIcon}/>
                      <p className="upload-module-assets__action-title">
                        Display
                      </p>
                  </div>
              </div>
              <div className="upload-module-assets__work-space">
                {this.uploadImages()}
                {this.display()}
                
              </div>
             
              
          </div>
        )
    }
}

export default UploadModuleAssets