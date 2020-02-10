const express = require('express')
const path = require('path')
const hbs = require('hbs')
const mercadopago = require("mercadopago")

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')


// Setup handlerbars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))


app.get('', (req, res) => {
  res.render('index', {
      title: 'MercadoPago',
      name: 'Damian'
  })
})


mercadopago.configure({
  sandbox: true,
  access_token: 'TEST-3591392103188253-012114-2bec3c587864e834e8c8e35af5ce5f1e-516828283'
});



// Crea un objeto de preferencia
let preference = {
  items: [
    {
      id: '1234',
      title: 'Lightweight Paper Table',
      quantity: 3,
      currency_id: 'ARS',
      unit_price: 55.41
    }
  ],
    payer: {
    name: "Damian",
    surname: "Marino",
    email: "damian.marino@cloudgaia.com",
    phone: {
        area_code: "11",
        number: 4444-4444
    },
    identification: {
        type: "DNI",
        number: "12345678"
    },
    address: {
        street_name: "Street",
        street_number: 123,
        zip_code: "5700"
    }
},
  back_urls: {
    success: 'http://localhost:3000/',
    failure: 'http://localhost:3000/',
    pending: 'http://localhost:3000/'
  },
  auto_return: "approved"
};


app.post('/tokenize', (req, res) => {
  
  console.log('Request', req.form)



})

app.get('/procesar-pago', (req, res) => {
  
  mercadopago.preferences.create(preference)
    .then(function(response){
      global.init_point = response.body.init_point;
      res.redirect(global.init_point)
    }).catch(function(error){
      console.log(error);
  });


})





app.listen(port, () => {
  console.log('Server is up on port ' + port)
})