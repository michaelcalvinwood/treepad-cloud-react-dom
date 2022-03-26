import React, { Component } from 'react';
import './Modals.scss';
import defaultModal from './DefaultModal';

import addTree from './AddTree/AddTree';
import './AddTree/AddTree.scss';

export class Modals extends Component {

    state = {
        modalName: '',
        modalInfo: {},
        modalReturn: {}
    }

    updateState = () => {
        return this.setState;
    }

    getModalContent = () => {
        console.log ('getModalContent', this.state.modalName, this.state.modalInfo);
                
        switch (this.state.modalName) {
            case 'defaultModal':
                return defaultModal();

            case 'addTree':
                return addTree(this.state.modalInfo, this.updateState);

            default:
                console.log (`unknown modal ${this.state.modalName}`);
                this.setState({modalName: ''});
        }
    }

    componentDidMount() {
        if (this.props.modalName) {
            this.setState({ 
                modalName: this.props.modalName,
                modalInfo: this.props.modalInfo 
            });
        }
    }

    closeModal = () => {
        this.props.closeModal(this.state.modalReturn);
    }

  render() {

    if (this.props.modalComponent) {
        return (
            <div className='modals'>
                <div className='modals__modal'>
                  {this.props.modalComponent}
                  <button 
                      className='modals__close'
                      onClick={this.closeModal}>
                      Close</button>
                </div> 
            </div>
          )
    }
      
    if (!this.state.modalName) return (
        <div className="modals modals--inactive"></div>
      );

    const modalContent = this.getModalContent();
    return (
      <div className='modals'>
          <div className='modals__modal'>
            {modalContent}
            <button 
                className='modals__close'
                onClick={this.closeModal}>
                Close</button>
          </div>
          
      </div>
    )
  }
}

export default Modals