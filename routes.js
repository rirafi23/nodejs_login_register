let users = require('./controller/users')

async function routes (fastify, options) {
  fastify.get('/', function (request, reply) {
    reply.send({ message: 'Hello World', code: 200 })
  })

  fastify.post('/api/users/register', users.register)
  fastify.post('/api/users/login', users.login)
  fastify.post('/api/users/auth', users.email_very)
}

module.exports = routes
