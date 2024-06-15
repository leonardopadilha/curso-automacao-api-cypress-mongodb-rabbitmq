/// <reference types="cypress" />

describe('POST //sessions', () => {

    it('User session - cy.fixture', () => {

        cy.fixture('users').then(function(users) {
            const userData = users.login
            
            cy.task("deleteUser", userData.email);
            cy.postUser(userData)
    
            cy.postSession(userData)
                .then(response => {
                    expect(response.status).to.eq(200);
    
                    const { user, token } = response.body
    
                    expect(user.name).to.eq(userData.name)
                    expect(user.email).to.eq(userData.email)
                    expect(token).not.to.be.empty
    
                })
        })
    })
})