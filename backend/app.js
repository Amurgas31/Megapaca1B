import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Routes
// CRUDS normalitos
import productRoutes from "./src/routes/products.js";
import branchesRoutes from "./src/routes/branches.js";
import employeeRoutes from "./src/routes/employees.js";
import reviewsRoutes from "./src/routes/reviews.js";
import customerRoutes from "./src/routes/customer.js";
import cartRoutes from "./src/routes/cart.js";
import deliveryDriversRoutes from "./src/routes/deliveryDrivers.js";
import adminRoutes from "./src/routes/admins.js";
import providerRoutes from "./src/routes/provider.js";

// Registro de usuarios
import registerCustomerRoutes from "./src/routes/registerCustomer.js";
import registerAdminRoutes from "./src/routes/registerAdmin.js";
import registerEmployeeRoutes from "./src/routes/registerEmployee.js";

// Logins
import loginCustomerRoutes from "./src/routes/loginCustomer.js";
import loginEmployeeRoutes from "./src/routes/loginEmployee.js";
import loginAdminRoutes from "./src/routes/loginAdmin.js";

// Logout
import logoutRoutes from "./src/routes/logout.js";
import recoveryPasswordRoutes from "./src/routes/recoveryPassword.js";

// Wompi (Pasarela de pagos)
import wompiRoutes from "./src/routes/wompi.js";

// Middlewares
import limiter from "./src/middlewares/limiter.js";
import { validateAuthCookie } from "./src/middlewares/authMiddleware.js";

// Documentación y libreria de Swagger
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./src/utils/planly-b2d-Megapaca-1.0-resolved.json" with {type: "json"}

// Creo una constante que guarde Express
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173/", "https://localhost:5174"],
    // permitir el envió de cookies y credenciales
    credentials: true,
  }),
);

app.use(limiter);

app.use(cookieParser());

//IMPORTANTE: Que acepte los json desde postman
app.use(express.json());

//Documentación
app.use("/apiDocs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Endpoints de CRUDS normales
app.use("/api/products", productRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/admins", validateAuthCookie(["Admin"]), adminRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/deliveryDrivers", deliveryDriversRoutes);

// Protección de rutas completa (incluye protección de todas sus subrutas)
app.use("/api/employees", validateAuthCookie(["Admin"]), employeeRoutes);

// Register de los usuarios
app.use("/api/registerCustomer", registerCustomerRoutes);
app.use("/api/registerAdmin", registerAdminRoutes);
app.use("/api/registerEmployee", validateAuthCookie(["Admin"]), registerEmployeeRoutes);

// Login
app.use("/api/loginCustomer", loginCustomerRoutes);
app.use("/api/loginEmployee", loginEmployeeRoutes);
app.use("/api/loginAdmin", loginAdminRoutes);

// Logout
app.use("/api/logout", validateAuthCookie(["Customer", "Admin", "Employee"]), logoutRoutes);

// Recovery
app.use("/api/recoveryPassword", recoveryPasswordRoutes);

// Wompi
app.use("/api/wompi", validateAuthCookie(["Customer", "Admin", "Employee"]),  wompiRoutes);

export default app;
