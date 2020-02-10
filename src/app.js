const express = require('express')
const path = require('path')
const hbs = require('hbs')
const mercadopago = require("mercadopago")

const app = express()
const port = process.env.PORT || 3000

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
    items: [{
        id: '1234',
        title: 'Lightweight Paper Table',
        quantity: 3,
        currency_id: 'ARS',
        unit_price: 55.41
    }],
    payer: {
        name: "Damian",
        surname: "Marino",
        email: "damian.marino@cloudgaia.com",
        phone: {
            area_code: "11",
            number: 4444 - 4444
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


app.post('/procesar-pago', (req, res) => {

    const { body } = req;



    var payment_data = {
        transaction_amount: Number(body.amount),
        token: body.token,
        description: body.description,
        installments: Number(body.installments),
        payment_method_id: body.paymentMethodId,
        payer: {
            "email": body.email
        },
        external_reference: "Reference_1234",
        metadata: {
            key1: "value1",
            key2: "value2"
        },
        statement_descriptor: "MY E-STORE",
        notification_url: "https://mercadopago-test-endpoint.free.beeceptor.com/webhooks",
        additional_info: {
            items: [
                {
                    id: "item-ID-1234",
                    title: "Title of what you are paying for",
                    picture_url: "https://www.mercadopago.com/org-img/MP3/home/logomp3.gif",
                    description: "Item description",
                    category_id: "art", // Available categories at https://api.mercadopago.com/item_categories
                    quantity: 1,
                    unit_price: 100
                }
            ],
            payer: {
                first_name: "user-name",
                last_name: "user-surname",
                registration_date: "2020-02-10T12:58:41.425-04:00",
                phone: {
                    area_code: "11",
                    number: "4444-4444"
                },
                address: {
                    zip_code: "06233-200",
                    street_name: "Av das Nacoes Unidas",
                    street_number: 3003
                }
            }
        }
    };

    /*var payment_data = {
        transaction_amount: Number(body.amount),
        token: body.token,
        description: body.description,
        installments: Number(body.installments),
        payment_method_id: body.paymentMethodId,
        issuer_id: body.issuerId,
        payer: {
            email: body.email
        }
    };*/
    // Save and posting the payment
    mercadopago.payment.save(payment_data).then(function (data) {
        console.log(data);
        res.send(data);
    }).catch(function (error) {
        console.log(error);
    });

})





app.listen(port, () => {
    console.log('Server is up on port ' + port)
})