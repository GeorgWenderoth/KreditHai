import {TransactionElement} from "./transactionItem/transactionElement"
import {Container} from "react-bootstrap";
import React, {useState, useEffect} from "react";
import "../../Styles.scss";
import {BereichUeberschrift} from "./../ueberschrift/bereichUeberschrift";
import {AxiosCalls} from "../../utils/axiosCalls";

import {useParams} from 'react-router-dom';

/**
 * Rendert die Transaktionen
 * @param props = itemList, updatePunkt, updateDoneOrNot
 * @returns {JSX.Element}
 * @constructor
 */
export function TransactionListeUseRouter(props) {

    const params = useParams();


    const [transactions, setTransactions] = useState([]);
   /*  const params = useParams();
        console.log("params: ", params);
    console.log("ContainerListe: ", props.itemList);
        let s = props.itemList;
        if(s.lenght > 0){
        console.log("transactionlist: ", s);
        }
    const test = "name";
        const schuldnerName = props.itemList.length > 0 ? props.itemList[0].name : '';// this.state.transactions > 0 ? this.state.transactions[0].name : ''; */

   /* useEffect(() => {
    let promise = AxiosCalls('get', '/alleTransaktionen');
        let cTransactions = [];
         promise.then(value => {
                             cTransactions = value.data;
                             console.log("transactions: ", cTransactions);
                             setTransactions(cTransactions);
                         });

    }, []); */

     useEffect(() => {
        let promise = AxiosCalls('get', '/Transaktionen?debitorId=' + params.debitorId);
            let cTransactions = [];
             promise.then(value => {
                                 cTransactions = value.data;
                                 console.log("transactions: ", cTransactions);
                                 setTransactions(cTransactions);
                             });

        }, []);





    return(
        <Container className="container">

            <div className="row row-cols-1 row-cols-md-3 row-cols-lg-6 g-2 g-lg-3 reihe d-flex justify-content-evenly">

                    {transactions.map((item) => <div className="col"><TransactionElement item={item} id={item.itId} schuldnerName={item.schuldnerName}
                                                                 updateTransaction={props.updateTransaction}
                                                                 deleteTransaction={props.deleteTransaction}
                                                                 auswahlPayBackTransactions={props.auswahlPayBackTransactions}   /> </div>) }

            </div>
        </Container>
    )
}