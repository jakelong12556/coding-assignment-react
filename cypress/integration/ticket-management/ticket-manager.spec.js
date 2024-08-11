/// <reference types="cypress" />
// import appStyles from '../../../client/src/app/app.module.css'

describe('ticket management system', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/');
    cy.wait(2000);
  });

    //tests tab switching functionality
    it('displays the sidebar and highlights ticket link element', () => {
      cy.get(getTestElement('sidebar'));
      cy.get(getTestElement('sidebar-link'))
        .get('.active p')
        .should('have.text', 'Tickets');
    });

    it('can switch to user tab', () => {
      cy.get(getTestElement('sidebar-link'))
        .get('div p')
        .contains('Users')
        .click();
      cy.get(getTestElement('sidebar-link'))
        .get('.active p')
        .should('have.text', 'Users');
    });

    //test ticket table element
    it('displays at least two tickets by default', () => {
      cy.get(getTestElement('tickets'));
      cy.get('div.MuiDataGrid-row').should('have.length.above', 2);
    });

    //get the current number of tickets,
    //add a new ticket and check if the number
    //of tickets has increased by 1
    it('can add a new ticket', () => {
      cy.get('p.MuiTablePagination-displayedRows')
        .invoke('text')
        .then((text) => {
          const currentTickets = parseInt(text.split(' ').at(-1));
          cy.get(getTestElement('new-ticket')).should('be.visible').click();
          cy.get(getTestElement('description-field'))
            .should('be.visible')
            .type('Test Description');
          cy.get(getTestElement('submit-new-ticket')).click();
          cy.wait(5000);
          cy.get('p.MuiTablePagination-displayedRows')
            .invoke('text')
            .then((newTicket) => {
              expect(parseInt(newTicket.split(' ').at(-1))).to.eq(
                currentTickets + 1
              );
            });
        });
    });

  it('can assign a ticket to a user', () => {
    //assign to unassigned as baseline
    cy.get(getTestElement('assignee-selector'))
      .first()
      .should('be.visible')
      .click();
    cy.get('ul.MuiMenu-list').should('be.visible');
    cy.get(getTestElement('assignee-unselected-option'))
      .should('be.visible')
      .click();
    cy.get('ul.MuiMenu-list').should('not.exist');
    cy.wait(3000);
    cy.get(`${getTestElement('assignee-selector')} div`)
      .first()
      .should('have.text', 'Unassigned');

    //assign to user Alice
    cy.get(getTestElement('assignee-selector'))
      .first()
      .should('be.visible')
      .click();
    cy.get('ul.MuiMenu-list').should('be.visible');
    cy.get(getTestElement('assignee-option'))
      .first()
      .should('be.visible')
      .click();
    cy.get('ul.MuiMenu-list').should('not.exist');
    cy.wait(3000);
    cy.get(`${getTestElement('assignee-selector')} div`)
      .first()
      .should('have.text', 'Alice');

    //assign to user Bob from Alice
    cy.get(getTestElement('assignee-selector'))
      .first()
      .should('be.visible')
      .click();
    cy.get('ul.MuiMenu-list').should('be.visible');
    cy.get(getTestElement('assignee-option'))
      .eq(1)
      .should('be.visible')
      .click();
    cy.get('ul.MuiMenu-list').should('not.exist');
    cy.wait(3000);
    cy.get(`${getTestElement('assignee-selector')} div`)
      .first()
      .should('have.text', 'Bob');
  });
});

function getTestElement(selector) {
  return `[data-test-id="${selector}"]`;
}
