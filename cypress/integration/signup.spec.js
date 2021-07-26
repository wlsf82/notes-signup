const faker = require('faker')

describe('Signup using cypress-mailosaur', () => {
  const emailAddress = `${faker.datatype.uuid()}@${Cypress.env('MAILOSAUR_SERVER_DOMAIN')}`
  const password = Cypress.env('PASSWORD')

  beforeEach(() => {
    cy.visit('/signup')

    cy.get('#email').type(emailAddress)
    cy.get('#password').type(password, { log: false })
    cy.get('#confirmPassword').type(password, { log: false })
    cy.contains('button', 'Signup').click()
  })

  it('successfully signs up using confirmation code sent via email', () => {
    cy.mailosaurGetMessage(Cypress.env('MAILOSAUR_SERVER_ID'), {
      sentTo: emailAddress
    }).then(message => {
      const confirmationCode = message.html.body.match(/\d{6}/)[0]

      cy.get('#confirmationCode').type(`${confirmationCode}{enter}`)

      cy.contains('.navbar-right a', 'Logout').should('be.visible')
      cy.contains('h1', 'Your Notes').should('be.visible')
    })
  })
})
