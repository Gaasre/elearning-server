const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const user_controller = require('../controllers/user.controller');


// a simple test url to check that all of our files are communicating correctly.
router.post('/course/progression/new/:id', user_controller.add_course_progression);
router.put('/course/progression/remove/:id', user_controller.remove_course_progression);
router.post('/course/', user_controller.new_course);
router.get('/', user_controller.getOne);
router.get('/:id', user_controller.getId);
router.post('/', user_controller.new);
router.put('/', user_controller.update);
router.delete('/:id', user_controller.delete);
module.exports = router;