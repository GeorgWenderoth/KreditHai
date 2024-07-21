import React, {useEffect} from "react";
import "./App.scss";
import {Button, Modal} from "react-bootstrap";
import {ToDoHeader} from "./header/toDoHeader";
import {BereichUeberschrift} from "./ueberschrift/bereichUeberschrift";
import {ContainerListe} from "./liste/containerListe";
import {LocalStorageIdService} from "../utils/localStorageIdService";
import {LocalStorageCalls} from "../utils/localStorageCalls";
import {TransactionListe} from "./transactions/transactionListeOld";
import {PayBackTransactionListe} from "./payBackTransactions/payBackTransactionListe";
import {AxiosCalls} from "../utils/axiosCalls";

/**
 * Main Component
 * Rendert alle anderen Components
 */
class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            punkt: [],
            punktErledigt: [],
            amount: '',
            showM: false,
            transactions: [],
            payBackTransactions: [],
            deptOfAllDebtorsCombined: 0,
            isUpdatingDebts: false,

        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteAllDoneItems = this.deleteAllDoneItems.bind(this);
        this.handleCloseErrorModal = this.handleCloseErrorModal.bind(this);
    }

    componentDidMount() {
        this.backBoth();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    componentWillUnmount() {
      // Clear the interval to avoid memory leaks when the component is unmounted
      clearInterval(this.updateInterval);
    }

    backBoth() {
        let transactions;
        //new ConnectBackendCode

        let promise = AxiosCalls('get', '/alleSchuldner');
        let debitors;
          promise.then(value => {
                     debitors = value.data;
                     console.log("debitors: ", debitors);
                     this.setState({punkt: debitors});
                 });
    }

    /**
     * Posted einen Neuen Schuldner ans Backend
     * @param value = Der String der Eingegeben wurde
     */
    // Anlegen neuer User
    //Wichtig!!
    handleSubmit = (value) => {

        if (value !== undefined) { 
            console.log("submitValue:", value);
            const trim = value.trim();
            const split = trim.split(/(\d+)/);
            let anzahl;
            console.log("anzahl Split: ", split[split.length -2]);
        
            let todoPunkt = split.toString();
            todoPunkt = todoPunkt.trim();
            todoPunkt = todoPunkt.replace(/,/g, '');
            let date = new Date();
            let datum =  date.toISOString().split('T')[0];


           let id = LocalStorageIdService();

            let newDebitor = {
                 "itId": id,
                 "debitorName": todoPunkt,
                 "betrag": 0,
                 "strich": false,
                 "date": datum,
            }

            let promise = AxiosCalls('post', '/neuerSchuldner', newDebitor);
            promise.then(item => {

                let debitors = [...this.state.punkt];
                debitors.push(item.data);
                this.setState({punkt: debitors});
            });

        }
    }

    /**
     * Von child to parent component, Wird im Child  listElement aufgerufen und mit de übergeben werte wird im state in ein orbjekt geupdatet
     * @param {number} id - id des objekts fürs localstorage /backend
     * @param {string} title - todoPunkt (name des To-dos)
     * @param  harken - sind die To-dos erledigt oder nicht
     * @param {number} datum - Das Datum wann ein To-do erledigt werden soll
     * @param {string} notizen - Notizen / bemerkungen
     */


    //Wichtig!!! post transaction!
    addTransactionInState(id, title, betrag, harken, datum, notizen, interestRate, interestPer, freePayBackTime) {


            let punkt = [...this.state.punkt];
            console.log("p", punkt[1]);
            let i = punkt.map(a => a.itId).indexOf(id);
            console.log("i: " + i);
            let cDebitor = {...punkt[id]};
            let pBetrag = parseInt(betrag);
            let zBetrag = parseInt(punkt[i].amount);
            let nBetrag = Number(zBetrag) + Number(betrag);
            let ergebniss = zBetrag + betrag;


            var cTransactions = punkt[i].transactions;

             let tId = LocalStorageIdService();
              let newTransaction = {

                                                   "id": tId,
                                                   "debitorId": id,
                                                   "purpose": notizen,
                                                   "amount": betrag,
                                                   "dept": Number(betrag),
                                                   "borrowDate": datum,
                                                   "interestRate": interestRate,
                                                   "interestFrequency": interestPer,
                                                   "interestStartDate": freePayBackTime,
                                                   "notizen": notizen,
                                                    "strich": false,
                                                    "paidBack": 0,
                                                    "updateDate": datum,
                                                    "debitorName": title,

                                               };

               if(Array.isArray(cTransactions)){
               cTransactions.push(newTransaction);
               } else {
               cTransactions = [newTransaction];
               };
            cDebitor = {
                "itId": id,
                "todoPunkt": title,
                "betrag": nBetrag,
                "strich": harken,
                "date": datum,
                "notizen": notizen,
               //  "transactions": cTransactions,

            }
            punkt[i] = cDebitor;
            //LocalStorageCalls('post', 'punkt', punkt);
            let promise = AxiosCalls('post', '/neueTransaktion', newTransaction);
            promise.then(item => {

                            let debitors = [...this.state.punkt];
                            debitors.push(cDebitor);
                            this.setState({punkt});
                        });

            console.log("punktTest: " + id + " " + this.state.punkt[i].itId, this.state.punkt[i].einkaufsPunkt, this.state.punkt[i].notizen);
        }

    /**
     *  Löscht alle erledigten Items / To-dos
     */
    deleteAllDoneItems() {
        LocalStorageCalls('delete')
        this.setState({punktErledigt: []});

    }
        // Wichtig!!!!
        deleateSpecificItem(id){

          const punktArray = JSON.parse(localStorage.getItem('punkt')); // get data from LS
                    let indexPunkt = punktArray.map(a => a.itId).indexOf(id);

            punktArray.splice(indexPunkt, 1); // remove the item on position 0
            localStorage.setItem('punkt', JSON.stringify(punktArray)); // save it back to LS */
            console.log("deleate Item: ", id);
            let punkt = [...this.state.punkt];
                    let indexItem = punkt.map(a => a.itId).indexOf(id);

             punkt.splice(indexItem, 1);
             this.setState({punkt: punkt});

             //axiosCalls to Bakend und nen Läsch endpunkt
        }

        // new for errorModal 01.02.24
        handleCloseErrorModal(){
            this.setState({showM: false});
        }


    render() {

    let speicher = {...this.state.punkt}
    const schuldnerName = this.state.transactions > 0 ? this.state.transactions[0].name : 'Test';


        return (
            <div className="App">
                <ToDoHeader handleSubmit={(value) => this.handleSubmit(value)}/>
                <BereichUeberschrift ueberschrift={"Zu erledigende To-dos"}/>
                <ContainerListe itemList={this.state.punkt}
                                updatePunkt={(id, title, betrag, harken, datum, notizen, interestRate, interestPer, freePayBackTime) =>
                                    this.addTransactionInState(id, title, betrag, harken, datum, notizen, interestRate, interestPer, freePayBackTime)}
                                auswahlTransactions={(id, harken) => this.auswahlTransactions(id, harken)}
                                deletePunkt ={(id)=> this.deleateSpecificItem(id)}
                                />


                                //causing error, coz possible loop, // ich glaube ich muss das in nem anderen component machen
                                <Modal show={this.state.showM} onHide={this.handleCloseErrorModal} >
                                                                       <Modal.Header className="bg-danger" closeButton>
                                                                           <Modal.Title>
                                                                               Falsche Eingabe:
                                                                           </Modal.Title>
                                                                       </Modal.Header>
                                                                       <Modal.Body className="bg-danger">
                                                                            Schulden können nur abezahlt, aber nicht weiter aufgebaut werden,
                                                                            Schulden könne nicht überbezahlt werden.
                                                                       </Modal.Body>
                                                                       <Modal.Footer className="bg-danger">
                                                                       </Modal.Footer>
                                </Modal>
            </div>
        )
    }
}

export default App;


