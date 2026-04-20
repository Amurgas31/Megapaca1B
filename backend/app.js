import express from "express";
import productRoutes from "./src/routes/products.js";
import branchesRoutes from "./src/routes/branches.js";
import employeeRoutes from "./src/routes/employees.js";
import reviewsRoutes from "./src/routes/reviews.js";
import customerRoutes from "./src/routes/customer.js";
import registerCustomerRoutes from "./src/routes/registerCustomer.js";
import registerAdminRoutes from "./src/routes/registerAdmin.js";
import adminRoutes from "./src/routes/admins.js";
import registerEmployeeRoutes from "./src/routes/registerEmployee.js";
import loginCustomerRoutes from "./src/routes/login.js";
import logoutRoutes from "./src/routes/logout.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// Creo una constante que guarde Express
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173/", "https://localhost:5174"],
    // permitir el envió de cookies y credenciales
    credentials: true,
  }),
);

app.use(cookieParser());

//IMPORTANTE: Que acepte los json desde postman
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/registerCustomer", registerCustomerRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/registerAdmin", registerAdminRoutes);
app.use("/api/registerEmployee", registerEmployeeRoutes);
app.use("/api/login", loginCustomerRoutes);
app.use("/api/logout", logoutRoutes);

export default app;
