import React from 'react';
import './IconCard.scss';

function IconCard({icon, theKey, getSelectedIcon}) {
    // all icons have this format /svg/{setName}/{iconName}

    let loc = 5;
    let end = icon.indexOf('/', loc);
    const set = icon.substring(loc, end);
    let name = icon.substring(end+1);
    loc = name.indexOf('.');
    name = name.substring(0, loc);

  return (
    <div className="icon-card" key={theKey}>
        <p 
          className="icon-card__name"
          onClick={()=>{getSelectedIcon(icon)}}>{name}</p>
    </div>
  )
}

export default IconCard