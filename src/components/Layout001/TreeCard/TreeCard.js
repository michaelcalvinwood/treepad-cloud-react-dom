import React from 'react';
import './TreeCard.scss';

function TreeCard({icon, color, treeName, treeId, userId, userName, selected, handleSelect, handleEdit, handleDelete}) {
    console.log (process.env);
    const iconPath = process.env.REACT_APP_BASE_URL + icon;

  return (
    <div className={selected ? "tree-card tree-card--selected" : 'tree-card'}>
        <div 
            className="tree-card__click-area"
            onClick={() => handleSelect(treeId)}>
            <img 
                className="tree-card__icon" 
                src={iconPath} />
            <p 
                className="tree-card__tree-name" >
                {treeName}</p>
            <p 
                className="tree-card__user-name" >
                {userName}</p>
        </div>
            <div className = "tree-card__actions">
                <img 
                    className="tree-card__edit" 
                    onClick={() => handleEdit(userId, treeName, treeId)}/>
                <img 
                    className="tree-card__delete"
                    onClick={() => handleDelete(userId, treeName, treeId)}/>
            </div>
        
    </div>
  )
}

export default TreeCard;