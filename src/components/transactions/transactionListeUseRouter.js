import {TransactionElement} from "./transactionItem/transactionElement"
import {Container, Button, Modal} from "react-bootstrap";
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

    const [showM, setShowM] = useState(false);
    const [days, setDays] = useState();
    const [payBackMoney, setPayBackMoney] = useState();

    //for future use
    const [date, setDate] = useState();
    const [notes, setNotes] = useState("");



     useEffect(() => {
        let promise = AxiosCalls('get', '/Transaktionen?debitorId=' + params.debitorId);
            let cTransactions = [];
             promise.then(value => {
                                 cTransactions = value.data;
                                 console.log("transactions: ", cTransactions);
                                 setTransactions(cTransactions);
                             });

     }, []);


    const handleSmartPay = () => {
     let promise =  AxiosCalls('post', '/smartPayBack?days=' + days +'&payBackMoney=' + payBackMoney + '&debitorId=' + params.debitorId);
     }


    const handleClose = () => {
        handleSmartPay();
        setShowM(false);
    }

    const handleCloseWithoutSaving = () => {
        setShowM(false);
    }

    const handleShow = () => setShowM(true);
    const handlePayBackMoney = (e) => setPayBackMoney(e.target.value);
    const handleDays = (e) => setDays(e.target.value);

     //for future use
    const handleNotes = (e) => setNotes(e.target.value)
    const handleDate = (e) => setDate(e.target.value);

    return(
        <Container className="container">
            <p>{props.schuldnerName}</p>
            <Button variant="success" size="sm" onClick={handleShow}> SmartPay</Button>

                                       <Modal show={showM} onHide={handleCloseWithoutSaving}>
                                                                  <Modal.Header closeButton>
                                                                      <Modal.Title>
                                                                          Rückzahlung
                                                                      </Modal.Title>
                                                                  </Modal.Header>
                                                                  <Modal.Body>
                                                                      <div className="container">
                                                                          <div className="mb-3 row">
                                                                              <label className="col-3 col-form-label">Betrag: </label>
                                                                              <div className="col-9">
                                                                                  <input className="form-control " type="number" onChange={handlePayBackMoney} value={payBackMoney}/>
                                                                              </div>
                                                                          </div>
                                                                           <div className="mb-3 row">
                                                                              <label className="col-3 col-form-label">Tage: </label>
                                                                              <div className="col-9">
                                                                                   <input className="form-control" type="number"
                                                                                    placeholder="Days"
                                                                                    onChange={handleDays}
                                                                                    value={days}/>
                                                                              </div>
                                                                          </div>
                                                                          <div className="mb-3 row">
                                                                              <label className="col-3 col-form-label">Notiz: </label>
                                                                              <div className="col-9">
                                                                                  <input className="form-control" type="text"
                                                                                         placeholder="Notizen"
                                                                                         onChange={handleNotes}
                                                                                         value={notes}/>
                                                                              </div>
                                                                          </div>
                                                                          <div className="mb-3 row">
                                                                              <label className=" col-3 col-form-label">Datum: </label>
                                                                              <div className="col-9">
                                                                                  <input className="form-control" type="date" value={date}
                                                                                         onChange={(e) => handleDate(e)}/>
                                                                              </div>
                                                                          </div>
                                                                      </div>
                                                                  </Modal.Body>
                                                                  <Modal.Footer>

                                                                  <Button variant="secondary" size="sm"
                                                                                        onClick={handleCloseWithoutSaving}>Abbrechen</Button>
                                                                      <Button variant="primary" size="sm" onClick={handleClose}>Änderung Speichern</Button>
                                                                  </Modal.Footer>
                                       </Modal>


            <div className="row row-cols-1 row-cols-md-3 row-cols-lg-6 g-2 g-lg-3 reihe d-flex justify-content-evenly">

                    {transactions.map((item) => <div className="col"><TransactionElement item={item} id={item.itId} schuldnerName={item.schuldnerName}
                                                                 updateTransaction={props.updateTransaction}
                                                                 deleteTransaction={props.deleteTransaction}
                                                                 auswahlPayBackTransactions={props.auswahlPayBackTransactions}   /> </div>) }

            </div>
        </Container>
   )
}