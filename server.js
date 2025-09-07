const { log } = require("console")
const express = require("express")
const path = require("path")

const app = express()

app.use(express.json())
app.use("/user", express.static(path.join(__dirname, "user")))
app.use("/delivery", express.static(path.join(__dirname, "delivery")))
app.use("/store", express.static(path.join(__dirname, "store")))

let users = []

app.get("/users", (req, res) => { 
  res.status(200).send(users)
})

app.use(express.static(path.join(__dirname, "public")))

app.get("/", express.static(path.join(__dirname, "public")))

app.listen(5050)
console.log("localhost en el puerto: http://localhost:5050");
