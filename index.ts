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

const sessions:Record<string, any> = {};
app.post("/whatsapp", (req, res) => {
  const phone = req.body.From || "";
  const text = req.body.Body || "";
  
  if (!sessions[phone]) {
    sessions[phone] ={step:"welcome"}
  };                 
    const session=sessions[phone];

  const greeting=text.toLowerCase().trim();
  if (greeting=="hi" || greeting=="hey" || greeting == "what's up" || greeting== "menu" || greeting== "hello"){
    session.step= "welcome";
  };
  res.set('Content-Type','Text/XML');
  if ( session.step== "welcome"){
    session.step="ordering";
    res.send("<Response><Message> Welcome to Ellas shop 😁 what is your order </Message></Response>");
  }else if (session.step=="ordering"){
  const parts = text.split(" ");
  const quantity = parts[0] || "1";
  const item = (parts[1] || "").toLowerCase();
  const pricePerItem = menu[item as keyof typeof menu] || 0;

    if(!pricePerItem){
      res.send("<Response><Message>Sorry, I don't understand.try something like this 2 rice</Message></Response>);
        return ;
    };
  const total = pricePerItem * quantity;
  if (isNaN(total)) {
    res.send("<Response><Message>Sorry, I don't understand. Try something like '2 rice'</Message></Response>");
  } else {
    res.set('Content-Type', 'text/xml');
    res.send("<Response><Message>You ordered " + quantity  +  " x "  +  item + ". Total: NGN" + total+"</Message></Response>");
  }
  }
});

app.get("/", (req, res) => {
  res.send("Hello welcome to my food bot!");
});

app.listen(port, () => {
  console.log(`Sandbox listening on port ${port}`);
});
