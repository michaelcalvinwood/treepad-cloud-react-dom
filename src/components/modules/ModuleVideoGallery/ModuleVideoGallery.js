import React, { Component } from 'react';
import './ModuleVideoGallery.scss';
import ShowImageGallery from '../../Layout001/ShowImageGallery/ShowImageGallery';
import UploadModuleAssets from '../../Layout001/UploadModuleAssets/UploadModuleAssets';
import ImageMover from '../../Layout001/ImageMover/ImageMover';
import ReactPlayer from 'react-player'

export class ModuleVideoGallery extends Component {

  state = {
    displayThumbnails: true,
    playVideo: false,
    selectedVideo: -1
  }

    turnDisplayOff = () => {
      this.setState({
        displayThumbnails: true,
        playVideo: false,
        selectedVideo: -1
      })
    }

    clickHandler = (e, index) => {
      if (this.state.playVideo) return this.turnDisplayOff();
      
      this.setState({
        displayThumbnails: false,
        playVideo: true,
        selectedVideo: index
      })
    }

    getVideoNameFromThumbnail = (thumbnail, extension) => {
      const loc = thumbnail.indexOf('-thumbnail-320x240-0001.png');
      return thumbnail.substring(0, loc) + extension;
    }
  
    displayVideos = () => {
      if (this.state.playVideo) {
        const videoName = this.getVideoNameFromThumbnail(this.props.content[this.state.selectedVideo], ".mp4");
        
        const videoUrl = `${process.env.REACT_APP_BASE_URL}/asset/${this.props.userId}/${videoName}`;
        const thumbnailUrl = `${process.env.REACT_APP_BASE_URL}/asset/${this.props.userId}/${this.props.content[this.state.selectedVideo]}`

        return (
          <video
            className="module-video-gallery__video"
            controls
            preload="auto"
            poster={thumbnailUrl}
            data-setup='{}'>
            <source src={videoUrl} type="video/mp4"></source>
          </video>
          ) 
      }

      return (
        <div className='module-video-gallery__container'>
          {this.props.content.map((fileName, index) => {
            return( 
              <div className='module-video-gallery__gallery'>
                <img 
                  className='module-video-gallery__img'
                  src={`${process.env.REACT_APP_BASE_URL}/asset/${this.props.userId}/${fileName}`} 
                  onClick={(e) => this.clickHandler(e, index)}/>
              </div>
            )
            })}
        </div>
      )
      
      
      this.props.content.map((fileName, index) => {
        return <ImageMover 
            url={`${process.env.REACT_APP_BASE_URL}/asset/${this.props.userId}/${fileName}`} 
            index={index}
            clickHandler={this.clickHandler}
            state={false}/>
        })
        
    }


    componentDidUpdate() {
        console.log('ModuleVideoGallery componentDidUpate', 'content', this.props.content);
    }

  render() {
    let {userId, content, setContent} = this.props;

    return (
        <UploadModuleAssets
            userId={userId}
            content={content}
            setContent={setContent}
            display={this.displayVideos}
            turnDisplayOff={this.turnDisplayOff} />
    
    )
  }
}

export default ModuleVideoGallery