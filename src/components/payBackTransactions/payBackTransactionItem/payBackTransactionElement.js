import React, {useState, useEffect} from "react";
import {Col, Row, Card, Button, Modal} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPen, faCheck} from '@fortawesome/free-solid-svg-icons';
import "../../../Styles.scss";
import "../../App.scss";


/**
 * Generiert ein Listen element / Item / todopunkt mit den übergebenen werten
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function PayBackTransactionElement(props) {

    const [date, setDate] = useState(props.item.date);
    const [showM, setShowM] = useState(false);
    const [titel, setTitel] = useState(props.item.todoPunkt);
    const [betrag, setBetrag] = useState(0);
    const [notes, setNotes] = useState(props.item.notizen === undefined ? 'notizen' : props.item.notizen);
    const [displayButton, setDisplayButton] = useState(props.item.strich ? "none" : "visible");
    const [displayTick, setDisplayTick] = useState(props.item.strich ? "visible": "none");
    const [displayColour, setDisplayColour] = useState(props.item.betrag >= 0 ? true : false );
    const [dept, setDept] = useState(props.item.betrag);




    /**
     * Speichert die Anzahl onchange in den State
     * @param e
     */
    const handleDate = (e) => {
        setDate(e.target.value);
        console.log("nummber: " + e + "id: " + props.item.itId);
    }




    /**
     * Schließt Modal und speichert die änderungen im Localstorage (LocalStorageCalls) und im Frontend State (props.updatePunkt)
     */
    /*const handleClose = () => {
        console.log("notizen: " + notes);
       const ob = {
           "itId": props.item.itId,
           "todoPunkt": titel,
           "betrag": betrag,
           "strich": false,
           "datum": date,
           "notizen": notes
       }
        props.updatePunkt(props.item.itId, titel, betrag, false, date, notes);
        setShowM(false);
    } */

    /**
     * Schließt Modal nur, ohne zu speichernt, setzt Werte auf vorher zurück
     */



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
              key={props.item.itId.toString()}>



            <Card.Body >

                <div className="punktHull">
                    <p className="punkt">{props.item.name}</p>
                    <p className="transaktionWhite">{props.item.notizen} </p>
                    <p className="transaktionWhite">{props.item.date}</p>
                    <p className={ (displayColour ? "transactionAmountGreen" : "transactionAmountRed") } >{props.item.betrag}</p>
                </div>



            </Card.Body>
        </Card>

    )
}