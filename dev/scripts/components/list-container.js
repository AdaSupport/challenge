import React from "react";
import ListItems from "./list-items";

export default class ListContainer extends React.Component {
    render(){
        return (
            <div className="list-container">
                <ul className="list-ul">
                    <ListItems />
                </ul>
            </div>
        )
    }
}