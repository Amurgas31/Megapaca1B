import employeeModel from "../models/employees.js";

import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

import { config } from "../../config.js";

//Array de funciones
const loginEmployeeController = {};

loginEmployeeController.login = async (req, res) => {
  // 1- Solicito los datos
  const { email, password } = req.body;

  // Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Correo inválido" });
  }

  try {
    // 1 - Buscar el correo electrónico en la base de datos
    const employeeFound = await employeeModel.findOne({ email });

    // Si no existe el correo en la base de datos
    if (!employeeFound) {
      return res.status(400).json({ message: "Employee not found" });
    }

    // Verificar si el usuario está bloqueado
    if (employeeFound.timeOut && employeeFound.timeOut > Date.now()) {
      return res.status(403).json({ message: "Cuenta bloqueada" });
    }

    // Validar la contraseña
    const isMatch = await bcrypt.compare(password, employeeFound.password);

    if (!isMatch) {
      employeeFound.loginAttemps = (employeeFound.loginAttemps || 0) + 1;

      // Si llega a 5 intentos fallidos se bloquea la cuenta
      if (employeeFound.loginAttemps >= 5) {
        employeeFound.timeOut = Date.now() + 5 * 60 * 1000;
        employeeFound.loginAttemps = 0;

        await employeeFound.save();

        return res.status(403).json({
          message: "Cuenta bloqueada por multiples intentos fallidos",
        });
      }

      await employeeFound.save();

      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Resetear intentos si login correcto
    employeeFound.loginAttemps = 0;
    employeeFound.timeOut = null;

    // Generar el token
    const token = jsonwebtoken.sign(
      // 1- Que datos vamos a guardar
      { id: employeeFound._id, userType: "Employee" },
      // 2- Secret Key
      config.JWT.secret,
      // 3- En cuanto tiempo expira
      { expiresIn: "30d" },
    );

    // El token lo guardamos en una cookie
    res.cookie("authCookie", token);

    return res.status(200).json({ message: "Login exitoso" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default loginEmployeeController;
