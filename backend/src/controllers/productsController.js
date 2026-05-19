// Creo un array de métodos
const productsController = {};

// Import el Schema de la colección que vamos a utilizar
import productsModel from "../models/products.js";

// SELECT
productsController.getProducts = async (req, res) => {
  const products = await productsModel.find();
  res.json(products);
};

// INSERT
productsController.insertProducts = async (req, res) => {
  //#1 - Solicito lo datos a guardar
  const { name, description, price, stock } = req.body;
  //#2 - Lleno una instancia de mí Schema
  const newProduct = new productsModel({ name, description, price, stock });
  //#3 - Guardo en la base de datos
  await newProduct.save();

  res.json({ message: "Product Saved" });
};

// DELETE
productsController.deleteProducts = async (req, res) => {
  await productsModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Product Deleted" });
};

// UPDATE
productsController.updateProducts = async (req, res) => {
  //#1 - Pido los nuevos datos
  const { name, description, price, stock } = req.body;
  //#2 - Actualizo los datos
  await productsModel.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      price,
      stock,
    },
    { new: true },
  ); // Sintaxis para actualizar

  res.json({ message: "Product Updated" });
};

// SELECT por ID
productsController.getProductsById = async (req, res) => {
  try {
    const product = await productsModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// SELECT de productos con stock bajo
productsController.getLowStock = async (req, res) => {
  try {
    const products = await productsModel.find({ stock: { $lt: 5 } });

    if (!products) {
      return res
        .status(404)
        .json({ message: "There are no products with low stock" });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// SELECT con filtros (rango de precios)
productsController.getProductsByPriceRange = async (req, res) => {
  try {
    // 1- Solicitar los datos
    const { min, max } = req.body;
    const products = await productsModel.find({
      price: { $gte: min, $lt: max },
    });

    if (!products) {
      return res
        .status(404)
        .json({ message: "No products within this price range" });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// COUNT cuantos elementos hay en una colección
productsController.countProducts = async (req, res) => {
  try {
    const count = await productsModel.countDocuments();

    return res.status(200).json(count);
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// SEARCH buscar por nombre
productsController.searchByName = async (req, res) => {
  try {
    // 1- Solicito los datos
    const { name } = req.body;

    const products = await productsModel.find({
      name: { $regex: name, $options: "i" },
      // regex para que el nombre coincida
      // options para que bisque por mayusculas y minusculas
    });

    if (!products) {
      return res.status(404).json({ message: "No products found" });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default productsController;