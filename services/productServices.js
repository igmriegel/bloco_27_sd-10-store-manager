const { ObjectId } = require('mongodb');

const { dbConnection } = require('../models/connection');
const model = require('../models');
const { productSchema } = require('./validationSchemas');
const { newError } = require('../utils/newError');

const validateProdDuplicity = async (cntObj, collection, searchString) => {
  const itemExists = await model.findProductByName(cntObj, collection, searchString);

  if (itemExists) throw new Error('Product already exists');
};

const validateProdSchema = (productData) => {
  const { error } = productSchema.validate(productData);

  if (error) throw new Error(error.message);
};

const createProduct = async (productData) => {
  try {
    validateProdSchema(productData);
    await validateProdDuplicity(dbConnection, 'products', productData.name);

    const data = await model.create(dbConnection, 'products', productData);
  
    return data;
  } catch (error) {
    throw newError(422, error.message, 'invalid_data');
  }
};

const validateMongoID = (productID) => {
  const validID = ObjectId.isValid(productID);
  if (!validID) throw newError(422, 'Wrong id format', 'invalid_data');
};

const getProducts = async (productID) => {
  if (!productID) {
    const productsArray = await model.getAll(dbConnection, 'products');

    return productsArray;
  }

  validateMongoID(productID);

  const product = await model.getByID(dbConnection, 'products', productID);

  return product;
};

const updateProduct = async (productID, productData) => {
  try {
    validateProdSchema(productData);
    await model.updateByID(dbConnection, 'products', productID, productData);
    const [updatedItem] = await model.getByID(dbConnection, 'products', productID);
  
    return updatedItem;
  } catch (error) {
    throw newError(422, error.message, 'invalid_data');
  }
};

const deleteProduct = async (productID) => {
  try {
    validateMongoID(productID);
    const product = await model.getByID(dbConnection, 'products', productID);

    await model.deleteByID(dbConnection, 'products', productID);

    return product;
  } catch (error) {
    throw newError(422, error.message, 'invalid_data');
  }
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
