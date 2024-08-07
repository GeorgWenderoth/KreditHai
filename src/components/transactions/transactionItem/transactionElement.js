import React, {useState, useEffect} from "react";
import {Col, Row, Card, Button, Modal} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPen, faCheck} from '@fortawesome/free-solid-svg-icons';
import "../../../Styles.scss";
import "../../App.scss";
import {Link} from "react-router-dom";
import {AxiosCalls} from "../../../utils/axiosCalls";


/**
 * Generiert ein Listen element / Item / todopunkt mit den übergebenen werten
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function TransactionElement(props) {

    const [date, setDate] = useState(props.item.date);
    const [showM, setShowM] = useState(false);
    const [titel, setTitel] = useState(props.schuldnerName);
      //  const [titel, setTitel] = useState(props.item.todoPunkt);
    const [betrag, setBetrag] = useState(0);
    const [notes, setNotes] = useState(props.item.notizen === undefined ? 'notizen' : props.item.notizen);
    //const [payBackNotes, setPayBackNotes] = useState(props.item.notizen === undefined ? 'notizen' : props.item.notizen);
    const [displayButton, setDisplayButton] = useState(props.item.strich ? "none" : "visible");
    const [displayTick, setDisplayTick] = useState(props.item.strich ? "visible": "none");
    const [displayColour, setDisplayColour] = useState(props.item.betrag >= 0 ? true : false );
    const [dept, setDept] = useState(props.item.originalAmount);




    /**
     * Speichert die Anzahl onchange in den State
     * @param e
     */
    const handleDate = (e) => {
        setDate(e.target.value);
        console.log("nummber: " + e + "id: " + props.item.itId);
    }

    /**
     * Setzt im App state über props.updateDone ein Item auf erledigt
     */
    const auswahlPayBackTransactions = () => {
        console.log("card or box klicked: " + props.item.itId);
        const ob = {
            "itId": props.id,
            "todoPunkt": "platzhalterdatenloeschen",
            "strich": false,
            "date": "2022-07-11"
        }
        props.auswahlPayBackTransactions(props.id, props.item.tId);

    }
     /**
      * Schließt Modal und speichert die änderungen im Localstorage (LocalStorageCalls) und im Frontend State (props.updatePunkt)
      */
    const handleClose = () => {
            console.log("notizen: " + notes);
           if(showM){
               const ob = {
                   "itId": props.item.itId,
                   "title": props.item.notizen, //"todoPunkt": titel,
                   "betrag": betrag,
                   "strich": false,
                   "datum": date,
                   "notizen": notes,
               }

               const newPayBackTransaction = {
                    "id": null,
                    "transactionId": props.item.id,
                    "debitorId": props.item.debitorId,
                    "amount": betrag,
                    "payBackDate": date,
                    "notes": notes,
               }

                                                                   //notizen statt titel, weil das ja der name der schulden ist
               // props.updateTransaction(props.item.itId, props.item.tId, props.schuldnerName, props.item.notizen, betrag, date, notes,false);
                AxiosCalls('post', '/neuePayBackTransaktion', newPayBackTransaction);

                setDisplayColour(betrag >= 0 ? true : false);
                setShowM(false);
            }
        };

    const handlePayAllBack = () => {
       // setBetrag(props.item.dept * -1);
        setBetrag((props.item.dept * -1).toFixed(2));
    }

    const handleDelete = () => {
        props.deleteTransaction(props.item.itId, props.item.tId);
        setShowM(false);
    }



    /**
     * Schließt Modal nur, ohne zu speichernt, setzt Werte auf vorher zurück
     */
    const handleCloseWithoutSaving = () => {

        setShowM(false);
        setTitel(props.item.todoPunkt);
        setNotes(props.item.notizen);
        setDate(props.item.date);
    }

    const calculateAcctualDept = () => {
        let today = new Date();
        let lendDate = new Date(props.item.date);
        let days =  today - lendDate;
        let payDay = days / props.item.interestPer;
        if(! payDay <1){
         let total = dept
            for(let i = 0; i< payDay; i++ ){
             let  interest = total * (props.item.interestRate/ 100);
                total += interest;
            }
            setDept(total);
        }

    }
   /* useEffect(() => {
    console.log(props.item.interestPer, props.item.interestRate);
        calculateAcctualDept();
      }, []); // Das leere Array als zweites Argument stellt sicher, dass useEffect nur einmal nach dem ersten Rendern ausgeführt wird
*/

    const handleShow = () => setShowM(true);
    const handleText = (e) => setTitel(e.target.value);
    const handleBetrag = (e) => setBetrag(e.target.value);
    const handleNotes = (e) => setNotes(e.target.value)

    return (

        <Card className=  { "transactionCardStyle " + (displayColour ? 'cardColourGrey' : 'cardColourGrey')}
              style={{border: '3px', cursor: "pointer"}}
              key={props.item.debitorId.toString()}>

            <div className="buttonHull">
                <Button style={{display: displayButton}} onClick={handleShow}
                        className="bearbeitungsButton"><FontAwesomeIcon className="form-icon" icon={faPen}/>
                </Button>
                <Button style={{display: displayTick}}
                                        className="abbezahltHarken"> <FontAwesomeIcon  className="form-icon" icon={faCheck} size="lg"/>
                                </Button>



            </div>

            <Card.Body >
               <Link to={`/payBackTransactions/${props.item.id}/${props.item.purpose}`} style={{ textDecoration: 'none' }} >
                <div className="punktHull">
                    <p className="punkt">{props.debitorName}</p>
                    <p  className={ (displayColour ? "transactionAmountGreen" : "transactionAmountRed") } > {Number(props.item.amount).toFixed(2)}</p>
                    <p className="transaktionWhite">{props.item.purpose} </p>
                    <p className="transaktionWhite">{props.item.strich} </p>
                    <p className="transaktionWhite">{props.item.borrowDate}</p>
                    <p className="transaktionWhite">{props.item.interestRate} %</p>
                    <p className="transaktionWhite">Fällig alle: {props.item.interestFrequency} Tage</p>
                    <p className="transaktionWhite">Zukünftige Zinsen: {props.item.futureInterest.toFixed(4)}</p>
                    <p  className={ (displayColour ? "transactionAmountGreen" : "transactionAmountRed") } >{props.item.originalAmount}</p>
                </div>
               </Link>
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
                                           <input className="form-control " type="number" onChange={handleBetrag} value={betrag}/>
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
                           <Button variant="success" size="sm" onClick={handlePayAllBack}> Alles abbezahle</Button>
                           <Button variant="danger" size="sm"  onClick={handleDelete}>Löschen</Button>
                           <Button variant="secondary" size="sm"
                                                 onClick={handleCloseWithoutSaving}>Abbrechen</Button>
                               <Button variant="primary" size="sm" onClick={handleClose}>Änderung Speichern</Button>
                           </Modal.Footer>
                       </Modal>

            </Card.Body>
        </Card>

    )
}

//<Card.Body onClick={(e) => auswahlPayBackTransactions()}>
