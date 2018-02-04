import React from "react";
import InputForm from "./input-form";
import ListContainer from "./list-container";

export default class Landing extends React.Component {
    render(){
        return (
            <div>
                <InputForm />
                <ListContainer />
            </div>
        )
    }
}