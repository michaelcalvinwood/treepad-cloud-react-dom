import './Branches.scss';
import branchIcon from '../../../assets/icons/branch.svg';

function Branches({windowState, clickHandler}) {
    console.group('Branches');
    console.log(windowState);

    let mainClassName = 'branches branches--active';
    
    if (windowState.trees) mainClassName += '-trees';
    if (windowState.branches) mainClassName += '-branches';
    if (windowState.leaves) mainClassName += '-leaves';
    if (windowState.controls) mainClassName += '-controls';

    let titleClassName = 'branches__title';
    let contentClassName = 'branches__content'
    
    if (!windowState.branches) {
        titleClassName += ' branches__title--closed';
        contentClassName += ' branches__content--closed';
    }

    console.log ("branches mainClassName", mainClassName);

    console.groupEnd();
  return (
      <section className={mainClassName}>
          <div 
            className={titleClassName}
            onClick={e => clickHandler(e, 'branches')} >
              <img className="branches__icon" src={branchIcon} alt="branches" />
          </div>
          <div className={contentClassName}>
            
          </div>
              
      </section>
  )
}

export default Branches