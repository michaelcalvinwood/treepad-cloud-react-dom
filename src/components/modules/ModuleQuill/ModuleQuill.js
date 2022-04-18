import React, { Component } from 'react';
import './ModuleQuill.scss'
import ReactQuill, { Quill } from 'react-quill';

import htmlEditButton from "quill-html-edit-button";

export class ModuleQuill extends Component {

  componentDidMount() {
    const el = document.querySelector('.ql-toolbar');

    if (this.props.view !== 'userView' && el) el.style.display = 'none'; 
  }

  componentDidUpdate() {
    const el = document.querySelector('.ql-toolbar');

    if (this.props.view !== 'userView' && el) el.style.display = 'none'; 
  }

  saveFormattedContent = content => {
    const contentArray = [];
    contentArray.push(content);
    this.props.setContent(contentArray);
  }

  render() {
    let {content, view} = this.props;
    if (!content.length) content = '';
    else content = content[0];

    Quill.register("modules/htmlEditButton", htmlEditButton);

    let modules = {toolbar: []};

    if (view === 'userView')  {
      modules  = {
        toolbar: [
            [{ font: [] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ script:  "sub" }, { script:  "super" }],
            ["blockquote", "code-block"],
            [{ list:  "ordered" }, { list:  "bullet" }],
            [{ indent:  "-1" }, { indent:  "+1" }, { align: [] }],
            ["link", "image", "video", "code-block"],
            ["clean"],
        ],
        htmlEditButton: {
          debug: true, // logging, default:false
          msg: "Edit the content in HTML format", //Custom message to display in the editor, default: Edit HTML here, when you click "OK" the quill editor's contents will be replaced
          okText: "Ok", // Text to display in the OK button, default: Ok,
          cancelText: "Cancel", // Text to display in the cancel button, default: Cancel
          buttonHTML: "&lt;&gt;", // Text to display in the toolbar button, default: <>
          buttonTitle: "Show HTML source", // Text to display as the tooltip for the toolbar button, default: Show HTML source
          syntax: false, // Show the HTML with syntax highlighting. Requires highlightjs on window.hljs (similar to Quill itself), default: false
          prependSelector: 'div#myelement', // a string used to select where you want to insert the overlayContainer, default: null (appends to body),
          editorModules: {} // The default mod
        }
      };
    }
    
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