const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// POST /api/employees
router.post('/', employeeController.createEmployee);

module.exports = router;
