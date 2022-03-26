import React, { Component } from 'react';
import './AddTree.scss';
import IconPicker from '../IconPicker/IconPicker';

export class AddTree extends Component {
  state = {
    icon: '',
    color: '#000000',
    treeName: '',
    iconSet: '/regular/'
  }

  createTree = () => {
    console.log ('create Tree')
  }

  setIcon = (icon) => {
    this.setState({icon: icon});
  }

  getSelectedIcon = icon => {
    this.setIcon(process.env.REACT_APP_BASE_URL + icon);
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
                  <img className='add-tree__icon' src={this.state.icon} />
                  <input 
                    className="add-tree__tree-name"
                    placeholder="Tree Name"/>
                  <textarea 
                    className="add-tree__tree-desc"
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