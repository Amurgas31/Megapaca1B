import employeeModel from "../models/employees.js";

// Array de funciones
const employeeController = {};

// SELECT
employeeController.getEmployee = async (req, res) => {
  try {
    const employees = await employeeModel.find();
    return res.status(200).json(employees);
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE
employeeController.updateEmployee = async (req, res) => {
  try {
    // 1- Solicitamos los nuevos datos
    let {
      name,
      lastName,
      salary,
      DUI,
      phone,
      email,
      password,
      idBranches,
      isVerified,
      loginAttemps,
      timeOut,
    } = req.body;

    // Validaciones
    name = name?.trim();
    email = email?.trim();

    // Valores requeridos
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Fields required" });
    }

    const employeeUpdated = await employeeModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        lastName,
        salary,
        DUI,
        phone,
        email,
        password,
        idBranches,
        isVerified,
      },
      { new: true },
    );

    if (!employeeUpdated) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({ message: "Employee Updated" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE
employeeController.deleteEmployee = async (res, req) => {
  try {
    const deleteEmployee = employeeModel.findByIdAndDelete(req.params.id);

    // Si no se elimina es por que no encontró el id
    if (!deleteEmployee) {
      return res.status(404).json({ message: "Employee Not Found" });
    }

    return res.status(200).json({ message: "Employee Deleted" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default employeeController;
