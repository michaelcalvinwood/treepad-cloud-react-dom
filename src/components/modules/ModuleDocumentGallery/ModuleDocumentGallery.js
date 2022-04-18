import React, { Component } from 'react';
import './ModuleDocumentGallery.scss';
import ShowImageGallery from '../../Layout001/ShowImageGallery/ShowImageGallery';
import UploadModuleAssets from '../../Layout001/UploadModuleAssets/UploadModuleAssets';
import ImageMover from '../../Layout001/ImageMover/ImageMover';
import ReactPlayer from 'react-pdf';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

export class ModuleDocumentGallery extends Component {

  constructor (props) {
    super(props)
    this.state = {
      numPages: null,
      pageNumber: 1,
      displayThumbnails: true,
      showDocument: false,
      selectedDocument: -1  
    }   
}

    turnDisplayOff = () => {
      this.setState({
        displayThumbnails: true,
        showDocument: false,
        selectedDocument: -1
      })
    }

    clickHandler = (e, index) => {
      if (this.state.showDocument) return this.turnDisplayOff();
      
      this.setState({
        displayThumbnails: false,
        showDocument: true,
        selectedDocument: index
      })
    }

    setPages = loadInfo => {
      console.log('ModuleDocumentGallery onDocumentLoadSuccess', loadInfo);
      const {numPages} = loadInfo;

      console.log('numPages', numPages);
      // setNumPages(numPages);
    }

    displayDocuments = () => {
      if (this.state.showDocument) {
        let url = `${process.env.REACT_APP_BASE_URL}/asset/${this.props.userId}/${this.props.content[this.state.selectedDocument]}`;
        
        console.log('ModuleDocumentGallery displayDocuments', 'url', url);
        return (
          <Document file={url} onLoadSuccess={(info) => this.setPages(info)} onLoadError={console.error}>
             <Page pageNumber={1} />
          </Document>
        )
      }

      return (
        <div className='module-document-gallery__container'>
          {this.props.content.map((fileName, index) => {
            return( 
              <div 
                className='module-document-gallery__gallery'
                onClick={(e) => this.clickHandler(e, index)}>
                {`${fileName}`} 
              </div>
            )
            })}
        </div>
      )
        
    }


    componentDidUpdate() {
    }

  render() {
    let {userId, content, setContent, view} = this.props;

    return (
        <UploadModuleAssets
            view={view}
            userId={userId}
            content={content}
            setContent={setContent}
            display={this.displayDocuments}
            turnDisplayOff={this.turnDisplayOff} />
    
    )
  }
}

export default ModuleDocumentGallery