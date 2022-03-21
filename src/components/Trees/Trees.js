import React, { Component } from 'react'
import './Trees.scss'

export default class Trees extends Component {
    render() {
        const { windowState, clickHandler } = this.props;
        
        console.group ("Trees");
        console.log ('Trees state, clickHandler', windowState, clickHandler);
        console.groupEnd();

        return (
            <section 
                className={windowState.trees ? 'trees trees--active' : 'trees trees--inactive'}>
                <div 
                    className={windowState.trees ? 'trees__title-container trees__title-container--active' 
                        : 'trees__title-container trees__title-container--inactive'}>
                    <h1 
                      className="trees__title"
                      onClick={e => clickHandler(e, 'trees')}>
                      <i class="fa-solid fa-user fa-2xl"></i>
                    </h1>
                </div>
                <div className="trees__container">
                    Some Content
                </div>
            </section>
        )
    }
}
