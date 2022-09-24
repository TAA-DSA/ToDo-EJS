const express = require("express");
const app = express();
const cors = require("cors");
let ejs = require("ejs");
const bodyParser = require("body-parser");
const { dirname } = require("path");
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

let items = ["Buy Food", "Eat Food", "Get Food"];
let workItems = [];

app.get("/", (req, res) => {
  let today = new Date();

  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  let day = today.toLocaleDateString("en-US", options);

  res.render("list", { listTitle: day, newListItem: items });
});

app.post("/", (req, res) => {
  let item = req.body.newItem;
  if (req.body.list === "Work List") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work List", newListItem: workItems });
});

app.listen(PORT, () => {
  console.log(`Server 🚀 starting on port ${PORT}`);
});
