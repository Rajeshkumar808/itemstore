
const mongoose = require("mongoose");
const Item = require("../models/Item");
const connectDB = require("../config/db");

// GET: Fetch all items
async function getItems(req, res) {
  try {
    await connectDB();

    const search = (req.query.search || "").trim();

    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } }
          ]
        }
      : {};

    const items = await Item.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      items
    });

  } catch (error) {
    console.error("GET ITEMS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch items. Check the database connection."
    });
  }
}

// POST: Create a new item
async function createItem(req, res) {
  try {
    await connectDB();

    const { name, quantity, category } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter an item name."
      });
    }

    if (
      quantity === undefined ||
      quantity === "" ||
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a whole number greater than or equal to zero."
      });
    }

    const item = await Item.create({
      name: name.trim(),
      quantity: Number(quantity),
      category:
        typeof category === "string" && category.trim()
          ? category.trim()
          : "General"
    });

    return res.status(201).json({
      success: true,
      message: "Item added successfully.",
      item
    });

  } catch (error) {
    console.error("CREATE ITEM ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to add item."
    });
  }
}

// PUT: Update an existing item
async function updateItem(req, res) {
  try {
    await connectDB();

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid item ID."
      });
    }

    const { name, quantity, category } = req.body;
    const updates = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Item name cannot be empty."
        });
      }

      updates.name = name.trim();
    }

    if (quantity !== undefined) {
      if (
        quantity === "" ||
        !Number.isInteger(Number(quantity)) ||
        Number(quantity) < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be a whole number greater than or equal to zero."
        });
      }

      updates.quantity = Number(quantity);
    }

    if (category !== undefined) {
      if (typeof category !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid category."
        });
      }

      updates.category = category.trim() || "General";
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update."
      });
    }

    const item = await Item.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item updated successfully.",
      item
    });

  } catch (error) {
    console.error("UPDATE ITEM ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update item."
    });
  }
}

// DELETE: Delete an item
async function deleteItem(req, res) {
  try {
    await connectDB();

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid item ID."
      });
    }

    const item = await Item.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully."
    });

  } catch (error) {
    console.error("DELETE ITEM ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete item."
    });
  }
}

// Export all controller functions
module.exports = {
  getItems,
  createItem,
  updateItem,
  deleteItem
};
