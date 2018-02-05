import React from "react";
import ListItems from "./list-items";

const ListContainer =(props)=> {
    return (
        <div className="list-container">
            <ul className="list-ul" id="main list">
                {props.todo.map(res => {
                    return <ListItems todo={res} key={res.key} removeItem={props.removeItem} update={props.update} completeAll={props.completeAll} setColours={props.setColours}/>
                    }
                )}
            </ul>
        </div>
    )
}

export default ListContainer;