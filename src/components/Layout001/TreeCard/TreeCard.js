import React from 'react';
import './TreeCard.scss';

function TreeCard({icon, color, treeName, userId, userName, handleSelect, handleEdit, handleDelete}) {
    console.log (process.env);
    const iconPath = process.env.REACT_APP_BASE_URL + icon;

  return (
    <div className="tree-card">
        <img 
            className="tree-card__icon" 
            onClick={() => handleSelect(userId, treeName)}
            src={iconPath} />
        <p 
            className="tree-card__tree-name"
            onClick={() => handleSelect(userId, treeName)}>
            {treeName}</p>
        <p 
            className="tree-card__user-name"
            onClick={() => handleSelect(userId, treeName)}>
            {userName}</p>
        <div className = "tree-card__actions">
            <img 
                className="tree-card__edit" 
                onClick={() => handleEdit(userId, treeName)}/>
            <img 
                className="tree-card__delete"
                onClick={() => handleDelete(userId, treeName)}/>
        </div>
    </div>
  )
}

export default TreeCard;