import './Controls.scss';

function Controls({ windowState, clickHandler }) {
    console.group('Controls');
    console.log(windowState);

    let mainClassName;
    let containerClassName;

    if (windowState.controls) {
        mainClassName = 'controls controls--active';
        containerClassName = 'controls__title-container controls__title-container--active'
    } else {
        mainClassName = 'controls controls--inactive';
        containerClassName = 'controls__title-container controls__title-container--inactive'
    }
    
    if (windowState.trees) {
        mainClassName += '-trees';
        containerClassName += '-trees';
    }

    console.groupEnd();
    return (
        <section className={mainClassName}>
            <div
                className={containerClassName}>
                <h1
                    className="controls__title"
                    onClick={e => clickHandler(e, 'controls')}>
                    Controls
                </h1>
            </div>
        </section>
    )
}

export default Controls