/// <reference types="cypress" />

describe('POST /tasks', () => {

    beforeEach(function () {
        cy.fixture('tasks/post').then(function (tasks) {
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

        cy.task('removeUser', user.email)
        cy.postUser(user)

        cy.postSession(user)
            .then(userResp => {
                let token = userResp.body.token
                //cy.log(response.body.token)
                //Cypress.env('token', response.body.token)

                cy.task('removeTask', task.name, user.email)
                cy.postTask(task, token)
                    .then(response => {
                        expect(response.status).to.eq(201)
                        expect(response.body.name).to.eq(task.name)
                        expect(response.body.tags).to.eql(task.tags)
                        expect(response.body.is_done).to.be.false
                        expect(response.body.user).to.eql(userResp.body.user._id)
                        expect(response.body._id.length).to.eq(24)
                    })
            })
    })

    it('duplicate task', function () {

        const { user, task } = this.tasks.dup

        cy.task('removeUser', user.email)
        cy.postUser(user)

        cy.postSession(user)
            .then(userResp => {
                let token = userResp.body.token
                //cy.log(response.body.token)
                //Cypress.env('token', response.body.token)

                cy.task('removeTask', task.name, user.email)

                cy.postTask(task, token)
                cy.postTask(task, token)
                    .then(response => {
                        expect(response.status).to.eq(409)
                        expect(response.body.message).to.eq("Duplicated task!")
                    })
            })
    })
})