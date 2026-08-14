const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// GET /api/employees/search
router.get('/search', employeeController.searchEmployees);

// GET /api/employees
router.get('/', employeeController.getAllEmployees);

// POST /api/employees
router.post('/', employeeController.createEmployee);

// POST /api/employees/bulk
router.post('/bulk', employeeController.bulkCreateEmployees);

// PUT /api/employees/:id
router.put('/:id', employeeController.updateEmployee);

module.exports = router;
