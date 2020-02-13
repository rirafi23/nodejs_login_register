let users = require('./controller/users')
let db_product = require('./controller/db_product')

async function routes (fastify, options) {
  fastify.get('/', function (request, reply) {
    reply.send({ message: 'Hello World', code: 200 })
  })

  fastify.post('/api/users/register', users.register)
  fastify.post('/api/users/login', users.login)
  fastify.post('/api/users/auth', users.email_very)
  fastify.put('/api/users/req_auth', users.request_auth)
  fastify.put('/api/users/update', users.update_users)
  fastify.get('/api/users', users.get_users)
  fastify.put('/api/users/change_pass', users.update_pass)
  //===================================================================
  fastify.get('/api/product', db_product.get_data)
  fastify.post('/api/product/add', db_product.add_data)
  fastify.put('/api/product/update', db_product.update_data)
  fastify.delete('/api/product/delete', db_product.delete_data)
}

module.exports = routes
