import express from 'express';
import 'dotenv/config';
import axios from 'axios';
const app = express();
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
const port = process.env.PORT || 3000;
const environment = process.env.ENVIRONMENT || 'sandbox';
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const endpoint_url =
    environment === 'sandbox'
        ? 'https://api-m.sandbox.paypal.com'
        : 'https://api-m.paypal.com';

/**
 * Creates an order and returns it as a JSON response.
 * @function
 * @name createOrder
 * @memberof module:routes
 * @param {object} req - The HTTP request object.
 * @param {object} req.body - The request body containing the order information.
 * @param {string} req.body.intent - The intent of the order.
 * @param {object} res - The HTTP response object.
 * @returns {object} The created order as a JSON response.
 * @throws {Error} If there is an error creating the order.
 */
app.post('/create_order', async (req, res) => {
    try {
        // const access_token = await get_access_token();
        // let order_data_json = {
        //     intent: req.body.intent.toUpperCase(),
        //     purchase_units: [
        //         {
        //             amount: {
        //                 currency_code: 'USD',
        //                 value: '100.00',
        //             },
        //         },
        //     ],
        // };
        // const url = `${endpoint_url}/v2/checkout/orders`;
        // const { data } = await axios.post(url, order_data_json, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Bearer ${access_token}`,
        //     },
        // });
        // console.log(data);

        const url = 'http://127.0.0.1:3001/api/checkout/OD00001';
        const requestBody = { paymentId: 'PY01' };
        const access_token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imtob2ltaW5odHJhbm5ndXllbkBnbWFpbC5jb20iLCJpYXQiOjE2OTI5NzI3NTgsImV4cCI6MTcwMDc0ODc1OH0.dap_FmSeo_cGWgAaa3N7RMPsNzVyXpbov5ZlaX174V0';
        const { data } = await axios.post(url, requestBody, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        res.send({
            id: data.paymentOrderId,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

/**
 * Completes an order and returns it as a JSON response.
 * @function
 * @name completeOrder
 * @memberof module:routes
 * @param {object} req - The HTTP request object.
 * @param {object} req.body - The request body containing the order ID and intent.
 * @param {string} req.body.order_id - The ID of the order to complete.
 * @param {string} req.body.intent - The intent of the order.
 * @param {object} res - The HTTP response object.
 * @returns {object} The completed order as a JSON response.
 * @throws {Error} If there is an error completing the order.
 */
app.post('/complete_order', async (req, res) => {
    try {
        // const access_token = await get_access_token();
        // const url = `${endpoint_url}/v2/checkout/orders/${req.body.order_id}/${req.body.intent}`;
        // const { data } = await axios.post(url, null, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Bearer ${access_token}`,
        //     },
        // });
        // res.send(data);

        const url = 'http://127.0.0.1:3001/api/checkout/notifyPaypal';
        const requestBody = {
            paymentOrderId: req.body.order_id,
            orderId: 'OD00001',
        };
        const access_token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imtob2ltaW5odHJhbm5ndXllbkBnbWFpbC5jb20iLCJpYXQiOjE2OTI5NzI3NTgsImV4cCI6MTcwMDc0ODc1OH0.dap_FmSeo_cGWgAaa3N7RMPsNzVyXpbov5ZlaX174V0';
        const { data } = await axios.post(url, requestBody, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        console.log(data);
        res.send(data);
    } catch (err) {
        console.log(err.response.data);
        err = err.response.data;
        res.status(500).send(err);
    }
});

// Helper / Utility functions

//Servers the index.html file
app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/index.html');
});
//Servers the style.css file
app.get('/style.css', (req, res) => {
    res.sendFile(process.cwd() + '/style.css');
});
//Servers the script.js file
app.get('/script.js', (req, res) => {
    res.sendFile(process.cwd() + '/script.js');
});

//PayPal Developer YouTube Video:
//How to Retrieve an API Access Token (Node.js)
//https://www.youtube.com/watch?v=HOkkbGSxmp4
const get_access_token = async () => {
    const auth = `${client_id}:${client_secret}`;
    const url = `${endpoint_url}/v1/oauth2/token`;
    const requestBody = {
        grant_type: 'client_credentials',
    };
    const configHeader = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(auth).toString('base64')}`,
        },
    };
    const { data } = await axios.post(url, requestBody, configHeader);
    return data.access_token;
};

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
