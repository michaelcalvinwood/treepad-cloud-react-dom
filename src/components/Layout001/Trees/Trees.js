import React, { Component } from 'react'
import './Trees.scss'
import treeIcon from '../../../assets/icons/tree.svg';

export default class Trees extends Component {

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
        const { windowState, clickHandler } = this.props;
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
        
        return (
            <section className={sectionClassName}>
                <div 
                    className={titleClassName}
                    onClick={e => clickHandler(e, 'trees')}>
                      <img className={iconClassname} src={treeIcon} alt="tree" />
                </div>
                <div className={contentClassName}>
                    Some Content
                </div>
            </section>
        )
    }
}
