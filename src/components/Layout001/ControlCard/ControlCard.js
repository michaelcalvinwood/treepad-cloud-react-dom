import React from 'react';
import './ControlCard.scss';

function ControlCard({ icon, line1, line2, controlHandler }) {
  return (
    <div
      className="control-card"
      onClick={() => `${line2}` ? controlHandler(`${line1}-${line2}`) : controlHandler(`${line1}`)}>
      <img className="control-card__icon" src={icon} />
      <p className="control-card__line1">{line1}</p>
      <p className="control-card__line2">{line2}</p>
    </div>
  )
}

export default ControlCard