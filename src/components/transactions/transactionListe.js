import {TransactionElement} from "./transactionItem/transactionElement"
import {Container} from "react-bootstrap";
import React from "react";
import "../../Styles.scss";
import {BereichUeberschrift} from "./../ueberschrift/bereichUeberschrift";

/**
 * Rendert die To-dos
 * @param props = itemList, updatePunkt, updateDoneOrNot
 * @returns {JSX.Element}
 * @constructor
 */
export function TransactionListe (props) {
    console.log("ContainerListe: ", props.itemList);
        let s = props.itemList;
        if(s.lenght > 0){
        console.log("transactionlist: ", s);
        }
    const test = "name";
        const schuldnerName = props.itemList.length > 0 ? props.itemList[0].name : '';// this.state.transactions > 0 ? this.state.transactions[0].name : '';

    return(
        <Container className="container">
            <p>{ schuldnerName}</p>
             <BereichUeberschrift ueberschrift={schuldnerName}/>
            <div className="row row-cols-1 row-cols-md-3 row-cols-lg-6 g-2 g-lg-3 reihe d-flex justify-content-evenly">

                    {props.itemList.map((item) => <div className="col"><TransactionElement item={item} id={item.itId}
                                                                 updateTransaction={props.updateTransaction}
                                                                 deleteTransaction={props.deleteTransaction}
                                                                 updateDoneOrNot={props.updateDoneOrNot}   /> </div>) }

            </div>
        </Container>
    )
}