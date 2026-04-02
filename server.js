const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 TEST
app.get("/", (req, res) => {
  res.send("Backend running");
});

/***********************
 * 🔹 OBD CALL TRIGGER
 ***********************/
app.get("/call", async (req, res) => {
  try {
    const phone = req.query.phone;

    const payload = {
      company_id: "654b627146384744",
      secret_token: "c3171f54c3b68b43eb1443d9dbf80d84988fe4e9ac1de5d6337ec73396edbe90",
      type: "2",
      number: "+91" + phone,
      public_ivr_id: "69cd73ef8f44e276",
      custom_customer_name: "Test User",
      custom_Renewal_Date: "15 April",
      Custom_Amount: "1000"
    };

    const response = await axios.post(
      "https://obd-api.myoperator.co/obd-api-v1",
      payload,
      {
        headers: {
          "x-api-key": "oomfKA3I2K6TCJYistHyb7sDf0l0F6c8AZro5DJh"
        }
      }
    );

    console.log("📞 OBD Response:", response.data);

    res.json(response.data);

  } catch (err) {
    console.log("❌ OBD Error:", err.response?.data || err.message);

    res.json({ error: "OBD failed" });
  }
});

/***********************
 * 🔹 IVR WEBHOOK
 ***********************/
app.post("/ivr", (req, res) => {
  try {
    const clid = (req.body.clid || "").slice(-10);

    const data = {
      "7827180168": {
        name: "Abhay Negi",
        renewal: "15 April",
        amount: "1000"
      },
      "775583233": {
        name: "vishal",
        renewal: "15 April",
        amount: "1000"
      },
      "6361727616": {
        name: "Vishal Anand",
        renewal: "15 April",
        amount: "2500"
      },
      "9159660127": {
        name: "Chunnu",
        renewal: "20 June",
        amount: "500"
      }
    };

    const user = data[clid];

    let message = "Customer data not found";

    if (user) {
      message = `Hi ${user.name}, your renewal date is ${user.renewal} and your amount is ${user.amount}`;
    }

    const response = {
      action: "tts",
      value: message
    };

    console.log("🔥 IVR HIT:", req.body);
    console.log("✅ RESPONSE:", response);

    res.json(response);

  } catch (err) {
    res.json({
      action: "tts",
      value: "Error occurred"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));