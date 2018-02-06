import React from "react";

const Legend = () => {
    return (
        <ul className="legend-container" aria-hidden="true">
            <li className="legend-item" key="1">
                <i className="fas fa-check"></i>
                <p>completed</p>
            </li>

            <li className="legend-item" key="2">
                <i className="fas fa-hourglass-start" ></i>
                <p>incomplete</p>
            </li>

            <li className="legend-item" key="3">
                <i className="far fa-trash-alt"></i>
                <p>Delete</p>
            </li>

            <li className="legend-item" key="4">
                <i className="fas fa-square complete"></i>
                <p>completed</p>
            </li>

            <li className="legend-item" key="5">
                <i className="fas fa-square incomplete"></i>
                <p>to be completed</p>
            </li>
        </ul>
    )
}

export default Legend;