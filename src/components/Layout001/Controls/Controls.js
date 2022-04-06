import './Controls.scss';
import ControlCard from '../ControlCard/ControlCard';

import insertSiblingIcon from '../../../assets/icons/insert-sibling.svg';
import insertChildIcon from '../../../assets/icons/insert-child.svg';
import insertParentIcon from '../../../assets/icons/insert-parent.svg';
import saveIcon from '../../../assets/icons/save.svg';
import saveAlert from '../../../assets/icons/save-alert.svg';

import upIcon from '../../../assets/icons/up.svg';
import downIcon from '../../../assets/icons/down.svg';
import indentIcon from '../../../assets/icons/indent.svg';
import outdentIcon from '../../../assets/icons/outdent.svg';

import copyIcon from '../../../assets/icons/copy.svg';
import pasteIcon from '../../../assets/icons/paste.svg';
import deleteIcon from '../../../assets/icons/delete.svg';
import settingsIcon from '../../../assets/icons/settings.svg';

import treePadIcon from '../../../assets/icons/treepadcloud-icon.svg';
import React from 'react';


class Controls extends React.Component {

    componentDidMount() {
        setInterval(() => {
            this.props.controlHandler('save');
        }, 30000)
    }

    render() {
        const { windowState, clickHandler, controlHandler, toggleWindow, linkIcon, closeIcon, branchHasChanged, moduleHasChanged, view, viewTreeName, viewTreeIcon } = this.props;

        let sectionClassName;
        let containerClassName;
        let contentClassName = "controls__content";

        if (windowState.controls) {
            sectionClassName = 'controls controls--active';
            containerClassName = 'controls__title-container controls__title-container--active'
        } else {
            sectionClassName = 'controls controls--inactive ';
            containerClassName = 'controls__title-container controls__title-container--inactive';
            contentClassName += " controls__content--inactive"
        }

        if (windowState.trees) {
            sectionClassName += '-trees';
            containerClassName += '-trees';
        }

        if (view !== 'userView') {
            return (
                <section className={sectionClassName}>
                    <div className="controls__view-container">
                        <img className="controls__view-icon" src={viewTreeIcon} alt='tree' />
                        <p className="controls__view-name">{viewTreeName}</p>
                    </div>
                </section>
            )
        }
        return (
            <section className={sectionClassName}>
                <img
                    className="controls__close"
                    src={closeIcon}
                    onClick={e => toggleWindow(e, 'controls')} />

                <div className='controls__logo-container'>
                    <div className='controls__logo'>
                        <img className='controls__logo-icon' src={treePadIcon} />
                        <h1 className='controls__logo-title'>TreePad Cloud</h1>
                    </div>
                </div>
                <div className={contentClassName}>
                    <div className="controls__left">
                        <ControlCard
                            icon={branchHasChanged || moduleHasChanged ? saveAlert : saveIcon}
                            line1="Save"
                            line2=""
                            controlHandler={controlHandler} />
                        <ControlCard
                            icon={insertSiblingIcon}
                            line1="Insert"
                            line2="Sibling"
                            controlHandler={controlHandler} />
                        <ControlCard
                            icon={insertChildIcon}
                            line1="Insert"
                            line2="Child"
                            controlHandler={controlHandler} />
                        <ControlCard
                            icon={insertParentIcon}
                            line1="Insert"
                            line2="Parent"
                            controlHandler={controlHandler} />
                    </div>
                    <div className="controls__middle">
                        <ControlCard
                            icon={upIcon}
                            line1="Up"
                            line2=""
                            controlHandler={controlHandler} />
                        <ControlCard
                            icon={downIcon}
                            line1="Down"
                            line2=""
                            controlHandler={controlHandler} />
                        <ControlCard
                            icon={indentIcon}
                            line1="Indent"
                            line2=""
                            controlHandler={controlHandler} />
                        <ControlCard
                            icon={outdentIcon}
                            line1="Outdent"
                            line2=""
                            controlHandler={controlHandler} />
                    </div>
                    <div className="controls__right">
                        <ControlCard
                            icon={copyIcon}
                            line1="Copy"
                            line2="" />
                        <ControlCard
                            icon={pasteIcon}
                            line1="Paste"
                            line2="" />
                        <ControlCard
                            icon={deleteIcon}
                            line1="Delete"
                            line2=""
                            controlHandler={controlHandler} />
                        <ControlCard
                            icon={settingsIcon}
                            line1="Settings"
                            line2="" />
                    </div>
                </div>
            </section>
        )
    }
}

export default Controls