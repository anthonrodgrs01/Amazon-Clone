const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { response, request } = require("express");
const stripe = require("stripe")(
  "sk_test_51LPkyhJIT2QH3BZdgm1NcOQWGZyNGbqhHgPIwrlawYngeJCnluAU0DolS2TSkMb7hSyIdoLhFcUp9OHVwE9AcfKU00tAOX5eLX"
);
//API

// App config
const app = express();

// Middlewares
//app.use(cors({ origin: true }));
app.use(cors());
app.use(express.json());

//API routes
app.get("/", (request, response) => response.status(200).send("hello world"));
app.post("/payments/create", async (request, response) => {
  const total = request.query.total;
  console.log("Payment Request Received BOOM!! for this amount >>>>>", total);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: total, //subunits of the currency
    currency: "usd",
  });

  //OK - created
  response.status(201).send({
    clientSecret: paymentIntent.client_secret,
  });

});
//Listen Command
exports.api = functions.https.onRequest(app);

//http://localhost:5001/clone-c44c6/us-central1/api

