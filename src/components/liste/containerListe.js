import {ListElement} from "./listItem/listElement";
import {Container} from "react-bootstrap";
import React from "react";
import "../../Styles.scss";

/**
 * Rendert die To-dos
 * @param props = itemList, updatePunkt, updateDoneOrNot
 * @returns {JSX.Element}
 * @constructor
 */
export function ContainerListe (props) {
    console.log("ContainerListe: ", props.itemList);
        let s = props.itemList;
    return(
        <Container className="container">
            <div className="row row-cols-1 row-cols-md-3 row-cols-lg-6 g-2 g-lg-3 reihe d-flex justify-content-evenly">
                
                    {props.itemList.map((item) => <div className="col"><ListElement item={item} id={item.itId}
                                                                 updatePunkt={props.updatePunkt}
                                                                 auswahlTransactions={props.auswahlTransactions}
                                                                 deletePunkt ={props.deletePunkt}
                                                                 /> </div>) }
                
            </div>
        </Container>
    )
}
