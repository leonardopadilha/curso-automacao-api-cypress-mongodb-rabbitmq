/// <reference types="cypress" />

describe('POST /tasks', () => {

    beforeEach(function () {
        cy.fixture('tasks').then(function (tasks) {
            this.tasks = tasks
        })
    })

    it.skip('login with API', function () { // it apenas para aprendizado

        const { user, task } = this.tasks.create
        
        cy.postSession(user)
            .then(response => {
                cy.log(response.body.token)
                Cypress.env('token', response.body.token)
            })
    })

    it('register a new task', function () {

        const { user, task } = this.tasks.create

        cy.task('deleteUser', user.email)
        cy.postUser(user)

        cy.postSession(user)
            .then(response => {
                let token = response.body.token
                //cy.log(response.body.token)
                //Cypress.env('token', response.body.token)

                cy.task('deleteTask', task.name, user.email)
                cy.postTask(task, token)
                    .then(response => {
                        expect(response.status).to.eq(200)
                    })
            })
    })
})