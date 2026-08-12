const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// GET /api/employees/search
router.get('/search', employeeController.searchEmployees);

// POST /api/employees
router.post('/', employeeController.createEmployee);

module.exports = router;
