const addTree = (info) => {
    console.log ('AddTree Modal', info);
    return (
        <div className="add-tree">
            <img className="add-tree__icon" src={info.icon}></img>
        </div>
    )
}

export default addTree;