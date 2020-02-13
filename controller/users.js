let response = require('../response')
let connection = require('../connection')
let sha1 = require('sha1')
let moment = require('moment')
let crypto = require('crypto')
let nodemailer = require('nodemailer')

//register
async function register (request, reply) {
  let now = moment()
    .format('YYYY-MM-DD HH:mm:ss')
    .toString()
  let name = request.query.name
  let email = request.query.email
  let password = sha1(request.query.password)
  let token = crypto.randomBytes(32).toString('hex')
  let email_very = crypto.randomBytes(3).toString('hex')
  let created_at = now
  let updated_at = now

  let sql = `INSERT INTO users (name, email, password, email_very, remember_token, created_at, updated_at)
      values(?, ?, ?, ?, ?, ?,?)`

  let data = await new Promise(resolve =>
    connection.query(
      sql,
      [name, email, password, email_very, token, created_at, updated_at],
      function (error, rows) {
        if (error) {
          //Check terlebih dahulu untuk data yang sudah ada.
          if (error.code === 'ER_DUP_ENTRY') {
            return response.badRequest(
              '',
              `E-mail ${email} telah digunakan!`,
              reply
            )
          }
          // console.log(error)
          return response.badRequest('', `${error}`, reply)
        }
        // sendEmail

        return resolve({ name: name, email: email, token: token })
      }
    )
  )

  return response.ok(data, `Berhasil registrasi pengguna baru - ${name}`, reply)
}

//login
async function login (request, reply) {
  let email = request.query.email
  let password = request.query.password
  let sql = `SELECT * FROM users WHERE email = ?`

  let data = await new Promise(resolve =>
    connection.query(sql, [email], function (error, rows) {
      if (error) {
        // console.log(error)
        return response.badRequest('', `${error}`, reply)
      }

      if (rows.length > 0) {
        let verify = sha1(password) === rows[0].password

        let data = {
          id: rows[0].id,
          name: rows[0].name,
          email: rows[0].email,
          token: rows[0].remember_token
        }

        return verify ? resolve(data) : resolve(false)
      } else {
        return resolve(false)
      }
    })
  )

  if (!data) {
    return response.badRequest(
      '',
      'Email atau password yang anda masukkan salah!',
      reply
    )
  }
  return response.ok(data, `Berhasil login!`, reply)
}

//emailAuth
async function email_very (request, reply) {
  let email_very = request.query.email_very
  let sql = `SELECT * FROM users WHERE email_very = ?`

  let data = await new Promise(resolve =>
    connection.query(sql, [email_very], function (error, rows) {
      if (error) {
        // console.log(error)
        return response.badRequest('', `${error}`, reply)
      }

      if (rows.length > 0) {
        let verify = email_very === rows[0].email_very
        let data = {
          id: rows[0].id,
          name: rows[0].name,
          email: rows[0].email,
          token: rows[0].remember_token
        }

        return verify ? resolve(data) : resolve(false)
      } else {
        return resolve(false)
      }
    })
  )

  if (!data) {
    return response.badRequest('', 'code yang anda masukkan salah!', reply)
  }
  return response.ok(data, `Berhasil login!`, reply)
}

//requestAuth
async function request_auth (request, reply) {
  let email_very = crypto.randomBytes(3).toString('hex')
  let id = request.query.id
  let update =
    'UPDATE `users` SET `email_very` = ' +
    "'" +
    email_very +
    "'" +
    ' WHERE `users`.`id` = ' +
    id +
    ''
  let data = await new Promise(resolve =>
    connection.query(update, function (error, rows) {
      if (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          return response.badRequest('', 'gagal update profile', reply)
        }
        console.log(error)
        return response.badRequest('', `${error}`, reply)
      }
      return resolve({ id: id, email_very: email_very })
    })
  )
  return response.ok(data, `Berhasil di update - ${id}`, reply)
}

// updateUser
async function update_users (request, reply) {
  console.log(request)
  let now = moment()
    .format('YYYY-MM-DD HH:mm:ss')
    .toString()
  let name = request.query.name
  let email = request.query.email
  let updated_at = now
  let id = request.query.id

  let sql =
    'UPDATE `users` SET `name` = ' +
    "'" +
    name +
    "'" +
    ', `email` = ' +
    "'" +
    email +
    "'" +
    ' WHERE `users`.`id` = ' +
    id +
    ''
  // "UPDATE `users` SET `name` = 'rizqan', `email` = 'calonapt@gmail.com' WHERE `users`.`id` = 1"
  let data = await new Promise(resolve => {
    connection.query(sql, function (error, rows) {
      if (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          return response.badRequest('', 'gagal update profile', reply)
        }
        // console.log(error)
        return response.badRequest('', `${error}`, reply)
      }
      return resolve({ name: name, email: email })
    })
  })
  return response.ok(data, `Berhasil di update - ${name}`, reply)
}

// updatePass
async function update_pass (request, reply) {
  let now = moment()
    .format('YYYY-MM-DD HH:mm:ss')
    .toString()
  let password = sha1(request.query.password)
  let updated_at = now
  let id = request.query.id

  let sql =
    'UPDATE `users` SET `password` = ' +
    "'" +
    password +
    "'" +
    ', `updated_at` = ' +
    "'" +
    updated_at +
    "'" +
    ' WHERE `users`.`id` = ' +
    id +
    ''

  let data = await new Promise(resolve => {
    connection.query(sql, function (error, rows) {
      if (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          return response.badRequest('', 'gagal update profile', reply)
        }
        // console.log(error)
        return response.badRequest('', `${error}`, reply)
      }
      return resolve({ id:id })
    })
  })
  return response.ok(data, `Berhasil di update - ${id}`, reply)
}
// getUser
async function get_users (request, reply) {
  let sql = `SELECT * FROM users`
  let data = await new Promise(resolve => {
    connection.query(sql, function (error, rows) {
      if (error) {
        // console.log(error)
        return response.badRequest('', `${error}`, reply)
      }
      return resolve({ rows })
    })
  })
  return response.ok(data, '', reply)
}

module.exports = {
  register,
  login,
  email_very,
  update_users,
  get_users,
  update_pass,
  request_auth
}
