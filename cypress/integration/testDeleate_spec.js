describe("deleate", () => {
    beforeEach(() => {
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
    it('Test Prozess: eingabe, erledigen, löschen', () => {


        cy.visit('http://localhost:3000/?');
        //eingabe


       cy.findByRole('textbox').type('apfel');

        //button press
        cy.findByRole('button', {
            name: /hinzufügen/i
        }).click();
        //check if colour is red

        cy.get(':nth-child(1) > .card').should('have.class', 'cardColourRed');

        //erledigen
        cy.get(':nth-child(1) > .card-body').click();
        //check if colour is green (element erledigt)
        cy.get(':nth-child(1) > .card').should('have.class', 'cardColourGreen');
        //loeschen
        cy.findByRole('button', {
            name: /erledigte einkäufe löschen/i
        }).click();

        //expect missing
        cy.get(':nth-child(1) > .card-body').should('not.exist');
    });
    it('Testing eingabe mit nummer', ()=> { //Test ist nutzlos weil die nummer gemockt wird,

        cy.intercept('POST', 'http://127.0.0.1:8081/einkaufsListe', {
            "itId": 100,
            "einkaufsPunkt": "apfel",
            "strich": false,
            "amount": 6,
        });

        cy.findByRole('textbox').type(' 6');
        //button press
        cy.findByRole('button', {
            name: /hinzufügen/i
        }).click();

        cy.get('.punkt').should('have.text','apfel');
        cy.get('.punktAmount').should('have.text','6');
    })
})

