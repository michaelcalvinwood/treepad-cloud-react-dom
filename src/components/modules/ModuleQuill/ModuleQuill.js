import React, { Component } from 'react';
import './ModuleQuill.scss'
import ReactQuill, { Quill } from 'react-quill';

export class ModuleQuill extends Component {

  componentDidMount() {
    
  }

  saveFormattedContent = content => {
    const contentArray = [];
    contentArray.push(content);
    this.props.setContent(contentArray);
  }

  render() {
    let {content} = this.props;
    if (!content.length) content = '';
    else content = content[0];

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
    return (
        <ReactQuill 
        id="react-quill"
        className="leaves__quill" 
        value={content}
        onChange={this.saveFormattedContent}
        modules={modules} 
        theme="snow"/>
    )
  }
}

export default ModuleQuill