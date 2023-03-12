import React from "react";

function Die(props) {

    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }


    return (
        <div className="die" style={styles} onClick={ () => props.handleChange(props.id)}  > {props.value}  </div>
    )   
}

export default Die