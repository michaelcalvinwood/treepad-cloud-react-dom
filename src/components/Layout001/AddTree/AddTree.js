import React, { Component } from 'react';
import './AddTree.scss';
import IconPicker from '../IconPicker/IconPicker';
import axios from 'axios';

export class AddTree extends Component {
  state = {
    icon: '',
    color: '#000000',
    treeName: '',
    treeDesc: '',
    iconSet: '/regular/'
  }

  updateTreeName = e => {
    this.setState({
      treeName: e.target.value
    })
  }

  updateTreeDesc = e => {
    this.setState({
      treeDesc: e.target.value
    })
  }

  createTree = () => {
    console.log (`Create tree ${this.state.treeName}: ${this.state.treeDesc}\n${this.state.icon}`);
    const request = {
      url: process.env.REACT_APP_BASE_URL + '/trees',
      method: 'post',
      data: {
        icon: this.state.icon,
        userId: this.props.userId,
        treeName: this.state.treeName,
        treeDesc: this.state.treeDesc
      }
    }

      axios(request)
      .then((response) => {
        this.props.closeModal()
      })
      .catch((err) => {
        alert (`Could not create ${this.state.treeName}: ${err.message}`);
      });
  }
  

  setIcon = (icon) => {
    this.setState({icon: icon});
  }

  getSelectedIcon = icon => {
    this.setIcon(icon);
  }

  closeModal = () => {
    this.props.closeModal(this.props.userId, this.state.icon, this.state.color, this.state.treeName);
  }

  componentDidMount() {
    this.setState({icon: this.props.icon})
  }
  
  render() {
    
    const filteredList = this.props.iconList.filter(icon => icon.indexOf(this.state.iconSet) !== -1);

    return (
      <div className='modal'>
          {/* <div className='modal__container'>
              Modal Begin */}
              <div className='add-tree'>  
                  <img className='add-tree__icon' src={process.env.REACT_APP_BASE_URL + this.state.icon} />
                  <input 
                    className="add-tree__tree-name"
                    onChange={this.updateTreeName}
                    placeholder="Tree Name"/>
                  <textarea 
                    className="add-tree__tree-desc"
                    onChange={this.updateTreeDesc}
                    placeholder="Tree Description (optional)" />
                  <button 
                    className="add-tree__create"
                    onClick={this.createTree}>
                    Create</button>
                  <IconPicker 
                    iconList={filteredList}
                    getSelectedIcon={this.getSelectedIcon}
                    // iconSets={sets}
                    setIcon={this.setIcon}/>
                  <button 
                    className='modal__close'
                    onClick={this.closeModal}>
                    Close</button>
                  
              </div>

              {/* Modal End */}
              
          {/* </div> */}
      </div>

    )
  }
}

export default AddTree