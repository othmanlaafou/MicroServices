require("dotenv").config();

const express = require('express');
const mongoose = require("mongoose");
const Order = require('./Order');

const app = express();
const port = 9000;

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((error) => {
  console.error("Failed to connect to MongoDB:", error);
});

app.post('/order', (req, res) => {
  const { customerID, bookID, initialDate, deliveryDate } = req.body;
  
  const newOrder = new Order({
    customerID: mongoose.Types.ObjectId(customerID),
    bookID: mongoose.Types.ObjectId(bookID),
    initialDate: new Date(initialDate),
    deliveryDate: deliveryDate ? new Date(deliveryDate) : null
  });

  newOrder.save()
    .then(() => {
      res.send('New order added successfully!');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Internal Server Error!');
    });
});

app.get('/orders', (req, res) => {
  Order.find()
    .then((orders) => {
      if (orders.length > 0) {
        res.json(orders);
      } else {
        res.status(404).send('Orders not found');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Internal Server Error!');
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
