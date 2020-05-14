const express = require('express');
const router = express.Router();

router.use('/users', require('./user.route'));
router.use('/courses', require('./course.route'));

module.exports = router;