async function ok (Values, message, reply) {
  return reply
    .code(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({
      code: 200,
      Values: Values,
      message: message
    })
}

async function badRequest (Values, message, reply) {
  return reply
    .code(400)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({
      code: 400,
      Values: Values,
      message: message
    })
}

module.exports = {
  ok,
  badRequest
}
