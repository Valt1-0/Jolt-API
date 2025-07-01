const Product = require("../models/productModel");
const { ValidationError, NotFoundError } = require("../utils");

exports.createProduct = async (productData) => {
  try {

    const minimumAmount = productData.currency === "eur" ? 50 : 50;
    if (productData.price < minimumAmount) {
      throw new ValidationError(
        `Le prix minimum est de ${minimumAmount / 100} ${
          productData.currency?.toUpperCase() || "EUR"
        }`
      );
    }
    // Vérifier si le produit existe déjà
    // Ajouter les features par défaut
    const defaultFeatures = {
      maxFavorites: productData.features?.maxFavorites || 2,
      maxVehicles: productData.features?.maxVehicles || 1,
      premiumSupport: productData.features?.premiumSupport || false,
      advancedAnalytics: productData.features?.advancedAnalytics || false,
    };

    // Créer le produit SEULEMENT dans notre DB
    const product = new Product({
      ...productData,
      features: defaultFeatures,
    });

    return await product.save();
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new ValidationError(
        Object.values(error.errors)
          .map((e) => e.message)
          .join(", ")
      );
    }
    throw error;
  }
};

exports.getAllProducts = async () => {
  return await Product.find({ isActive: true }).sort({ createdAt: -1 });
};

exports.getProductById = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new NotFoundError("Product not found");
  }
  return product;
};

exports.updateProduct = async (productId, updateData) => {
  const product = await Product.findByIdAndUpdate(productId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  return product;
};

exports.deleteProduct = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new NotFoundError("Product not found");
  }

  // Désactiver au lieu de supprimer
  product.isActive = false;
  await product.save();

  return product;
};
