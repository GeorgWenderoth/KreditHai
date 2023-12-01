import React, {useState, useEffect} from "react";
import {Col, Row, Card, Button, Modal} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPen} from '@fortawesome/free-solid-svg-icons';
import "../../../Styles.scss";
import "../../App.scss";


/**
 * Generiert ein Listen element / Item / todopunkt mit den übergebenen werten
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function TransactionElement(props) {

    const [date, setDate] = useState(props.item.date);
    const [showM, setShowM] = useState(false);
    const [titel, setTitel] = useState(props.item.todoPunkt);
    const [betrag, setBetrag] = useState(0);
    const [notes, setNotes] = useState(props.item.notizen === undefined ? 'notizen' : props.item.notizen);
    const [displayButton, setDisplayButton] = useState(props.item.strich ? "none" : "visible");
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
     * Setzt im App state über props.updateDone ein Item auf erledigt
     */
    const todoErledigt = () => {
        console.log("card or box klicked: " + props.item.itId);
        const ob = {
            "itId": props.id,
            "todoPunkt": "platzhalterdatenloeschen",
            "strich": false,
            "date": "2022-07-11"
        }
        props.updateDoneOrNot(props.id, props.item.strich);

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
              key={props.item.itId.toString()}>
            <div className="buttonHull">

            </div>


            <Card.Body >

                <div className="punktHull">
                    <p className="punkt">{props.item.todoPunkt}</p>
                    <p  className={ (displayColour ? "transactionAmountGreen" : "transactionAmountRed") } >{dept}</p>
                    <p className="transaktionWhite">{props.item.notizen} </p>
                    <p className="transaktionWhite">{props.item.date}</p>
                    <p className="transaktionWhite">{props.item.interestRate}%</p>
                    <p className="transaktionWhite">Fällig alle: {props.item.interestPer} Tage</p>
                    <p  className={ (displayColour ? "transactionAmountGreen" : "transactionAmountRed") } >{props.item.betrag}</p>
                </div>
            </Card.Body>
        </Card>
    )
}
