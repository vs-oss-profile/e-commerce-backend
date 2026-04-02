const customerService = require("../services/customerService");

async function getAllCustomers(req, res) {
  const customers = await customerService.getAllCustomers();
  return res.json({
    success: true,
    data: customers,
  });
}

async function getCustomerById(req, res) {
  const id = req.params.id;
  const result = await customerService.getCustomerById(id);

  if (result.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Customer not found",
    });
  }
  return res.json({
    success: true,
    data: result[0],
  });
}

async function addCustomer(req, res) {
  const result = await customerService.addCustomer(req.body);
  return res.status(201).json({
    success: true,
    data: result,
  });
}

async function deleteCustomer(req, res) {
  const id = req.params.id;
  const affectedRows = await customerService.deleteCustomer(id);

  if (affectedRows === 0) {
    return res.status(404).json({
      success: false,
      message: "Customer not found",
    });
  }

  return res.json({
    success: true,
    message: "Customer information deleted successfully",
  });
}

async function updateCustomer(req, res) {
  const id = req.params.id;
  const customer = req.body;

  const affectedRows = await customerService.updateCustomer(id, customer);

  if (affectedRows > 0) {
    return res.json({
      success: true,
      message: "Customer information updated successfully",
    });
  }
  return res.status(404).json({
    success: false,
    message: "Customer not found",
  });
}

module.exports = {
  getAllCustomers,
  getCustomerById,
  // addCustomer,
  deleteCustomer,
  updateCustomer,
};
