import {PayBackTransactionElement} from "./payBackTransactionItem/payBackTransactionElement"
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
export function PayBackTransactionListe (props) {

   // const params = useParams();
    const { transactionId, purpose } = useParams();



    const [payBackTransactions, setPayBackTransactions] = useState([]);
    //const [purpose, setPurpose] = useState("");


    //console.log("PayBackTransactionListe: ", props.itemList);
    /*    let s = props.itemList;
        if(s == null) {
        s = [{}];
        };
        if(s.lenght > 0){
        console.log("transactionlist: ", s);
        }
    const test = "name";
        //const schuldnerName = props.itemList.length > 0 ? props.itemList[0].name : '';// this.state.transactions > 0 ? this.state.transactions[0].name : '';
        const schuldnerName = s.length > 0 ? s[0].name : '';// this.state.transactions > 0 ? this.state.transactions[0].name : '';
        console.log("name: ", schuldnerName); */

         useEffect(() => {
         console.log("transactionId: ", transactionId)
         console.log("purpose: ", purpose)
                let promise = AxiosCalls('get', '/payBackTransaktionen?transactionId=' + transactionId);
                    let cPayBackTransactions = [];
                     promise.then(value => {
                                         cPayBackTransactions = value.data;
                                         console.log("transactions: ", cPayBackTransactions);
                                         setPayBackTransactions( cPayBackTransactions);

                                     });

                }, []);

    return(
        <Container className="container">

            <div className="row row-cols-1 row-cols-md-3 row-cols-lg-6 g-2 g-lg-3 reihe d-flex justify-content-evenly">

                    {payBackTransactions.map((item) => <div className="col"><PayBackTransactionElement item={item} id={item.itId} purpose={purpose}

                                                                 /> </div>) }

            </div>
        </Container>
    )
}