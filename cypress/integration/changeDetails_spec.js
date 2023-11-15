describe("changing details", () =>{
    beforeEach( ()=> {
        cy.intercept('GET' , 'http://127.0.0.1:8081/einkaufsListeElementeNotDone', [] );
        cy.intercept('GET' , 'http://127.0.0.1:8081/einkaufsListeElementeDone', [] );
        cy.intercept('POST', 'http://127.0.0.1:8081/einkaufsListe', {
            "itId": 100,
            "einkaufsPunkt": "apfel",
            "strich": false,
            "amount": 1,
        });
        cy.intercept('PUT', 'http://127.0.0.1:8081/einkaufsListeUpdateM', {});
        cy.intercept('PUT', 'http://127.0.0.1:8081/einkaufsListeDurchgestrichen', {});
         cy.intercept('DELETE', 'http://127.0.0.1:8081/einkaufssListeElementeDoneLoeschen', {});
    })
    it('changing all details', () => {

       //Links und axiosmocks
        cy.visit('http://localhost:3000/?');
        cy.findByRole('textbox').type('apfel');

        //button press
        cy.findByRole('button', {
            name: /hinzufügen/i
        }).click();

        //click bearbeitungs button
        //:nth-child(1) > .buttonHull > .bearbeitungsButton
        cy.get('.bearbeitungsButton').click();

        //get eingabe
        cy.get(':nth-child(1) > .col-9 > .form-control').clear().type('test');
        cy.get(':nth-child(2) > .col-9 > .form-control').clear().type('tolle notizen');
        cy.get(':nth-child(3) > .col-9 > .form-control').type('3');

        cy.get('.modal-footer > .btn-primary').click();

        //Expect

        cy.findByText(/test/i);
        cy.get('.punkt').should('have.text','test');
        cy.get('.punktAmount').should('have.text','13');

        //Expect Notizen
        cy.get('.bearbeitungsButton').click();
        cy.get(':nth-child(2) > .col-9 > .form-control').should('have.value', 'tolle notizen');
        cy.get('.modal-footer > .btn-primary').click();


    });

    it('should not change details when closing', ()=> {
        //bearbeiten
        cy.get('.bearbeitungsButton').click();
        //get eingabe
        cy.get(':nth-child(1) > .col-9 > .form-control').clear().type('hurra');
        //cy.get(':nth-child(2) > .col-9 > .form-control').clear().type('tolle notizen');
        cy.get(':nth-child(3) > .col-9 > .form-control').clear().type('7');

        //expect nothing to change after click on close (x-button)
        cy.get('.btn-close').click();
        cy.get('.punkt').should('have.text','test');
        cy.get('.punktAmount').should('have.text','13');
    })
    it('should not change details when canceling', () => {
        //bearbeiten
        cy.get('.bearbeitungsButton').click();
        //get eingabe
        cy.get(':nth-child(1) > .col-9 > .form-control').clear().type('hurra');
        //cy.get(':nth-child(2) > .col-9 > .form-control').clear().type('tolle notizen');
        cy.get(':nth-child(3) > .col-9 > .form-control').clear().type('7');

        //expect nothing to change after click on cancel (abbrechen button)
        cy.get('.modal-footer > .btn-secondary').click();
        cy.get('.punkt').should('have.text','test');
        cy.get('.punktAmount').should('have.text','13');
    })
    it('should not change details when shoved to ERLEDIGT and back', ()=> {
        //Expect


        cy.get('.punkt').should('have.text','test');
        cy.get('.punktAmount').should('have.text','13');

        //Expect Notizen
        cy.get('.bearbeitungsButton').click();
        cy.get(':nth-child(2) > .col-9 > .form-control').should('have.value', 'tolle notizen');
        cy.get('.modal-footer > .btn-primary').click();

        //Erledigen
        cy.get(':nth-child(1) > .card').click();
        //Erledigen überprüfen
        cy.get(':nth-child(1) > .card').should('have.class', 'cardColourGreen');
        //Unerledigen
        cy.get(':nth-child(1) > .card').click();
        //Unerledigen überprüfen
        cy.get(':nth-child(1) > .card').should('have.class', 'cardColourRed');
        //Überprüfen der werte

        //Expect

        cy.get('.punkt').should('have.text','test');
        cy.get('.punktAmount').should('have.text','13');

        //Expect Notizen
        cy.get('.bearbeitungsButton').click();
        cy.get(':nth-child(2) > .col-9 > .form-control').should('have.value', 'tolle notizen');
        cy.get('.modal-footer > .btn-primary').click();

    })
})