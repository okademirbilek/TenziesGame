import React from "react";




function Scores(props){
    // console.log(props.notes)
    return (
        <div className="scores--container">
            <h1 className="scores--text">Best Score </h1>
            <h2 className="scores--text2">{props.notes} second 👑</h2>
        </div>
    )
}


export default Scores