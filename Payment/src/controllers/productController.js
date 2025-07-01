const {
  ValidationError,
  NotFoundError,
  OkSuccess,
  CreatedSuccess,
} = require("../utils");
const productService = require("../services/productService");

// Créer un nouveau produit
exports.createProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    const newProduct = await productService.createProduct(productData);

    if (!req.user && req.user.role !== "admin") {
      throw new ValidationError(
        "You do not have permission to create products."
      );
    }

    const successResponse = new CreatedSuccess(
      "Product created successfully",
      newProduct
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

// Récupérer tous les produits
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();

    const successResponse = new OkSuccess(
      "Products retrieved successfully",
      products
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

// Récupérer un produit par ID
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const successResponse = new OkSuccess(
      "Product retrieved successfully",
      product
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

// Mettre à jour un produit
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productData = req.body;

    if (!req.user && req.user.role !== "admin") {
      throw new ValidationError(
        "You do not have permission to create products."
      );
    }
    const updatedProduct = await productService.updateProduct(id, productData);

    const successResponse = new OkSuccess(
      "Product updated successfully",
      updatedProduct
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

// Supprimer un produit
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!req.user && req.user.role !== "admin") {
      throw new ValidationError(
        "You do not have permission to create products."
      );
    }
    await productService.deleteProduct(id);

    const successResponse = new OkSuccess("Product deleted successfully");
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};
