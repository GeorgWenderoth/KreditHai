describe('tests with already existing BackendData', ()=> {
    beforeEach( ()=> {
        cy.intercept('GET' , 'http://127.0.0.1:8081/einkaufsListeElementeNotDone', [{
            "itId": 100,
            "einkaufsPunkt": "Regenschirm",
            "strich": false,
            "amount": 1,
        },
            {
                "itId": 101,
                "einkaufsPunkt": "Trampolin",
                "strich": false,
                "amount": 2,
            }
        ] );
        cy.intercept('GET' , 'http://127.0.0.1:8081/einkaufsListeElementeDone', [{
            "itId": 102,
            "einkaufsPunkt": "Springseil",
            "strich": true,
            "amount": 3,
        }] );
        cy.intercept('POST', 'http://127.0.0.1:8081/einkaufsListe', {
            "itId": 103,
            "einkaufsPunkt": "Mango",
            "strich": false,
            "amount": 1,
        });
        cy.intercept('PUT', 'http://127.0.0.1:8081/einkaufsListeUpdateM', {});
        cy.intercept('PUT', 'http://127.0.0.1:8081/einkaufsListeDurchgestrichen', {});
        // cy.intercept('DELETE', 'http://127.0.0.1:8081/einkaufssListeElementeDoneLoeschen', {});
    })
    it('should be rendert', () => {
        //
        cy.visit('http://localhost:3000/?');
        //expect
        cy.findByText(/Regenschirm/i).parent().parent().parent().should('have.class', 'cardColourRed');
        cy.findByText(/Trampolin/i).parent().parent().parent().should('have.class', 'cardColourRed');
        cy.findByText(/Springseil/i).parent().parent().parent().should('have.class', 'cardColourGreen');
    })
    it('should add another element, without the spaces (testing submit corrector)',  () => {
        cy.findByRole('textbox').type(' Mango ');

        //button press
        cy.findByRole('button', {
            name: /hinzufügen/i
        }).click();

        //expect
        cy.findByText(/Mango/i).parent().parent().parent().should('have.class', 'cardColourRed');
    });
    it('should Move Elements between UNDONE and DONE ', () => {


        cy.findByText(/Springseil/i).parent().parent().click();
        cy.findByText(/Springseil/i).parent().parent().parent().should('have.class', 'cardColourRed');
        cy.findByText(/Trampolin/i).parent().parent().click();
        cy.findByText(/Trampolin/i).parent().parent().parent().should('have.class', 'cardColourGreen');
        cy.findByText(/Mango/i).parent().parent().click();
        cy.findByText(/Mango/i).parent().parent().parent().should('have.class', 'cardColourGreen');
       // cy.findByText(/Trampolin/i).parent().parent().click();
       // cy.findByText(/Trampolin/i).parent().parent().parent().should('have.class', 'cardColourRed');
        cy.findByText(/Regenschirm/i).parent().parent().click();
        cy.findByText(/Regenschirm/i).parent().parent().parent().should('have.class', 'cardColourGreen');
        cy.findByText(/Regenschirm/i).parent().parent().click();
        cy.findByText(/Regenschirm/i).parent().parent().parent().should('have.class', 'cardColourRed');


    })
    it("should deleate DONE elements", ()=> {
        cy.findByRole('button', {
            name: /erledigte einkäufe löschen/i
        }).click();
        //expect

        cy.get(':nth-child(5) > :nth-child(1) > .d-flex > :nth-child(1) > .card-body').should('not.exist');

        cy.get(':nth-child(5) > :nth-child(1) > .d-flex > :nth-child(2) > .card-body').should('not.exist');

    })
})