// Creo un array de métodos
const productsController = {};

// Import el Schema de la colección que vamos a utilizar
import productsModel from "../models/products.js";

// SELECT
productsController.getProducts = async (req, res) => {
    const products = await productsModel.find()
    res.json(products)
};

// INSERT
productsController.insertProducts = async (req, res)=>{
    //#1 - Solicito lo datos a guardar
    const { name, description, price, stock} = req.body;
    //#2 - Lleno una instancia de mí Schema
    const newProduct = new productsModel({ name, description, price, stock })
    //#3 - Guardo en la base de datos
    await newProduct.save()

    res.json({message: "Product Saved"})
};

// DELETE
productsController.deleteProducts = async (req, res) =>{
    await productsModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Product Deleted"});
};

// UPDATE
productsController.updateProducts = async (req, res) => {
    //#1 - Pido los nuevos datos
    const {name, description, price, stock} = req.body;
    //#2 - Actualizo los datos
    await productsModel.findByIdAndUpdate(req.params.id, {
        name,
        description,
        price,
        stock
    }, {new: true}); // Sintaxis para actualizar

    res.json({message: "Product Updated"})
};

export default productsController;