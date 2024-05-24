const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController')

// Customer Routes
router.get('/', customerController.homepage);
router.get('/about', customerController.aboutpage);

router.get('/add', customerController.addCustomer);
router.post('/add', customerController.postCustomer);
router.get('/view2/:id', customerController.viewCustomer);
router.get('/edit/:id', customerController.editDetails);
router.put('/edit/:id', customerController.editCustomer);
router.delete('/edit/:id', customerController.deleteCustomer);
router.get('/generatePdfView/:id', customerController.renderGeneratePage);

// Generate the PDF and provide download link
router.post('/generatePdf', customerController.generatePdf);
router.post('/search', customerController.searchCustomer);

module.exports = router