import React from "react";
import ListItems from "./list-items";

export default class ListContainer extends React.Component {
    render(){
        return (
            <div className="list-container">
                <ul className="list-ul" id="main list">
                    {this.props.todo.map(res => {
                        return <ListItems 
                            todo={res} 
                            key={res.key}
                            removeItem={this.props.removeItem} 
                            update={this.props.update} 
                            completeAll={this.props.completeAll} 
                            setColours={this.props.setColours}/>
                        }
                    )}
                </ul>
            </div>
        )
    }
}