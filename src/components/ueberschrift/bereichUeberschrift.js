import React from "react";
import "../../Styles.scss";

export function BereichUeberschrift(props){

    return(
        <div className="d-flex justify-content-center">
            <p className="schrift mt-4">
                {props.ueberschrift}
            </p>
        </div>
    )
}