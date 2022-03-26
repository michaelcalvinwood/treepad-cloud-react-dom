import './Leaves.scss';
import leafIcon from '../../../assets/icons/leaf.svg';

function Leaves({ windowState, clickHandler }) {
  console.group('Leaves');
  console.log(windowState);

  let sectionClassName = 'leaves leaves--active';
  let titleClassName = 'leaves__title';
  let contentClassName = 'leaves__content';

  if (windowState.trees) sectionClassName += '-trees';
  if (windowState.branches) sectionClassName += '-branches';
  if (windowState.leaves) {
    sectionClassName += '-leaves';
  } else {
    titleClassName += ' -closed';
  }
  if (windowState.controls) sectionClassName += '-controls';

  console.log (sectionClassName)
 
  console.groupEnd();
  return (
    <section className={sectionClassName}>
      <div className={titleClassName}>
        <img 
          className='leaves__icon' 
          onClick={e => clickHandler(e, 'leaves')} 
          src={leafIcon} 
          alt="leaf" />
      </div>
      </section>
  )
}

export default Leaves