import React, { Component } from 'react'
import './Trees.scss'
import treeIcon from '../../../assets/icons/tree.svg';
import TreeCard from '../TreeCard/TreeCard';
import AddTree from '../AddTree/AddTree'

export default class Trees extends Component {

    state = {
        addTree: false
    }

    closeModal = (userId, icon, color, treeName) => {
        this.setState({
            addTree: false
        })
    }

    addTree = userId => {
        this.setState({
            addTree: true
        })
    }

    showTree = () => {

    }

    handleSelect = (userId, treeName) => {
        console.log (`Tree ${treeName}/${userId} is selected`);

        if (treeName.toLowerCase() === 'add tree') this.addTree(userId);
        else this.showTree(userId, treeName);
    }

    handleEdit = () => {

    }

    handleDelete = () => {

    }

    componentDidMount() {

        const turnOnDisplay = () => {
            console.log ("turn on display");
            const el = document.querySelector('.trees__content');
            console.log (el)
            setTimeout(() => {
                el.style.display = 'block';
            }, 2500);
        }

        if (this.props.windowState.trees) {
            turnOnDisplay();
        } else {
            const el = document.querySelector('.trees__content');
            el.style.display = 'none';
        }

    }

    render() {
        const { windowState, clickHandler, userName, userId } = this.props;
        console.group ("Trees");
        console.log ('Trees state, clickHandler', windowState, clickHandler);

        let sectionClassName = 'trees';
        let titleClassName = 'trees__title';
        let contentClassName = 'trees__content';
        let iconClassname = 'trees__icon'

        if (windowState.trees) {
            sectionClassName += ' trees--active';
        } else {
            sectionClassName += ' trees--inactive';
            iconClassname += ' trees__icon--inactive';
            contentClassName += ' trees__content--inactive';

        }

        console.groupEnd();
        let modal;

        const info = {
            icon: process.env.REACT_APP_BASE_URL + '/svg/tree.svg',
            color: '#000000',
            treeName: '',
            userId,
            userName,
        }

        console.log ("info", info)
        
        return (
            <>
                <section className={sectionClassName}>
                    <div 
                        className={titleClassName}
                        onClick={e => clickHandler(e, 'trees')}>
                        <img className={iconClassname} src={treeIcon} alt="tree" />
                    </div>
                    <div className={contentClassName}>
                        <TreeCard 
                            icon='/svg/octicons/plus-24.svg'
                            treeName="Add Tree"
                            userName={userName}
                            userId={userId}
                            handleSelect={this.handleSelect}/>
                    </div>
                </section>
                {this.state.addTree && 
                    <AddTree 
                        closeModal={this.closeModal}
                        userName={userName}
                        userId={userId}
                        icon={process.env.REACT_APP_BASE_URL + '/svg/tree.svg'}
                        iconList={this.props.iconList}/>
                }
            </>
        )
    }
}
