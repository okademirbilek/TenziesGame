import React from "react";




function Scores(props){
    // console.log(props.notes)
    return (
        <div className="scores--container">
            <h2 className="scores--text">Best Score: </h2>
            <h2 className="scores--text">{props.notes} second 👑</h2>
        </div>
    )
}


export default Scores