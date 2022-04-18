import React, { Component } from 'react';
import './UrlSelector.scss';

export class UrlSelector extends Component {

    state = {
        customLink: '',
        notificationList: ''
    }

    submitUrlInfo = () => {
        const {setCloudLink} = this.props;

        setCloudLink(false);
    }

  render() {
    const {url, display, linkType, setCloudLink} = this.props;

    if (!display) return (<></>);

    return (
        <div className='url-selector'>
            <div className='url-selector__content-container'>
                <a 
                    className="url-selector__primary-link"
                    href={this.state.customUrl ? this.state.customUrl : url} 
                    target="_blank" >
                    <h1 className='url-selector__current-link'>{this.state.customUrl ? this.state.customUrl : url}</h1>
                </a>
                <h3 className='url-selector__current-link-type'>{linkType}</h3>
                <input 
                    className='url-selector__custom-link'
                    placeholder='custom link (optional)'/>
                <div className='url-selector__root-container'>
                    <input
                        type="checkbox"
                        className='url-selector__root-checkbox' />
                    <p
                        className='url-selector__root-label'>
                        Set as root
                    </p>
                </div>
                <textarea 
                    className='url-selector__email-notification-list'
                    placeholder="email notification list (format: email, first name, last name)"/>
                <div className='url-selector__authentication-container'>
                    <input
                        type="checkbox"
                        className='url-selector__authentication-checkbox' />
                    <p
                        className='url-selector__authentication-label'>
                        Require authentication
                    </p>
                </div>
                <button 
                    className='url-selector__submit'
                    onClick={this.submitUrlInfo} >
                    Submit
                </button>
            </div>
      </div>
    )
  }
}

export default UrlSelector