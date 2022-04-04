import React, { Component } from 'react';
import './IconPicker.scss';
import IconCard from '../IconCard/IconCard';

export class IconPicker extends Component {
    state = {
        selectedIconSet: 'solid',
        filteredList: [],
        search: ''
    }

    iconName = icon => {
        let loc = 5;
        let end = icon.indexOf('/', loc);
        const set = icon.substring(loc, end);
        let name = icon.substring(end+1);
        loc = name.indexOf('.');
        name = name.substring(0, loc);
        return name;
    }

    // selectedIconSet = iconSet => {
    //     console.log("selected iconSet: " + iconSet);
    //     this.setState({selectedIconSet: iconSet});
    // }

    getIconFilter = e => {
        // console.log (e.target.value);

        const filter = e.target.value.toLowerCase();
        const filteredIcons = this.props.iconList.filter(icon => this.iconName(icon).indexOf(filter) !== -1);
        console.log (filteredIcons.length);
        this.setState({
            filteredList: filteredIcons,
            search: filter
        });
    }

    componentDidMount() {
        if (!this.state.filteredList.length && !this.state.search) {
            this.setState({filteredList: this.props.iconList});
        }
    }
    
    
  render() {
    //   console.group("IconPicker")
    const {iconList, iconSets} = this.props;

    // get the available icon sets from the full list
    // console.log ('iconpicker', iconList);
    // console.log (iconSets);
    

    // console.groupEnd();
    return (
      <div className="icon-picker">
            <input 
                className="icon-picker__search"
                placeholder="Icon Search" 
                onChange={this.getIconFilter} />
            <div className="icon-picker__icon-list">
                {
                    this.state.filteredList.map(icon => {
                        return <IconCard icon={icon} theKey={icon} src='' getSelectedIcon={this.props.getSelectedIcon}/>
                    })
                }
            </div>
      </div>
    )
  }
}

export default IconPicker

// process.env.REACT_APP_BASE_URL + icon

