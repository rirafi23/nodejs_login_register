let response = require('../response')
let connection = require('../connection')
let sha1 = require('sha1')
let moment = require('moment')

async function add_data (request, reply) {
  let now = moment().format('YYYY-MM-DD HH:mm:ss')
  let name_product = request.query.name_product
  let sum_product = request.query.sum_product
  let label_product = request.query.label_product
  let id_store = request.query.id_store
  let price_product = request.query.price_product
  let promo_product = request.query.promo_product
  let image_product = request.query.image_product
  let created_at = now
  let updated_at = now

  let sql = `INSERT INTO db_product(
    name_product,
    sum_product,
    label_product,
    id_store,
    price_product,
    promo_product,
    image_product,
    created_at,
    updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`

  let data = await new Promise(resolve =>
    connection.query(
      sql,
      [
        name_product,
        sum_product,
        label_product,
        id_store,
        price_product,
        promo_product,
        image_product,
        created_at,
        updated_at
      ],
      function (error, rows) {
        if (error) {
          //Check terlebih dahulu untuk data yang sudah ada.
          if (error.code === 'ER_DUP_ENTRY') {
            return response.badRequest(
              '',
              `E-mail ${name_product} telah digunakan!`,
              reply
            )
          }
          // console.log(error)
          return response.badRequest('', `${error}`, reply)
        }
        return resolve({ name_product: name_product })
      }
    )
  )

  return response.ok('', `Berhasil di tambahkan`, reply)
}

// updateProduct
async function update_data (request, reply) {
  let id = request.query.id
  let now = moment().format('YYYY-MM-DD HH:mm:ss')
  let name_product = request.query.name_product
  let sum_product = request.query.sum_product
  let label_product = request.query.label_product
  let id_store = request.query.id_store
  let price_product = request.query.price_product
  let promo_product = request.query.promo_product
  let image_product = request.query.image_product
  let created_at = now
  let updated_at = now
  let update =
    'UPDATE `db_product` SET `name_product` =' +
    "'" +
    name_product +
    "'" +
    ', `sum_product` = ' +
    "'" +
    sum_product +
    "'" +
    ', `label_product` = ' +
    "'" +
    label_product +
    "'" +
    ', `id_store` = ' +
    "'" +
    id_store +
    "'" +
    ', `price_product` = ' +
    "'" +
    price_product +
    "'" +
    ', `promo_product` = ' +
    "'" +
    promo_product +
    "'" +
    ', `image_product` = ' +
    "'" +
    image_product +
    "'" +
    ' , `created_at` = ' +
    "'" +
    created_at +
    "'" +
    ', `updated_at`= ' +
    "'" +
    updated_at +
    "'" +
    ' WHERE `db_product`.`id` = ' +
    id +
    ''
  let data = await new Promise(resolve =>
    connection.query(update, function (error, rows) {
      if (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          return response.badRequest(
            '',
            `E-mail ${name_product} telah digunakan!`,
            reply
          )
        }
        // console.log(error)
        return response.badRequest('', `${error}`, reply)
      }
      return resolve({ name_product: name_product })
    })
  )

  return response.ok(data, `Berhasil di update - ${name_product}`, reply)
}

// getdata
async function get_data (request, reply) {
  let sql = `SELECT * FROM db_product`

  let data = await new Promise(resolve =>
    connection.query(sql, function (error, rows) {
      if (error) {
        // console.log(error)
        return response.badRequest('', `${error}`, reply)
      }
      return resolve({ rows })
    })
  )

  return response.ok(data, ``, reply)
}

//delete
async function delete_data (request, reply) {
  let id = request.query.id
  let sql = 'DELETE FROM `db_product` WHERE `db_product`.`id` = ' + id + ''

  let data = await new Promise(resolve =>
    connection.query(sql, function (error, rows) {
      if (error) {
        // console.log(error)
        return response.badRequest('', `${error}`, reply)
      }
      return resolve({ rows })
    })
  )

  return response.ok('', 'data berhasil di hapus!', reply)
}

module.exports = {
  add_data,
  update_data,
  get_data,
  delete_data
}
