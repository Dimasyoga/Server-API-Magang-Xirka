const path = require('path');
const config = require(path.join(__dirname,'..','config'));
const Pool = require('pg').Pool

const pool = new Pool({
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.port,
  max: config.max,
  idleTimeoutMillis: config.idleTimeoutMillis
})

function isNumeric(num){
  return !isNaN(num)
}

function removeSpace(str){
  return str.replace(/\s+/g, '')
}

const direct_getCard = (request, response) => {

  pool.query('SELECT * FROM card ORDER BY card_id ASC', (error, results) => {
    if (error) {
      console.log('getCard failed')
    }
    else{
      response.render('view', {data : results.rows});
    }
  })
}

const direct_createCard = (request, response) => {
  var { card_id, nim, name, instansi } = request.body

  card_id = removeSpace(card_id)
  nim = removeSpace(nim)

  if(isNumeric(card_id) && (isNumeric(nim))){
    pool.query('INSERT INTO card (card_id, nim, name, instansi) VALUES ($1, $2, $3, $4)', [card_id, nim, name, instansi], (error, results) => {
      if (error) {
        console.log('createCard failed')
      }
      else{
        response.status(200).send({"redirect":true,"redirect_url":"http://192.168.2.7:3000/view"})
      }
    })
  }else{
    console.log('createCard failed, not a number')
  }
}

const direct_deleteCard = (request, response) => {
  var id = removeSpace(request.body.card_id)

  pool.query('DELETE FROM card WHERE card_id = $1', [id], (error, results) => {
    if (error) {
      console.log('deleteCard failed')
    }
    else{
      response.status(200).send({"redirect":true,"redirect_url":"http://192.168.2.7:3000/view"})
    }
  })
}

const getCard = (request, response) => {
  pool.query('SELECT * FROM card ORDER BY card_id ASC', (error, results) => {
    if (error) {
      response.status(400).send('Failed to GET')
      console.log('getCard failed')
    }
    else{
      response.status(200).json(results.rows)
    }
  })
}

const getTerminal = (request, response) => {
  pool.query('SELECT * FROM terminal ORDER BY terminal_id ASC', (error, results) => {
    if (error) {
      response.status(400).send('Failed to GET')
      console.log('getTerminal failed')
    }
    else{
      response.status(200).json(results.rows)
    }
  })
}

const getCardById = (request, response) => {
  var id = removeSpace(request.params.id)

  if (isNumeric(id)){
    pool.query('SELECT * FROM card WHERE card_id = $1', [id], (error, results) => {
      if (error) {
        response.status(400).send('Failed to GET by ID')
        console.log('getCardById failed')
      }
      else{
        response.status(200).json(results.rows)
      }
    })
  }else{
    response.status(400).send('Failed to GET by ID, ID is not a number')
  }
}

const getTerminalById = (request, response) => {
  var id = removeSpace(request.params.id)

  if (isNumeric(id)){
    pool.query('SELECT * FROM terminal WHERE terminal_id = $1', [id], (error, results) => {
      if (error) {
        response.status(400).send('Failed to GET by ID')
        console.log('getTerminalById failed')
      }
      else{
        response.status(200).json(results.rows)
      }
    })
  }else{
    response.status(400).send('Failed to GET by ID, ID is not a number')
  }
}

const createCard = (request, response) => {
  var { card_id, nim, name, instansi } = request.body

  card_id = removeSpace(card_id)
  nim = removeSpace(nim)

  if(isNumeric(card_id) && isNumeric(nim)){
    pool.query('INSERT INTO card (card_id, nim, name, instansi) VALUES ($1, $2, $3, $4)', [card_id, nim, name, instansi], (error, results) => {
      if (error) {
        response.status(400).send('Failed to create')
        console.log('createCard failed')
      }
      else{
        response.status(201).send('Card Added')
      }
    })
  }else{
    response.status(400).send('Failed to create card, card id or nim is not a number')
  }
}

const createTerminal = (request, response) => {
  var { terminal_id, room, instansi } = request.body

  terminal_id = removeSpace(terminal_id)

  if(isNumeric(terminal_id)){
    pool.query('INSERT INTO terminal (terminal_id, room, instansi) VALUES ($1, $2, $3)',
    [terminal_id, room, instansi], (error, results) => {
    if (error) {
      response.status(400).send('Failed to create')
      console.log('createTerminal failed')
    }
    else{
      response.status(201).send(`Room added`)
    }
  })
  }else{
    response.status(400).send('Failed to create terminal, terminal id or nim is not a number')
  }
}

const updateCard = (request, response) => {
  var id = removeSpace(request.params.id)
  var { nim, name, instansi } = request.body

  nim = removeSpace(nim)

  if (isNumeric(id) && isNumeric(nim)){
    pool.query(
      'UPDATE card set nim=($1), name=($2), instansi=($3) WHERE card_id=($4)',
      [nim, name, instansi, id],
      (error, results) => {
        if (error) {
          response.status(400).send('Failed to update')
          console.log('updateCard failed')
        }
        else{
            response.status(200).send(`Card modified with ID: ${id}`)
        }
      }
    )
  }else{
    response.status(400).send('Failed to update card, card id or nim is not a number')
  }
}

const updateTerminal = (request, response) => {
  var id = removeSpace(request.params.id)
  var { room, instansi } = request.body

  if (isNumeric(id)){
    pool.query(
      'UPDATE terminal SET room = ($1), instansi = ($2) WHERE terminal_id = ($3)',
      [room, instansi, id],
      (error, results) => {
        if (error) {
          response.status(400).send('Failed to update')
          console.log('updateTerminal failed')
        }
        else{
          response.status(200).send(`Room modified with ID: ${id}`)
        }
      }
    )
  }else{
    response.status(400).send('Failed to update terminal, terminal id or nim is not a number')
  }
}

const deleteCard = (request, response) => {
  var id = removeSpace(request.params.id)

  if (isNumeric(id)){
    pool.query('DELETE FROM card WHERE card_id = $1', [id], (error, results) => {
      if (error) {
        response.status(400).send('Failed to delete')
        console.log('deleteCard failed')
      }
      else{
        response.status(200).send(`Card deleted with ID: ${id}`)
      }
    })
  }else{
    response.status(400).send('Failed to delete card, card id is not a number')
  }
}

const deleteTerminal = (request, response) => {
  var id = removeSpace(request.params.id)

  if (isNumeric(id)){
    pool.query('DELETE FROM terminal WHERE terminal_id = $1', [id], (error, results) => {
      if (error) {
        response.status(400).send('Failed to delete')
        console.log('deleteTerminal failed')
      }
      else{
        response.status(200).send(`Room deleted with ID: ${id}`)
      }
    })
  }else{
    response.status(400).send('Failed to delete terminal, terminal id is not a number')
  }
}

module.exports = {
  getCard,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
  getTerminal,
  getTerminalById,
  createTerminal,
  updateTerminal,
  deleteTerminal,
  direct_getCard,
  direct_createCard,
  direct_deleteCard
}
