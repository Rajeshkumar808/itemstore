async function createItem(req, res) {
  try {
    await connectDB();

    console.log("MongoDB connected. Creating item...");
    console.log("Request body:", req.body);

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

    console.log("Item created successfully:", item._id);

    return res.status(201).json({
      success: true,
      message: "Item added successfully.",
      item
    });

  } catch (error) {
    console.error("CREATE ITEM ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to add item.",
      error: error.message
    });
  }
}
