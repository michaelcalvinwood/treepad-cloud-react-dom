import { setSelectionRange } from '@testing-library/user-event/dist/utils';
import React from 'react';
import './ModuleSelectorCard.scss';

function ModuleSelectorCard({icon, title, selector}) {
  return(
    <div 
        className="module-selector-card"
        onClick={() => selector(title)}>
        <img 
            className="module-selector-card__image"
            src={icon}/>
        <p className="module-selector-card__title">
            {title}
        </p>
    </div>
  )
};

export default ModuleSelectorCard