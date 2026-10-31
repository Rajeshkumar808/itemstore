
const express = require("express");
const router = express.Router();

const {
  getItems,
  createItem,
  updateItem,
  deleteItem
} = require("../controllers/itemController");

// GET all items
router.get("/items", getItems);

// POST create item
router.post("/items", createItem);

// PUT update item
router.put("/items/:id", updateItem);

// DELETE item
router.delete("/items/:id", deleteItem);

module.exports = router;
