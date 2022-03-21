import './Branches.scss';

function Branches({windowState, clickHandler}) {
  console.group('Branches');
  console.log(windowState);

  let mainClassName;
  let containerClassName;

  if (windowState.branches) {
      mainClassName = 'branches branches--active';
      containerClassName = 'branches__title-container branches__title-container--active'
  } else {
      mainClassName = 'branches branches--inactive';
      containerClassName = 'branches__title-container branches__title-container--inactive'
  }
  
  if (windowState.trees) {
      mainClassName += '-trees';
      containerClassName += '-trees';
  }

  if (windowState.controls) {
      mainClassName += '-controls';
      containerClassName += '-controls';
  }

  // if (windowState.leaves) {
  //     mainClassName += '-leaves';
  //     containerClassName += 'leaves';
  // }

  console.groupEnd();
  return (
      <section className={mainClassName}>
          <div
              className={containerClassName}>
              <h1
                  className="branches__title"
                  onClick={e => clickHandler(e, 'branches')}>
                  Branches
              </h1>
          </div>
      </section>
  )
}

export default Branches