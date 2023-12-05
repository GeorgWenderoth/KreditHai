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
export function ListElement(props) {
    let newDate = new Date();
     let datum =  newDate.toISOString().split('T')[0];
    const [date, setDate] = useState(datum); //this is for transaction
    const [transactionDate, setTransactionDate] = useState(datum);
    const [showM, setShowM] = useState(false);
    const [titel, setTitel] = useState(props.item.todoPunkt);
    const [betrag, setBetrag] = useState(0);
    const [notes, setNotes] = useState(props.item.notizen === undefined ? 'notizen' : props.item.notizen);
    const [displayButton, setDisplayButton] = useState(props.item.strich ? "none" : "visible");
   // const [displayColour, setDisplayColour] = useState(props.item.strich);
    const [displayColour, setDisplayColour] = useState(props.item.betrag >= 0 ? true : false );
    const [interestRate, setInterestRate] = useState(0);
    const [interestPer, setInterestPer] = useState(0);
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
    const handleClose = () => {
        console.log("notizen: " + notes);
       const ob = {
           "itId": props.item.itId,
           "todoPunkt": titel,
           "betrag": betrag,
           "strich": false,
           "datum": date,
           "notizen": notes
       }
        props.updatePunkt(props.item.itId, titel, betrag, false, date, notes, interestRate, interestPer);

        setDisplayColour(betrag >= 0 ? true : false);
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

    const handleDelete = () => {
        props.deletePunkt(props.item.itId);
    }

    const MINUTE_MS = 60000;

   /* useEffect(() => {
      const interval = setInterval(() => {
        console.log('Logs every minute');
      }, MINUTE_MS);

      return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, []) */


    const handleShow = () => setShowM(true);
    const handleText = (e) => setTitel(e.target.value);
    const handleBetrag = (e) => setBetrag(e.target.value);
    const handleNotes = (e) => setNotes(e.target.value);
    const handleInterestRate = (e) => setInterestRate(e.target.value);
    const handleInterestPer = (e) => setInterestPer(e.target.value);

    return (
        
        <Card className=  {"cardStyle " + (displayColour ? 'cardColourGreen' : 'cardColourRed')}
              style={{border: '3px', cursor: "pointer"}}
              key={props.item.itId.toString()}>
            <div className="buttonHull">
                <Button style={{display: displayButton}} onClick={handleShow}
                        className="bearbeitungsButton"><FontAwesomeIcon className="form-icon" icon={faPen}/></Button>
            </div>
           <Modal show={showM} onHide={handleCloseWithoutSaving}>
                           <Modal.Header closeButton>
                               <Modal.Title>
                                   Geld Transfer
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
                                       <label className="col-3 col-form-label">Verwendung: </label>
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
                                   <div className="mb-3 row">
                                         <label className="col-3 col-form-label">Zins: </label>
                                              <div className="col-9">
                                                 <input className="form-control " type="number" onChange={handleInterestRate} value={interestRate}/>
                                              </div>
                                   </div>
                                   <div className="mb-3 row">
                                          <label className="col-3 col-form-label">Fällig: </label>
                                                <div className="col-9">
                                                    <input className="form-control " type="number" onChange={handleInterestPer} value={interestPer}/>
                                                </div>
                                   </div>
                               </div>
                           </Modal.Body>
                           <Modal.Footer>
                           <Button variant="danger" size="sm"  onClick={handleDelete}>Abbrechen(->Löschen)</Button>
                           <Button variant="secondary" size="sm"
                                                 onClick={handleCloseWithoutSaving}>Abbrechen</Button>
                               <Button variant="primary" size="sm" onClick={handleClose}>Änderung Speichern</Button>
                           </Modal.Footer>
                       </Modal>

            <Card.Body onClick={(e) => todoErledigt()}>
               
                <div className="punktHull">
                    <p className="punkt">{props.item.todoPunkt}</p>
                    <p> {Number(props.item.betrag).toFixed(2)}</p>
                </div>
            </Card.Body>
        </Card>
    )
}

