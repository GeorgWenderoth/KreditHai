import React, {useEffect} from "react";
import "./App.scss";
import {Button} from "react-bootstrap";
import {ToDoHeader} from "./header/toDoHeader";
import {BereichUeberschrift} from "./ueberschrift/bereichUeberschrift";
import {ContainerListe} from "./liste/containerListe";
import {LocalStorageIdService} from "../utils/localStorageIdService";
import {LocalStorageCalls} from "../utils/localStorageCalls";
import {TransactionListe} from "./transactions/transactionListe";

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
            deptOfAllDebtorsCombined: 0,
            isUpdatingDebts: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteAllDoneItems = this.deleteAllDoneItems.bind(this);
       // this.updateInterval = this.updateInterval.bind(this);
    }

    componentDidMount() {
        console.log("start");
        this.backBoth();
       // this.updateAllDeptTransactions();
        //this.updateInterval = setInterval(this.updateAllDeptTransactions, 5000);
       // this.updateInterval = setInterval(() => this.updateAllDeptTransactions(), 15000);
       setTimeout(() => {
             this.updateAllDeptTransactions();

             // Setze den Interval, um updateAllDeptTransactions alle 5 Minuten aufzurufen
             this.updateInterval = setInterval(() => this.updateAllDeptTransactions(), 300000);
           }, 15000);
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
        dataNotDone = LocalStorageCalls('get', 'punkt');
        dataDone = LocalStorageCalls('get', 'punktErledigt');
        transactions = dataNotDone[0].transactions;
        console.log("backBoth: ", dataNotDone, dataDone);
       // console.log("backBothTransac: ", transactions);
        this.setState({punkt: dataNotDone, punktErledigt: dataDone,});
    }


    /**
     * Man die eingabe konform, speichert im state und localStorage
     * @param value = Der String der Eingegeben wurde
     */

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

            let punkt = [...this.state.punkt];
                            punkt.push(cPunkt);
              LocalStorageCalls('post', 'punkt', punkt);
            this.setState({punkt: punkt});
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


    addTransactionInState(id, title, betrag, harken, datum, notizen, interestRate, interestPer) {
           // console.log("parameter: " + id + " " + title + " " + datum + " " + notizen)
            console.log("punkt " + this.state.punkt[0]);
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
                                                   "itId": id,
                                                   "tId": tId,
                                                   "name": title,
                                                   "betrag": betrag,
                                                   "dept": Number(betrag),
                                                   "strich": harken,
                                                   "date": datum,
                                                   "notizen": notizen,
                                                   "interest": interestRate,
                                                   "interestPer": interestPer,
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
            LocalStorageCalls('post', 'punkt', punkt);
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
                                                         transactions.forEach((transaction) => {

                                                               // setting up dates and times
                                                               const borrowDate = new Date(transaction.date);
                                                               const timePassedMS = currentDate - borrowDate;
                                                               payDays = Math.floor(timePassedMS / (1000 * 60 * 60 * 24));
                                                               let transactionDept= Number(transaction.betrag);
                                                               console.log(updatedItem.notizen, " days passed: ", payDays);
                                                               //console.log("transactions: ", transaction);
                                                               console.log(transaction.interestPer);
                                                               console.log(transaction.interest);




                                                               // appliing interesst to a single transaction
                                                                // when more days have passed then agreed interesst days
                                                                        //(important here is if its empty or 0, how should the logic work? with 0 you could have one interation tho intersst mid be applied
                                                               if (payDays >= transaction.interestPer && transaction.interestPer > 0) {
                                                                    console.log("Zinsen");
                                                                    console.log("trnsaction.dept: ", transaction.dept);



                                                                    let calculatedDept = transactionDept;
                                                                    //combinedTransactionsDept = item.betrag;
                                                                      console.log("start dept: ", calculatedDept);

                                                                    // calculating the dept with interesst
                                                                    // calculating calculatedDept
                                                                    for (let i = 0; i <= payDays; i++) {
                                                                        const interest = calculatedDept * (transaction.interest / 100);
                                                                            console.log("interest: ", interest);
                                                                            console.log("curentDept(loop) before: ", calculatedDept);
                                                                        calculatedDept += interest;
                                                                            console.log("curentDept(loop): ", calculatedDept);
                                                                            console.log("test: ", payDays, " ", i);
                                                                    };

                                                                    console.log("totalDept: ", calculatedDept);
                                                                 //was soll das?
                                                              /*   if(transaction.dept < calculatedDept){
                                                                  transaction.dept = calculatedDept;
                                                                 } */
                                                                    //updating the transacton dept to the depth with interesst
                                                                    transaction.dept = calculatedDept;


                                                                    //adding the transaction dept with interesst to the overall dept
                                                                    combinedTransactionsDept += calculatedDept;
                                                                            console.log("combined Dept after update: ", combinedTransactionsDept);
                                                               } else {
                                                                    // adding transaction.dept = transactionDept ?? würde es korrigieren, allerdings könnte es in der zukunft heisen das wenn nichts berechnet wird es zurük gesetzt wird.
                                                                    transaction.dept = transactionDept;
                                                                    combinedTransactionsDept += transactionDept;
                                                               }

                                                                // add the updated transaction to the
                                                                updatedTransactions.push(transaction);
                                                                    // adding
                                                                    addingAllOriginalTransactionLendigs += Number(transaction.betrag);

                                                         });
                                                         console.log("addingAllOriginalTransactionLendigs: ", addingAllOriginalTransactionLendigs);

                                                                   //console.log( combinedTransactionsDept < item.betrag)
                                                            // If the dept has risen <
                                                               // potencial problem if transactions change without changing tzhe overall sum of the person.
                                                              if(combinedTransactionsDept !== item.betrag){
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
             // this.callState( updatedPunkt);
             } else {
             console.log("shouldBeUpdated: ", shouldBeUpdated);
             }

             };


             callState(punkt){
             this.setState({ punkt });
             }



      /*  updateAllDeptTransactions(){
            console.log("updateAllDeptTransactions");
            let punkt = [...this.state.punkt]
            console.log(punkt);
           // punkt.forEach((element) => this.updateDeptTransactions(element.itId));
           punkt.map((item) => {
          // punkt.forEach((element) => console.log(element.itId));
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
                      };
        }; */

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

        SPEICHERupdateDeptTransactions(id){
        console.log("updateDeptTransaction: ", id);
            let date = new Date();
                    let datum =  date.toISOString().split('T')[0];
            let punkt = [...this.state.punkt]
            let i = punkt.map(a => a.itId).indexOf(id);
            console.log(punkt[i])
            let cPunkt = {...punkt[id]};
            console.log(cPunkt);
            let transactions = [...cPunkt.transactions];
            for(let y = 0; y < transactions.lenght; y++ ){
              let time =  date - transactions[y].date;
              console.log("time: ", time);
              /* if( time ){

               } */
            };
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


    render() {

    let speicher = {...this.state.punkt}
    const schuldnerName = this.state.transactions > 0 ? this.state.transactions[0].name : 'Test';


        return (
            <div className="App">
                <ToDoHeader handleSubmit={(value) => this.handleSubmit(value)}/>
                <BereichUeberschrift ueberschrift={"Zu erledigende To-dos"}/>
                <ContainerListe itemList={this.state.punkt}
                                updatePunkt={(id, title, betrag, harken, datum, notizen, interestRate, interestPer) =>
                                    this.addTransactionInState(id, title, betrag, harken, datum, notizen, interestRate, interestPer)}
                                updateDoneOrNot={(id, harken) => this.auswahlTransactions(id, harken)}
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

                                <TransactionListe itemList={this.state.transactions}/>
            </div>
        )
    }
}

export default App;
