const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json());

app.use("/user", express.static(path.join(__dirname, "user")));
app.use("/delivery", express.static(path.join(__dirname, "delivery")));
app.use("/restaurant", express.static(path.join(__dirname, "restaurant")));
app.use(express.static(path.join(__dirname, "public")));

const userfile = path.join(__dirname, 'data', 'user.json');
const restaurantfile = path.join(__dirname, 'data', 'restaurant.json');
const productsfile = path.join(__dirname, 'data', 'products.json');
const orderfile = path.join(__dirname, 'data', 'order.json');

const users = JSON.parse(fs.readFileSync(userfile, 'utf8'));
const restaurants = JSON.parse(fs.readFileSync(restaurantfile, 'utf8'));
const products = JSON.parse(fs.readFileSync(productsfile, 'utf8'));
const orders = JSON.parse(fs.readFileSync(orderfile, 'utf8'));

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  
  res.json({ 
    userId: user.userId,
    role: user.role,
    storeId: user.storeId
  });
});

app.get("/api/restaurants", (req, res) => {
  res.json(restaurants);
});

app.get("/api/restaurants/:id", (req, res) => {
  const restaurant = restaurants.find(r => r.storeId === parseInt(req.params.id));
  if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });
  res.json(restaurant);
});

app.patch("/api/restaurants/:id/status", (req, res) => {
  const { status } = req.body;
  const restaurant = restaurants.find(r => r.storeId === parseInt(req.params.id));
  if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });
  
  restaurant.status = status;
  fs.writeFileSync(restaurantfile, JSON.stringify(restaurants, null, 2));
  res.json(restaurant);
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/restaurants/:id/products", (req, res) => {
  const restaurantProducts = products.filter(p => p.storeId === parseInt(req.params.id));
  res.json(restaurantProducts);
});

app.post("/api/restaurants/:id/products", (req, res) => {
  const { name, price, description, image } = req.body;
  const newProduct = {
    productId: products.length + 1,
    name,
    price,
    description,
    image,
    storeId: parseInt(req.params.id)
  };
  
  products.push(newProduct);
  fs.writeFileSync(productsfile, JSON.stringify(products, null, 2));
  res.status(201).json(newProduct);
});

app.get("/api/orders", (req, res) => {
  res.json(orders);
});

app.post("/api/orders", (req, res) => {
  const { userId, storeId, products, total, paymentMethod } = req.body;
  
  const newOrder = {
    orderId: orders.length + 1,
    userId,
    storeId,
    products,
    total,
    paymentMethod,
    status: "pending",
    riderId: null
  };
  
  orders.push(newOrder);
  fs.writeFileSync(orderfile, JSON.stringify(orders, null, 2));
  res.status(201).json(newOrder);
});

app.patch("/api/orders/:id/accept", (req, res) => {
  const { riderId } = req.body;
  const order = orders.find(o => o.orderId === parseInt(req.params.id));
  
  if (!order) return res.status(404).json({ error: "Order not found" });
  if (order.status !== "pending") return res.status(400).json({ error: "Order is not pending" });
  
  order.riderId = riderId;
  order.status = "accepted";
  fs.writeFileSync(orderfile, JSON.stringify(orders, null, 2));
  res.json(order);
});

app.get("/api/users/:id/orders", (req, res) => {
  const userOrders = orders.filter(o => o.userId === parseInt(req.params.id));
  res.json(userOrders);
});

app.get("/api/riders/:id/orders", (req, res) => {
  const riderOrders = orders.filter(o => o.riderId === parseInt(req.params.id));
  res.json(riderOrders);
});

const PORT = 5050;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
