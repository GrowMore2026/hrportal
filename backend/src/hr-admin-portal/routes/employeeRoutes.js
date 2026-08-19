const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// GET /api/employees/search
router.get('/search', employeeController.searchEmployees);

// GET /api/employees
router.get('/', employeeController.getAllEmployees);

// GET /api/employees/:id
router.get('/:id', employeeController.getEmployeeById);

// POST /api/employees
router.post('/', employeeController.createEmployee);

// POST /api/employees/bulk
router.post('/bulk', employeeController.bulkCreateEmployees);

// PUT /api/employees/:id
router.put('/:id', employeeController.updateEmployee);

// GET /api/employees/:id/family
router.get('/:id/family', employeeController.getEmployeeFamily);

// POST /api/employees/:id/family
router.post('/:id/family', employeeController.addEmployeeFamily);

// PUT /api/employees/family/:familyId
router.put('/family/:familyId', employeeController.updateEmployeeFamily);

// DELETE /api/employees/family/:familyId
router.delete('/family/:familyId', employeeController.deleteEmployeeFamily);

module.exports = router;
