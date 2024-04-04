import React, {useEffect} from "react";
import "./App.scss";
import {Button, Modal} from "react-bootstrap";
import {ToDoHeader} from "./header/toDoHeader";
import {BereichUeberschrift} from "./ueberschrift/bereichUeberschrift";
import {ContainerListe} from "./liste/containerListe";
import {LocalStorageIdService} from "../utils/localStorageIdService";
import {LocalStorageCalls} from "../utils/localStorageCalls";
import {TransactionListe} from "./transactions/transactionListe";
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
       // this.updateInterval = this.updateInterval.bind(this);
    }

    componentDidMount() {
        console.log("start");
        this.backBoth();
       // this.updateAllDeptTransactions();
        //this.updateInterval = setInterval(this.updateAllDeptTransactions, 5000);
       // this.updateInterval = setInterval(() => this.updateAllDeptTransactions(), 15000);
     /*  setTimeout(() => {
             this.updateAllDeptTransactions();

             // Setze den Interval, um updateAllDeptTransactions alle 5 Minuten aufzurufen
             this.updateInterval = setInterval(() => this.updateAllDeptTransactions(), 300000);
           }, 15000); */
    }



    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("Update: Punkt: ", this.state.punkt);
        console.log("Update: PunktER: ", this.state.punktErledigt);
       /* if(this.state.deptOfAllDebtorsCombined === prevState.deptOfAllDebtorsCombined){
            this.updateAllDeptTransactions();
        } */
       /*if (this.state.deptOfAllDebtorsCombined !== prevState.deptOfAllDebtorsCombined) {
           // Ensure that an update is necessary to avoid infinite loop
           if (!this.state.isUpdatingDebts) {
             this.setState({ isUpdatingDebts: true }, () => {
               // Call the function and reset the flag after the update
               this.updateAllDeptTransactions();
               this.setState({ isUpdatingDebts: false });
             });
           }
         } */
       // this.updateAllDeptTransactions();
    }

    componentWillUnmount() {
      // Clear the interval to avoid memory leaks when the component is unmounted
      clearInterval(this.updateInterval);
    }



    backBoth() {
        let dataNotDone;
        let dataDone;
        let transactions;


        //old frontendOnlyCode
        dataNotDone = LocalStorageCalls('get', 'punkt');
        dataDone = LocalStorageCalls('get', 'punktErledigt');

        //new ConnectBackendCode

        let promise = AxiosCalls('get', '/alleSchuldner');
        let debitors;
          promise.then(value => {
                     debitors = value.data;
                     console.log("debitors: ", debitors);
                     this.setState({punkt: debitors});
                 });


        transactions = dataNotDone[0].transactions;
        console.log("backBoth: ", dataNotDone, dataDone);
       // console.log("backBothTransac: ", transactions);
        this.setState({punkt: dataNotDone, punktErledigt: dataDone,});
    }


    /**
     * Man die eingabe konform, speichert im state und localStorage
     * @param value = Der String der Eingegeben wurde
     */
    // Anlegen neuer User
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

            console.log("date: ", datum);
            console.log("p: " + todoPunkt);

           let id = LocalStorageIdService();
            console.log("loclastorageid2: ", id );
            let cPunkt = {
                "itId": id,
                "todoPunkt": todoPunkt,
                "betrag": 0,
                "strich": false,
                "date": datum,
                "transactions": [],
            }

            let newDebitor = {
                 "itId": id,
                 "debitorName": todoPunkt,
                 "betrag": 0,
                 "strich": false,
                 "date": datum,
            }

            AxiosCalls('post', '/neuerSchuldner', newDebitor);


            /*let punkt = [...this.state.punkt];
                            punkt.push(cPunkt);
              LocalStorageCalls('post', 'punkt', punkt);
            this.setState({punkt: punkt}); */
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
    updatePunktInState(id, title, betrag, harken, datum, notizen) {
        console.log("parameter: " + id + " " + title + " " + datum + " " + notizen)
        console.log("punkt " + this.state.punkt[0]);
        let punkt = [...this.state.punkt];
        let i = punkt.map(a => a.itId).indexOf(id);
        console.log("i: " + i);
        let cPunkt = {...punkt[id]};

        cPunkt = {
            "itId": id,
            "todoPunkt": title,
            "betrag": betrag,
            "strich": harken,
            "date": datum,
            "notizen": notizen
        }
        punkt[i] = cPunkt;

        LocalStorageCalls('post', 'punkt', punkt);
        this.setState({punkt});
        console.log("punktTest: " + id + " " + this.state.punkt[i].itId, this.state.punkt[i].einkaufsPunkt, this.state.punkt[i].notizen);
    }


    addTransactionInState(id, title, betrag, harken, datum, notizen, interestRate, interestPer, freePayBackTime) {
           // console.log("parameter: " + id + " " + title + " " + datum + " " + notizen)
            console.log("punkt " + this.state.punkt[0]);
            console.log("title: ", title);
            let punkt = [...this.state.punkt];
            console.log("p", punkt[1]);
            let i = punkt.map(a => a.itId).indexOf(id);
            console.log("i: " + i);
            let cPunkt = {...punkt[id]};
            let pBetrag = parseInt(betrag);
            let zBetrag = parseInt(punkt[i].betrag);
            let nBetrag = Number(zBetrag) + Number(betrag);
            console.log("zBetrag: ", zBetrag);
            console.log("rechnung", nBetrag);

            var cTransactions = punkt[i].transactions;
            console.log("cTransactions", cTransactions);
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
                                                   /*  "itId": id,
                                                                                                         "tId": tId,
                                                   "name": title,
                                                                                                      "betrag": betrag,
                                                                                                      "dept": Number(betrag),
                                                                                                      "strich": false,
                                                                                                      "date": datum,
                                                                                                      "notizen": notizen,
                                                                                                      "interest": interestRate,
                                                                                                      "interestPer": interestPer,
                                                                                                      "paidBack": 0,
                                                                                                      "payBackTransactions": [],
                                                                                                      "updateDate": datum,
                                                                                                      "freePayBackTime": freePayBackTime,*/
                                               };
              // cTransactions.push(newTransaction);
               if(Array.isArray(cTransactions)){
               cTransactions.push(newTransaction);
               } else {
               cTransactions = [newTransaction];
               };
            cPunkt = {
                "itId": id,
                "todoPunkt": title,
                "betrag": nBetrag,
                "strich": harken,
                "date": datum,
                "notizen": notizen,
                 "transactions": cTransactions,

            }
            punkt[i] = cPunkt;
            //LocalStorageCalls('post', 'punkt', punkt);
            AxiosCalls('post', '/neueTransaktion', newTransaction);
            this.setState({punkt});
            console.log("punktTest: " + id + " " + this.state.punkt[i].itId, this.state.punkt[i].einkaufsPunkt, this.state.punkt[i].notizen);
        }

       /* updateAllDeptTransactions(){
                    console.log("updateAllDeptTransactions");
                    let punkt = [...this.state.punkt]
                    console.log(punkt);
                   // punkt.forEach((element) => this.updateDeptTransactions(element.itId));
                   punkt.map((item) => this.updateDeptTransactions(item));
                  // punkt.forEach((element) => console.log(element.itId));
                }; */



        updateAllDeptTransactions() {
          console.log("updateAllDeptTransactions");
          const currentDate = new Date();
          const currentDateISO = currentDate.toISOString().split('T')[0];
            let passedDays;
            let payDays;
            //let combinedDept = 0;
            let deptOfAllDebtorsCombined = this.state.deptOfAllDebtorsCombined;
            let shouldBeUpdated = false;
          // Clone the punkt array
          let punk = [...this.state.punkt];
           // goint trhu eatch item / deptor
          const updatedPunkt = this.state.punkt.map((item) => {


                                                         // Clone the item to avoid mutating the state directly
                                                         const updatedItem = { ...item };
                                                                console.log("item notizen: ", updatedItem.notizen);

                                                         const transactions = updatedItem.transactions || [];
                                                         const updatedTransactions = [];
                                                         //hier is das problem 0
                                                         let combinedTransactionsDept = 0;
                                                         //test
                                                                let addingAllOriginalTransactionLendigs = 0;
                                                         // Going thru the transactions
                                                            //Test if it acctucally goes trhu all
                                                            let zähler = 0;
                                                            let elseZähler = 0;
                                                         transactions.forEach((transaction) => {


                                                               //setting up dates and times
                                                               //Limiting Dates to Days so that its bound to the calender instead of hours
                                                               let borrowDate = new Date(transaction.date);
                                                               borrowDate= new Date(borrowDate.getFullYear(), borrowDate.getMonth(), borrowDate.getDate());

                                                               let updateDate = new Date(transaction.updateDate);
                                                                   updateDate = new Date( updateDate.getFullYear(), updateDate.getMonth(), updateDate.getDate());

                                                               // Datum bis zu dem man ohne interest/ Zinsen zurückzahen kann
                                                               let freePayBackDate = new Date(transaction.freePayBackTime);
                                                                   freePayBackDate = new Date(freePayBackDate.getFullYear(), freePayBackDate.getMonth(), freePayBackDate.getDate());

                                                               // date used for the passed time calculation takes one of the other dates,
                                                               let lastInterestDate;

                                                               //wenn, ist das so richtig, müsste es nicht >= sein ?
                                                               if( updateDate > borrowDate) {
                                                                //wenn nicht null und größer
                                                                    lastInterestDate = updateDate;
                                                               }else {
                                                                //wenn null oder nicht kleiner
                                                                    lastInterestDate = borrowDate;
                                                                    updateDate = borrowDate;
                                                               }

                                                                //SicherStellen Das alle Daten stimmen , nicht null sind, und sie korrgieren wenn sie es sind
                                                               if(freePayBackDate === null || freePayBackDate < borrowDate ){
                                                                    freePayBackDate = borrowDate;
                                                               };

                                                                //Der Teil müsste der überflüssige sein
                                                               /* if( updateDate > borrowDate) {
                                                                   //wenn nicht null und größer
                                                                    lastInterestDate = updateDate;

                                                                }else {
                                                                     //wenn null oder nicht kleiner
                                                                    lastInterestDate = borrowDate;
                                                                    updateDate = borrowDate;
                                                                } */

                                                               if(currentDate <= freePayBackDate){
                                                                    //wenn innerhalt payBckTime
                                                                    lastInterestDate = currentDate;
                                                               } else {
                                                                    //wenn auserhalb

                                                                    // wenn aber ubdated größer ist
                                                                    if(updateDate < freePayBackDate) {
                                                                      lastInterestDate = freePayBackDate;
                                                                    };


                                                               }; // Bis hier sollt eigendlich funktionieren und alle fälle lösen

                                                               const timePassedMS = currentDate - lastInterestDate;


                                                               //Richtige lösung, Datum auf tage begrenzen (ohne stunden)
                                                               passedDays = Math.floor(timePassedMS / (1000 * 60 * 60 * 24));

                                                               payDays = passedDays  / transaction.interestPer;

                                                               let transactionDept;
                                                               transactionDept = Number(transaction.dept);

                                                               // applying interesst to a single transaction
                                                                        //(important here is if its empty or 0, how should the logic work? with 0 you could have one interation tho intersst mid be applied
                                                               if (payDays >= transaction.interestPer && transaction.interestPer > 0) {
                                                                            console.log("Zinsen");
                                                                            console.log("trnsaction.dept: ", transaction.dept);


                                                                    // neu: +(-) paid back,  funktionierts?, wie  mache ich das bei plus/ minus beträgen,
                                                                    let calculatedDept = transactionDept; //+ transaction.paidBack;

                                                                            console.log("start dept: ", calculatedDept);

                                                                    // calculating the dept with interesst
                                                                    // calculating calculatedDept
                                                                        // i = 1 wegen  <=, dardurch geht die loop sonst einmal mehr durch
                                                                    for (let i = 1; i <= payDays; i++) {
                                                                        const interest = calculatedDept * (transaction.interest / 100);
                                                                                console.log("interest: ", interest);
                                                                                console.log("curentDept(loop) before: ", calculatedDept);
                                                                        calculatedDept += interest;
                                                                                console.log("curentDept(loop): ", calculatedDept);
                                                                                console.log("test: ", payDays, " ", i);
                                                                    };

                                                                           console.log("totalDept: ", calculatedDept);

                                                                    //updating the transacton dept to the dept with interesst
                                                                    transaction.dept = calculatedDept;

                                                                    //setting updateDate to currentDate
                                                                    transaction.updateDate = currentDate;

                                                                    //adding the transaction dept with interesst to the overall dept
                                                                    combinedTransactionsDept += calculatedDept;
                                                                            console.log("combined Dept after update: ", combinedTransactionsDept);
                                                               } else {
                                                                    // adding transaction.dept = transactionDept ?? würde es korrigieren, allerdings könnte es in der zukunft heisen das wenn nichts berechnet wird es zurük gesetzt wird.
                                                                            //(braucht es diese zeile?)
                                                                    transaction.dept = transactionDept;
                                                                    //new
                                                                            console.log("Kein Update für: ", transaction.notizen);
                                                                            combinedTransactionsDept += transactionDept;
                                                                            console.log("Kein Update für: ", transaction.notizen);
                                                                            elseZähler++;
                                                                            console.log("elseZähler: ", elseZähler);
                                                               }

                                                                // add the updated transaction to the
                                                                updatedTransactions.push(transaction);


                                                         });

                                                            // Checking If the dept has Changed, as to not update if there is no change
                                                                // potencial problem if transactions change without changing the overall sum of the person.
                                                         if(combinedTransactionsDept !== item.betrag){
                                                                        //Brauche ich die Logs noch?
                                                                        deptOfAllDebtorsCombined +=  combinedTransactionsDept;
                                                                        console.log("combined Dept (somethings wrong?): ", combinedTransactionsDept);
                                                              shouldBeUpdated = true;
                                                              updatedItem.betrag = combinedTransactionsDept;
                                                                        console.log("updatedItem.betrag after update: ", item.betrag, " ", updatedItem.betrag);
                                                         } else {
                                                                        console.log("combined Dept else(somethings wrong?): ", combinedTransactionsDept);
                                                         }

                                                         // Update the transactions array in the cloned item
                                                         updatedItem.transactions = updatedTransactions;
                                                                    console.log("updatedItem: ", updatedItem);
                                                         return updatedItem;
                                                   });

             // Update the state with the modified punkt array
             if(shouldBeUpdated){
                        console.log("statecalled:", updatedPunkt)
              //updatePunkt.betrag = combinedDept;
              this.setState({ punkt: updatedPunkt });
              localStorage.setItem('punkt', JSON.stringify(updatedPunkt));
             } else {
                        console.log("shouldBeUpdated: ", shouldBeUpdated);
             }

        };




    // was mit "exploit" das man schulden bezhalen kann befor zinsen angewendet werden?
    // was mit bezal harken oder so, -> im fronten verhindern das man es über haupt editieren kann?
    //payBack
    updateTransaction(id, tId, title, transactionNote, betrag,datum, notizen, harken){
                             console.log("updateTransaction Test: ", id, tId, title, betrag, datum, notizen,);
                              const punktArray = [...this.state.punkt];
                              const indexItem = this.state.punkt.map(item => item.itId).indexOf(id);
                              console.log("indexItem: ", indexItem);

                              let transactions =  punktArray[indexItem].transactions;
                              let tIndex = transactions.map( transaction => transaction.tId).indexOf(tId);
                                                                                console.log("tIndex: ", tIndex);
                                                             console.log("transaction: ", transactions[tIndex]);

                              let cDept = transactions[tIndex].dept;
                              console.log("cDept: ", cDept);
                              console.log("betrag: ", betrag);
                              console.log("title: ", title);
                              //mit toFixed Runden damit ein gerundetes erebnis bezahlt werden kann.
                                    // einheitlich runden mit math,
                             // let cDeptRounded = Math.round(cDept); //.toFixed(2);
                              let oldDeptRounded =  Number(cDept.toFixed(2));///Math.round(cDept);
                                console.log("oldDeptRounded: ", oldDeptRounded);
                              let newDept = oldDeptRounded + Number(betrag);
                              console.log("newDepth: ", newDept);
                              let newDeptRounded = Number(newDept.toFixed(2));//Math.round(newDept);
                             // let oldDeptRounded = transactions[tIndex].dept.toFixed(2);

                              console.log("OldDept Rounded: ", oldDeptRounded);
                              console.log("new Dept rounded: ", newDeptRounded);

                              // is working like intended, new Dept allways has to reduce Dept and not overpay // 0.00 wegen rundung auf zwei komma stellen, keine ahnung ob man es braucht fixed den bug jedenfalls net.
                              if(oldDeptRounded < 0.00 && newDept <= 0.00 && newDept > oldDeptRounded ||
                                 oldDeptRounded > 0.00 && newDept >= 0.00 && newDept < oldDeptRounded) {

                                    //Zusammen mit harken (unten) combinieren / optimieren
                                     // hä es geh nicht ich checke es nicht.
                                    if(newDeptRounded === 0.00){
                                        transactions[tIndex].dept = newDeptRounded;
                                        transactions[tIndex].strich = true;
                                            console.log("newDeptRounded === 0.00)");
                                    } else if (newDeptRounded === 0) {
                                        transactions[tIndex].dept = newDept;
                                        transactions[tIndex].strich = true;
                                            console.log("newDeptRounded === 0)");
                                    };


                                    let payBackTransactionId = LocalStorageIdService();
                                    let newPayBackTransaction = {
                                                                    "itId": id,
                                                                    "tId": payBackTransactionId,
                                                                    "payBackToId": tId,
                                                                    "schuldnerName": title,
                                                                    "transactionNote": transactionNote,
                                                                    "betrag": betrag,
                                                                    "strich": harken,
                                                                    "date": datum,
                                                                    "payBackNote": notizen,
                                                                };





                                    let cPayBackTransactions =   transactions[tIndex].payBackTransactions
                                    if(Array.isArray(cPayBackTransactions)){
                                                  cPayBackTransactions.push(newPayBackTransaction);
                                                   } else {
                                                   cPayBackTransactions = [newPayBackTransaction];
                                                   };

                                    transactions[tIndex].payBackTransactions = cPayBackTransactions;

                                    //13.02.24 if paid of
                                    /*if(transactions[tIndex].dept === 0.00){
                                        transactions[tIndex].strich = true;
                                    }; */

                                    console.log("newDept: ", newDept);
                                    // transactions[tIndex].dept = newDept;
                                    console.log("transaction dept after update: ", transactions[tIndex].dept);

                                    console.log("updateDate: ", transactions[tIndex].updateDate);


                                    punktArray[indexItem].transactions = transactions;


                                   this.setState({punkt: punktArray});
                                    // vorsicht ganz unten ist anders, wir testen das einfach mal
                                   localStorage.setItem('punkt', JSON.stringify(punktArray));
                              } else {
                                this.setState({showM: true});
                                console.log("dept: ", )
                              }
            };

    deleteTransaction(id, tId, title, betrag,datum, notizen){
                         console.log("deleateTransaction Test: ", id, tId, title, betrag, datum, notizen,);
                          const punktArray = [...this.state.punkt];
                          const indexItem = this.state.punkt.map(item => item.itId).indexOf(id);
                          console.log("indexItem: ", indexItem);
                          //const updatePunkt =
                              let transactions =  punktArray[indexItem].transactions;
                              let tIndex = transactions.map( transaction => transaction.tId).indexOf(tId);
                                                                            console.log("tIndex: ", tIndex);
                                                         console.log("transaction: ", transactions[tIndex]);
                                                        transactions.splice(tIndex, 1);
            punktArray[indexItem].transactions = transactions;


            this.setState({punkt: punktArray});
            // vorsicht ganz unten ist anders, wir testen das einfach mal
            localStorage.setItem('punkt', JSON.stringify(punktArray));
        };








        updateDeptTransactions(item){
           // console.log("updateDeptTransaction: ", item);
            let date = new Date();
                    let datum =  date.toISOString().split('T')[0];




            let transactions = item.transactions;
            console.log("tl: ", transactions.length);

            for(let y = 0; y < transactions.length; y++ ){
            let borrowDate = new Date(transactions[y].date);
              let timePassedMS =  date - borrowDate;
                let payDays = Math.floor(timePassedMS / (1000 * 60 * 60 * 24));
              console.log(item.notizen, " days passed: ", payDays);
              console.log("transactions: ", transactions[y]);
              console.log(transactions[y].interestPer);
              console.log(transactions[y].interest)
               if( payDays >= transactions[y].interestPer ){
                    console.log("Zinsen");
                    let total = Number(transactions[y].dept);
                    for(let i = 0; i< payDays; i++ ){
                                 let  interest = total * (transactions[y].interest/ 100);
                                    total += interest;
                                }
                     console.log("total: ", total);
                     transactions[y].dept = total;
                     item.transactions = transactions
               }

            };
            let punkt = [...this.state.punkt];
            let i = punkt.map(a => a.itId).indexOf(item.itId);
            punkt[i] = item;
            this.setState({punkt});
        //    let cPunkt = {...punkt[id]};
        //    cPunkt =
        }







    /**
     * Updated den state wenn ein Item verschoben wird von unerledigt zu erledigt und andersherum
     * @param id
     * @param harken = ist ein todo erledigt oder nicht
     */
    updatePunktStrichDoneOrNot(id, harken) {

        console.log("harken: " + harken);
        let punkt = [...this.state.punkt];
        let indexItem = punkt.map(a => a.itId).indexOf(id);
        let punktErledigt = [...this.state.punktErledigt];
        let indexItemErledigt = punktErledigt.map(a => a.itId).indexOf(id);
        let speicher;
        if (harken) {
            speicher = punktErledigt[indexItemErledigt];
            speicher.strich = false;
            punktErledigt.splice(indexItemErledigt, 1);
            punkt.push(speicher)
        } else {
            speicher = punkt[indexItem];
            speicher.strich = true;
            punkt.splice(indexItem, 1);
            punktErledigt.push(speicher);
        }
       
        LocalStorageCalls('post', 'punkt', punkt);
        LocalStorageCalls('post', 'punktErledigt', punktErledigt);
        this.setState({punkt: punkt, punktErledigt: punktErledigt});
    }

    //Könnte es hier probleme geben wegen punkterledigt und harken? was passiert wenn harken true ist?
    auswahlTransactions(id, harken) {
            let punkt = [...this.state.punkt];
            let punktErledigt = [...this.state.punktErledigt];
                    let indexItem = punkt.map(a => a.itId).indexOf(id);
                            let indexItemErledigt = punktErledigt.map(a => a.itId).indexOf(id);
                    let speicher;
                    if (harken) {
                                speicher = punktErledigt[indexItemErledigt].transactions;
                            } else {
                               speicher = punkt[indexItem].transactions;


                            }

                    this.setState({transactions: speicher})

    }

    auswahlPayBackTransactions(id,tId,) {
                let punkt = [...this.state.punkt];
        let indexItem = punkt.map(a => a.itId).indexOf(id);
        let transactions = punkt[indexItem].transactions;
                                                //? welche id
        let indexTransaction = transactions.map( a => a.tId).indexOf(tId);
        let payBackTransactions = transactions[indexTransaction].payBackTransactions;

        this.setState({payBackTransactions: payBackTransactions});
    }

    /**
     *  Löscht alle erledigten Items / To-dos
     */
    deleteAllDoneItems() {
        LocalStorageCalls('delete')
        this.setState({punktErledigt: []});

    }

        deleateSpecificItem(id){
            // let punkt = [...this.state.punkt];
            // let indexItem = punkt.(a map=> a.itId).indexOf(id);
          const punktArray = JSON.parse(localStorage.getItem('punkt')); // get data from LS
                    let indexPunkt = punktArray.map(a => a.itId).indexOf(id);

            punktArray.splice(indexPunkt, 1); // remove the item on position 0
            localStorage.setItem('punkt', JSON.stringify(punktArray)); // save it back to LS */
            console.log("deleate Item: ", id);
            let punkt = [...this.state.punkt];
                    let indexItem = punkt.map(a => a.itId).indexOf(id);

             punkt.splice(indexItem, 1);
             this.setState({punkt: punkt});
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
                <BereichUeberschrift ueberschrift={"Transaktionen"}/>
                <ContainerListe itemList={this.state.punktErledigt}
                                updatePunkt={(id, title, harken, datum, notizen) => this.updatePunktInState(id, title, harken, datum, notizen)}
                                updateDoneOrNot={(id, harken) => this.updatePunktStrichDoneOrNot(id, harken)}/>
                <div className="d-flex flex-row justify-content-center  ">
                    <Button className=" btn-secondary btn-sm mt-4 mb-4" onClick={this.deleteAllDoneItems}>Erledigte
                        To-dos
                        löschen</Button>
                </div>

                <TransactionListe
                                 itemList={this.state.transactions}
                                 updateTransaction={(id, tId, schuldnerName,transactionNote, betrag,datum, payBackNote,strich)=> this.updateTransaction(id, tId, schuldnerName, transactionNote, betrag ,datum, payBackNote, strich)}
                                 auswahlPayBackTransactions={(id, tId) => this.auswahlPayBackTransactions(id,tId)}
                                 deleteTransaction={(id, tId)=> this.deleteTransaction(id, tId)}
                />

                <PayBackTransactionListe itemList={this.state.payBackTransactions}/>


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
