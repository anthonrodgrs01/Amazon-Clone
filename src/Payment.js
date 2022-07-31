import React, { useEffect, useState } from "react";
import CheckoutProduct from "./CheckoutProduct";
import "./Payment.css";
import { useStateValue } from "./StateProvider";
import { Link, useNavigate } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "./reducer";
import axios from "./axios";
import { auth } from "./firebase";
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { async } from "@firebase/util";

function Payment() {
  const [{ basket, user }, dispatch] = useStateValue();
  const history = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState("");
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState(true);

  useEffect(() => {
    //generate the special stripe secret which allows us to charge a customer
    const getClientSecret = async () => {
      const response = await axios({
        method: "post",
        // Stripe expects the total in a currencies subunits
        url: `/payments/create?total=${getBasketTotal(basket) * 100}`,
      });
      setClientSecret(response.data.clientSecret);
    };
    getClientSecret();
  }, [basket]);

  console.log("THE SECRET IS >>>>>", clientSecret);

  const handleSubmit = async (event) => {
    //do all the fancy stripe stuff
    event.preventDefault();
    setProcessing(true);

    const payload = await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })
      .then(({ paymentIntent }) => {
        //paymentIntent = payment Confirmation
        // console.log(user);
        // db.collection("users")
        //   .doc(user?.uid)
        //   .collection("orders")
        //   .doc(paymentIntent.id)
        //   .set({
        //     basket: basket,
        //     amount: paymentIntent.amount,
        //     created: paymentIntent.created,
        //   });
        // const docRef = collection(db, "users");
        // const docRefId = getDoc(docRef);
        // const paymentRef = collection(docRefId, "orders");
        // setDoc(doc(paymentRef, paymentIntent.id), {
        //   basket: basket,
        //   amount: paymentIntent.amount,
        //   created: paymentIntent.created,
        // });

        {
          /*
          const docRef = collection(db, "users");
          const orderRef = collection(docRef, "orders").


          const docRef = doc(collection(db, "users", user?.uid));
        const newRef = doc(collection(docRef, "orders", paymentIntent?.id));
        setDoc(newRef, {
          basket: basket,
          amount: paymentIntent.amount,
          created: paymentIntent.created,
        });
        const paymentRef = doc(docRef, "orders", paymentIntent?.id);
        console.log(paymentRef);
        setDoc(paymentRef, {
          basket: basket,
          amount: paymentIntent.amount,
          created: paymentIntent.created,
        });


          const docRef = collection(db, 'users' , user?.uid);
          getDocs(docRef)
            .then((snapshots) => {

            })


          const paymentRef = await getDoc(docRef, "orders" , paymentIntent?.id)
          const docRef = await addDoc(collection(db, "cities")
          const userRef = doc(db, "users");
          const paymentRef = doc(docRef, "orders", paymentIntent.id);
            setDoc(paymentRef, {
                basket: basket,
                amount: paymentIntent.amount,
                created:    paymentIntent.created
            });
          await setDoc(doc(db, "users" , ))
          const docRef = await addDoc(collection(db, ))


          const paymentRef = doc(docRef, "orders", paymentIntent.id);
        setDoc(paymentRef, {
          basket: basket,
          amount: paymentIntent.amount,
          created: paymentIntent.created,
        });
      */
        }

        setSucceeded(true);
        setError(null);
        setProcessing(false);
        //history.replace("/orders");
        dispatch({
          type: "EMPTY_BASKET",
          user: auth,
        });
        history("/", { replace: true });
      });
  };

  const handleChange = (event) => {
    //listen for changes in the card element
    // and display any error as the customer types their card detail
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };
  return (
    <div className="payment">
      <div className="payment__container">
        <h1>
          Checkout (<Link to="/checkout">{basket?.length} Items</Link>)
        </h1>
        {/*  Payment section - delivery address */}
        {/* Payment section -  Review Items */}
        {/* Payment section - Payment Method */}

        <div className="payment__section">
          <div className="payment__title">
            <h3>Delivery Address</h3>
            <div className="payment__address">
              <p>{user?.email}</p>
              <p>123 React Lane</p>
              <p> Los Angeles, CA</p>
            </div>
          </div>
        </div>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Review Items and Delivery</h3>
          </div>
          <div className="payment__items">
            {basket.map((items) => (
              <CheckoutProduct
                id={items.id}
                title={items.title}
                image={items.image}
                price={items.price}
                rating={items.rating}
              />
            ))}
          </div>
        </div>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Payment Method</h3>
          </div>
          <div className="payment__details">
            {/* Here the stripe magic will go */}
            <form onSubmit={handleSubmit} action="">
              <CardElement onChange={handleChange} />
              <div className="payment__priceContainer">
                <CurrencyFormat
                  renderText={(value) => (
                    <>
                      <h3>Order Total: {value}</h3>
                    </>
                  )}
                  decimalScale={2}
                  value={getBasketTotal(basket)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
                <button disabled={processing || disabled || succeeded}>
                  <span>{processing ? <p>Processing</p> : "Buy now"}</span>
                </button>
              </div>

              {/* Error */}
              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
