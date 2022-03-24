import './Controls.scss';
import controlsIcon from '../../../assets/icons/controls.svg';

function Controls({ windowState, clickHandler }) {
    console.group('Controls');
    console.log(windowState);

    let sectionClassName;
    let containerClassName;

    if (windowState.controls) {
        sectionClassName = 'controls controls--active';
        containerClassName = 'controls__title-container controls__title-container--active'
    } else {
        sectionClassName = 'controls controls--inactive';
        containerClassName = 'controls__title-container controls__title-container--inactive'
    }
    
    if (windowState.trees) {
        sectionClassName += '-trees';
        containerClassName += '-trees';
    }

    console.groupEnd();
    return (
        <section className={sectionClassName}>
            <div
                className={containerClassName}>
                <h1
                    className="controls__title"
                    onClick={e => clickHandler(e, 'controls')}>
                    <img className='controls__icon' src={controlsIcon} alt="controls" />
                </h1>
            </div>
        </section>
    )
}

export default Controls