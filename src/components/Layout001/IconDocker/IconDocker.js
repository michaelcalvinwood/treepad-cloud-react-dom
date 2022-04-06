import React from 'react'
import './IconDocker.scss';
import treeIcon from '../../../assets/icons/tree.svg';
import branchesIcon from '../../../assets/icons/branch.svg';
import controlsIcon from '../../../assets/icons/controls.svg';

function IconDocker({windowState, setWindowState, view}) {
  
  const iconClicked = name => {
    let modifiedWindowState = JSON.parse(JSON.stringify(windowState));

    modifiedWindowState[name] = !modifiedWindowState[name];

    console.log('IconDocker.js iconClicked', 'modifiedWindowState', modifiedWindowState)

    setWindowState(modifiedWindowState);
  }
  
  let showTree = true;
  let showBranches = true;
  let showControls = true;

  if (windowState.trees) showTree = false;
  if (windowState.branches) showBranches = false;
  if (windowState.controls) showControls = false;

  if (!showTree && !showBranches && !showControls) return(
      <div></div>
  );

  if (view !== 'userView') return(<></>);

  return (

    <div className={showTree ? 
        "icon-docker icon-docker--shift-left" :
        "icon-docker"}>
        <img 
            className={showTree ? 
                "icon-docker__tree-icon" :
                "icon-docker__tree-icon icon-docker__tree-icon--disabled"}
            src={treeIcon}
            onClick={() => {iconClicked('trees')}}
            alt="tree" />
        <img 
             className={showBranches ? 
                "icon-docker__branches-icon" :
                "icon-docker__branches-icon icon-docker__branches-icon--disabled"}
            src={branchesIcon}
            onClick={() => {iconClicked('branches')}}
            alt="tree" />
        <img 
             className={showControls ? 
                "icon-docker__controls-icon" :
                "icon-docker__controls-icon icon-docker__controls-icon--disabled"}
            src={controlsIcon}
            onClick={() => {iconClicked('controls')}}
            alt="tree" />
            
    </div>
  )
}

export default IconDocker