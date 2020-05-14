const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const category_controller = require('../controllers/categorie.controller');


// a simple test url to check that all of our files are communicating correctly.
router.get('/', category_controller.getAll);
router.get('/:id', category_controller.getOne);
router.post('/', category_controller.new);
router.put('/:id', category_controller.update);
router.delete('/:id', category_controller.delete);
module.exports = router;