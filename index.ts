import express from "express";

const app = express();
const port = 3000;

const menu = {
  rice: 500,
  bread: 600,
  fish: 400,
};

app.use(express.urlencoded({ extended: true }));

app.post("/order", (req, res) => {
  console.log(req.body);
  const item = (req.body.item || "").toLowerCase();
  const quantity = req.body.quantity || 1;
  const pricePerItem = menu[item as keyof typeof menu] || 0;
  const total = pricePerItem * quantity;
  if (isNaN(total)) {
    res.set('Content-Type', 'text/xml');
    res.send("<Response><Message>Sorry, I don't understand. Try something like '2 rice'</Message></Response>");
  } else {
    res.set('Content-Type', 'text/xml');
    res.send("<Response><Message>You ordered " + quantity + "x" + item + ". Total: NGN" + total+"</Message></Response>");
  }
});

app.post("/whatsapp", (req, res) => {
  const text = req.body.Body || "";
  const parts = text.split(" ");
  const quantity = parts[0] || "1";
  const item = (parts[1] || "").toLowerCase();
  const pricePerItem = menu[item as keyof typeof menu] || 0;
  const total = pricePerItem * quantity;
  if (isNaN(total)) {
    res.set('Content-Type', 'text/xml');
    res.send("<Response><Message>Sorry, I don't understand. Try something like '2 rice'</Message></Response>");
  } else {
    res.set('Content-Type', 'text/xml');
    res.send("<Response><Message>You ordered " + quantity + "x" + item + ". Total: NGN" + total+"</Message></Response>");
  }
});

app.get("/", (req, res) => {
  res.send("Hello welcome to my food bot!");
});

app.listen(port, () => {
  console.log(`Sandbox listening on port ${port}`);
});
