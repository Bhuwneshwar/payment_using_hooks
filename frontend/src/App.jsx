import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";

function App() {
  const [count, setCount] = useState(0);
  const Stripe = async () => {
    console.log("Stripe");
  };
  const Razorpay = async () => {
    try {
      const { data } = await axios.get("/api/razorpay");
      console.log(data);

      const { success, key, name, email, contact, order } = data;
      if (success) {
        const options = {
          key, // Enter the Key ID generated from the Dashboard
          amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: "INR",
          name: "RebyB Fund 5",
          description: "Test Transaction",
          image: "https://example.com/your_logo",
          order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          //callback_url: "/api/payment/verification",
          handler: function (response) {
            //alert(response.razorpay_payment_id);
            //alert(response.razorpay_order_id);
            //alert(response.razorpay_signature);
            console.log(response);
          },
          prefill: {
            name,
            email,
            contact,
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        };
        const razor = new window.Razorpay(options);
        razor.open();

        razor.on("payment.failed", function (response) {
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
        });
      } else {
        console.log(res);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={Razorpay}>Pay With Razorpay </button>
        <button onClick={Stripe}>Pay With Stripe</button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
