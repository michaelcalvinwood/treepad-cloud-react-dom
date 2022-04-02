import './Controls.scss';
import controlsIcon from '../../../assets/icons/controls.svg';
import ControlCard from '../ControlCard/ControlCard';

import insertSiblingIcon from '../../../assets/icons/insert-sibling.svg';
import insertChildIcon from '../../../assets/icons/insert-child.svg';
import insertParentIcon from '../../../assets/icons/insert-parent.svg';
import saveIcon from '../../../assets/icons/save.svg';

import upIcon from '../../../assets/icons/up.svg';
import downIcon from '../../../assets/icons/down.svg';
import indentIcon from '../../../assets/icons/indent.svg';
import outdentIcon from '../../../assets/icons/outdent.svg';

import copyIcon from '../../../assets/icons/copy.svg';
import pasteIcon from '../../../assets/icons/paste.svg';
import deleteIcon from '../../../assets/icons/delete.svg';
import settingsIcon from '../../../assets/icons/settings.svg';

import treePadIcon from '../../../assets/icons/treepadcloud-icon.svg';


function Controls({ windowState, clickHandler, controlHandler }) {
    
    // console.log(windowState);

    let sectionClassName;
    let containerClassName;
    let contentClassName = "controls__content";

    if (windowState.controls) {
        sectionClassName = 'controls controls--active';
        containerClassName = 'controls__title-container controls__title-container--active'
    } else {
        sectionClassName = 'controls controls--inactive';
        containerClassName = 'controls__title-container controls__title-container--inactive';
        contentClassName += " controls__content--inactive"
    }
    
    if (windowState.trees) {
        sectionClassName += '-trees';
        containerClassName += '-trees';
    }

    console.groupEnd();
    return (
        <section className={sectionClassName}>
            {/* <img className='controls__logo' src={treePadIcon} /> */}
            {/* <div
                className={containerClassName}>
                <h1
                    className="controls__title"
                    onClick={e => clickHandler(e, 'controls')}>
                    <img className='controls__icon' src={controlsIcon} alt="controls" />
                </h1>
            </div> */}
            <div className={contentClassName}>
                <div className="controls__left">
                    <ControlCard
                        icon={saveIcon}
                        line1="Save"
                        line2="" 
                        controlHandler={controlHandler}/>
                    <ControlCard
                        icon={insertSiblingIcon}
                        line1="Insert"
                        line2="Sibling"
                        controlHandler={controlHandler}/>
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
                        line2="" />
                    <ControlCard
                        icon={downIcon}
                        line1="Down"
                        line2="" />
                    <ControlCard
                        icon={indentIcon}
                        line1="Indent"
                        line2="" />
                    <ControlCard
                        icon={outdentIcon}
                        line1="Outdent"
                        line2="" />
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
                        line2="" />
                    <ControlCard
                        icon={settingsIcon}
                        line1="Settings"
                        line2="" />
                </div>
            </div>
        </section>
    )
}

export default Controls