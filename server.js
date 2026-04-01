const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Health check
app.get("/", (req, res) => {
  res.send("IVR backend running");
});

// 🔹 IVR webhook
app.post("/ivr", (req, res) => {
  try {
    console.log("🔥 Incoming:", req.body);

    // IVR sends clid
    const clid = (req.body.clid || "").toString().slice(-10);

    // 🔹 TEMP: static data (later replace with DB/Sheet)
    const data = {
      "7827180168": {
        name: "Abhay Negi",
        renewal: "15 April",
        amount: "1000"
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

    console.log("✅ Response:", response);

    res.json(response);

  } catch (err) {
    console.log("❌ Error:", err);

    res.json({
      action: "tts",
      value: "Error occurred"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));