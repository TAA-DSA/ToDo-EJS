const express = require("express");
const app = express();
const cors = require("cors");
let ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { dirname } = require("path");
const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
});

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

let items = ["Buy Food", "Eat Food", "Get Food"];
let workItems = [];

const item1 = new Item({
  name: "Welcome to your todolist!",
});

const item2 = new Item({
  name: "Hit the + button to add a new item.",
});

const item3 = new Item({
  name: "<-- Hit this to delete an item.",
});

const defaultItem = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

// Item.insertMany(defaultItem, (err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Successfully updated default item in DB");
//   }
// });

app.get("/", (req, res) => {
  //let today = new Date();

  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItem, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully updated default item in DB");
        }
      });
    } else {
      res.render("list", { listTitle: "Today", newListItem: foundItems });
    }
  });

  //let day = today.toLocaleDateString("en-US", options);
});

app.post("/", (req, res) => {
  let itemName = req.body.newItem;

  const item = new Item({
    name: itemName,
  });

  item.save();

  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully deleted !!");
    }
    res.redirect("/");
  });
});

app.get("/:paramName", (req, res) => {
  const customListName = req.params.paramName;

  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItem,
        });
        list.save();
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItem: foundList.items,
        });
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server 🚀 starting on port ${PORT}`);
});
