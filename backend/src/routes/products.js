import express from "express";
import productsController from "../controllers/productsController.js";
import { validateAuthCookie } from "../middlewares/authMiddleware.js";

// Router() nos ayuda a colocar los métodos
// que tendrá el endpoint

const router = express.Router();

// Protección de rutas por método
router.route("/")
.get(validateAuthCookie(["Customer", "Admin"]), productsController.getProducts)
.post(validateAuthCookie(["Admin"]), productsController.insertProducts);

router.route("/low-stock")
.get(productsController.getLowStock);

router.route("/price-range")
.post(productsController.getProductsByPriceRange);

router.route("/count")
.get(productsController.countProducts);

router.route("/search-name")
.post(productsController.searchByName);

// Se pone hasta abajo para evitar error
router.route("/:id") //Pide el id para saber que se va a actualizar o eliminar
.put(productsController.updateProducts)
.delete(productsController.deleteProducts)
.get(productsController.getProductsById);

export default router;