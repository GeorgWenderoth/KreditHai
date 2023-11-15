import React, {useState} from "react";
import {Col, Row, Card, Button, Modal} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPen} from '@fortawesome/free-solid-svg-icons';
import "../../../Styles.scss";
import "../../App.scss";

/**
 * Generiert ein Listen element / Item / einkaufspunkt mit den übergebenen werten
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function ListElement(props) {
    const [amount, setAmount] = useState(props.item.amount);
  
    const [showM, setShowM] = useState(false);
    const [titel, setTitel] = useState(props.item.einkaufsPunkt)
    const [notes, setNotes] = useState(props.item.notizen === undefined ? 'notizen' : props.item.notizen);
    const [displayButton, setDisplayButton] = useState(props.item.strich ? "none" : "visible");
    const [displayColour, setDisplayColour] = useState(props.item.strich);

    /**
     * Speichert die Anzahl onchange in den State
     * @param e
     */
    const handleNumber = (e) => {
        setAmount(e.target.value);
        console.log("nummber: " + e + "id: " + props.item.itId);
    }

    /**
     * Setzt im Backend durch AxiosCalls und im App state über props.updateDone ein Item auf erledigt
     */
    const einkaufErledigt = () => {
        console.log("card or box klicked: " + props.item.itId);
        const ob = {
            "itId": props.id,
            "einkaufsPunkt": "platzhalterdatenloeschen",
            "strich": false,
            "amount": 1
        }

       /// AxiosCalls('put','/einkaufsListeDurchgestrichen',ob);
        
        props.updateDoneOrNot(props.id, props.item.strich);

    }

    /**
     * Schließt Modal und speichert die änderungen im Backend (AxiosCalls) und im Frontend State (props.updatePunkt)
     */
    const handleClose = () => {
        console.log("notizen: " + notes);
       const ob = {
           "itId": props.item.itId,
           "einkaufsPunkt": titel,
           "strich": false,
           "amount": amount,
           "notizen": notes
       }
      // AxiosCalls('put','/einkaufsListeUpdateM', ob);

        props.updatePunkt(props.item.itId, titel, false, amount, notes);
        setShowM(false);
    }

    /**
     * Schließt Modal nur, ohne zu speichernt, setzt Werte auf vorher zurück
     */
    const handleCloseWithoutSaving = () => {

        setShowM(false);
        setTitel(props.item.einkaufsPunkt);
        setNotes(props.item.notizen);
        setAmount(props.item.amount);
    }


    const handleShow = () => setShowM(true);
    const handleText = (e) => setTitel(e.target.value);
    const handleNotes = (e) => setNotes(e.target.value)

    return (

        <Card className={"cardStyle " + (displayColour ? 'cardColourGreen' : 'cardColourRed')}
              style={{border: '3px', cursor: "pointer"}}
              key={props.item.itId.toString()}>
            <div className="buttonHull">
                <Button style={{display: displayButton}} onClick={handleShow}
                        className="bearbeitungsButton"><FontAwesomeIcon className="form-icon" icon={faPen}/></Button>
            </div>
            <Modal show={showM} onHide={handleCloseWithoutSaving}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Bearbeite Einkaufspunkt
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="mb-3 row">
                            <label className="col-3 col-form-label">Einkauf: </label>
                            <div className="col-9">
                                <input className="form-control " type="text" onChange={handleText} value={titel}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label className="col-3 col-form-label">Notizen: </label>
                            <div className="col-9">
                                <input className="form-control" type="text"
                                       placeholder="Notizen"
                                       onChange={handleNotes}
                                       value={notes}/>
                            </div>
                        </div>
                        <div className="row">
                            <label className=" col-3 col-form-label">Datum: </label>
                            <div className="col-9">
                                <input className="form-control" type="date" value= {amount}
                                       onChange={(e) => handleNumber(e)}/>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer><Button variant="secondary" size="sm"
                                      onClick={handleCloseWithoutSaving}>Abbrechen</Button>
                    <Button variant="primary" size="sm" onClick={handleClose}>Änderung Speichern</Button>
                </Modal.Footer>
            </Modal>
            <Card.Body onClick={(e) => einkaufErledigt()}>
                <div className="logoHull">
                    <p className="logo">{props.item.einkaufsPunkt[0]}</p>
                </div>
                <div className="punktHull">
                    <p className="punkt">{props.item.einkaufsPunkt}</p> <p className="punktAmount">{props.item.amount}</p>
                </div>
            </Card.Body>

        </Card>

    )
}

