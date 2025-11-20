import product from "../model/product.js"; 
import { isAdmin } from "./userController.js";

export async function getProducts(req, res) {
  try {
    if (isAdmin(req)) {
      const products = await product.find();
      res.json(products);
    } else {
      const products = await product.find({ isAvailable: true });
      res.json(products);
    }
  } catch (err) {
    res.json({ message: "Failed to get products", error: err.message });
  }
}

// Save Product
export function saveProduct(req, res) {
  if (!isAdmin(req)) {
    return res
      .status(403)
      .json({ message: "Only admin can create product" });
  }

  const newProduct = new product(req.body);

  newProduct
    .save()
    .then(() => res.json({ message: "Product created successfully" }))
    .catch((err) => res.json({ message: "Error creating product", error: err }));
}

// Delete Product
export async function deleteProduct(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Only admin can delete product" });
  }

  try {
    await product.deleteOne({ productId: req.body.productId });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err });
  }
}

// Update Product
export async function updateProduct(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Only admin can update product" });
  }

  const productId = req.params.productId;
  const updatingData = req.body;

  try {
    await product.updateOne({ productId }, updatingData);
    res.json({ message: "Product updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server Error", error: err });
  }
}

// Get Product By ID (FIXED)
export async function getProductById(req, res) {
  const productId = req.params.productId;

  try {
    const productData = await product.findOne({ productId: productId });

    if (!productData) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (productData.isAvailable) {
      return res.json(productData);
    }

    if (!isAdmin(req)) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(productData);

  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
}
