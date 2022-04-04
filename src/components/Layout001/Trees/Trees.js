import React, { Component } from 'react'
import './Trees.scss'
import TreeCard from '../TreeCard/TreeCard';
import AddTree from '../AddTree/AddTree';
import axios from 'axios';


export default class Trees extends Component {

    state = {
        addTree: false,
        trees: [],
    }

    closeModal = (userId, icon, color, treeName) => {
        this.setState({
            addTree: false
        })

        const request = {
            url: process.env.REACT_APP_BASE_URL + '/trees/' + this.props.userId,
            method: "get",
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
            }
        }
        axios(request)
        .then((response) => {
            console.log ("got trees", response.data.message);
            this.setState({
                trees: response.data.message
            })
        })
        .catch(err => console.log('GET /trees/'))
    }

    addTree = userId => {
        console.log ('Trees.js addTree', userId);

        this.setState({
            addTree: true
        })
        // this.props.setTree(-2);
    }

    handleSelect = (treeId) => {
        console.log (`Tree.js handleSelect(${treeId})`);

        const id = Number(treeId);

        if (id === -1) this.addTree(this.props.userId);
        else {
            this.props.setTheTree(treeId);
        }
    }

    handleEdit = () => {

    }

    handleDelete = () => {

    }

    componentDidMount() {

        const turnOnDisplay = () => {
            const el = document.querySelector('.trees__content');
            console.log (el)
            setTimeout(() => {
                el.style.display = 'block';
            }, 500);
        }

        if (this.props.windowState.trees) {
            const request = {
                url: process.env.REACT_APP_BASE_URL + '/trees/' + this.props.userId,
                method: "get",
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
                }
            }
            console.log(request.url);
            axios(request)
            .then((response) => {
                console.log ("got trees", response.data.message);
                this.setState({
                    trees: response.data.message
                })
            })
            .catch(err => console.log('GET /trees/'))
            turnOnDisplay();
        } else {
            const el = document.querySelector('.trees__content');
            el.style.display = 'none';
        }

    }

    render() {
        const { windowState, toggleWindow, setTheTree, userName, userId, linkIcon, closeIcon } = this.props;
        console.log ('Trees.js render');

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

        // console.log ("info", info)
        
        return (
            <>
                <section className={sectionClassName}>
                    <img className='trees__link' src={linkIcon}/>
                    <img 
                        className='trees__close'
                        onClick={e => toggleWindow(e, 'trees')}
                        src={closeIcon}/>            
                    <div 
                        className={titleClassName}
                        >
                        {userName}
                    </div>
                    <div className={contentClassName}>
                        {this.state.trees.map(tree => {
                            return (
                                <TreeCard
                                    icon={tree.icon}
                                    userName={userName}
                                    userId={userId}
                                    treeName={tree.tree_name}
                                    treeId={tree.tree_id}
                                    handleSelect={this.handleSelect}
                                    key={tree.tree_name}
                                    selected={Number(tree.tree_id) === this.props.treeId ? true : false}
                                    />
                            )
                        })}
                        <TreeCard 
                            icon='/svg/octicons/plus-24.svg'
                            treeName="Add Tree"
                            userName={userName}
                            userId={userId}
                            handleSelect={this.handleSelect}
                            treeId='-1'
                            selected={this.state.addTree}
                            key="Add Tree"/>
                    </div>
                </section>
                {this.state.addTree && 
                    <AddTree 
                        closeModal={this.closeModal}
                        userName={userName}
                        userId={userId}
                        icon={'/svg/tree.svg'}
                        iconList={this.props.iconList}/>
                }
            </>
        )
    }
}
