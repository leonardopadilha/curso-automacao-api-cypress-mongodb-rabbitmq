/// <reference types="cypress" />

describe('POST /tasks - Queue', () => {

    beforeEach(function () {
        cy.fixture('tasks/post').then(function (tasks) {
            this.tasks = tasks
        })
    })

    context('register a new task and verify on rabbitMQ', function () {
        before(function() {
            // purge
            cy.wait(3000) // thinking time
            cy.purgeQueueMessages()
                .then(response => {
                    expect(response.status).to.equal(204)
                })
        })

        it('post new task with success', function () {

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

        after(function() {
            // get message
            const { user, task } = this.tasks.create
            cy.wait(3000) // thinking time
            cy.getMessageQueue()
                .then(response => {
                    expect(response.status).to.eq(200)
                    //cy.log(JSON.stringify(response.body[0].payload))
                    expect(response.body[0].payload).to.include(user.name.split(' ')[0])
                    expect(response.body[0].payload).to.include(task.name)
                    expect(response.body[0].payload).to.include(user.email)
                })
        })
    })
})