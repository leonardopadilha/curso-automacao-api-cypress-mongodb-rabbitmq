describe('POST /sessions', () => {
    it('User session', () => {
        const userData = {
            nome: "Jennifer Aniston",
            email: "jennifer@hotmail.com",
            password: "pwd123"
        }

        cy.task("deleteUser", userData.email);
        cy.postUser(userData)

        cy.postSession(userData)
            .then(response => {
                expect(response.status).to.eq(200);

                const { user, token } = response.body

                expect(user.name).to.eq(userData.nome)
                expect(user.email).to.eq(userData.email)
                expect(token).not.to.be.empty

            })
    })

    it('Invalid password', () => {
        const user = {
            email: "james1@email.com",
            password: "pwd1234"
        }

        cy.postSession(user)
        .then(response => {
            expect(response.status).to.eq(401);
        })
    })

    it('Email not found', () => {
        const user = {
            email: "404@email.com",
            password: "pwd123"
        }

        cy.postSession(user)
        .then(response => {
            expect(response.status).to.eq(401);
        })
    })
})

Cypress.Commands.add('postSession', (user) => {
    cy.api({
        url: '/sessions',
        method: 'POST',
        body: { email: user.email, password: user.password },
        failOnStatusCode: false
    }).then(response => { return response })
})