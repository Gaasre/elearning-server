const express = require('express');
const router = express.Router();
const course_controller = require('../controllers/course.controller');

router.get('/', course_controller.getByAuthor);
router.post('/', course_controller.new);
router.put('/:id', course_controller.update);
router.delete('/:id', course_controller.delete);

router.put('/section/:section/session/:session', course_controller.updateSession);
router.put('/section/:section', course_controller.updateSection);

router.delete('/section/:section/session/:session', course_controller.removeSession);
router.delete('/section/:section', course_controller.removeSection);

router.post('/:course/section/:section', course_controller.newSession);
router.post('/:course', course_controller.newSection);

router.post('/section/:section/session/:session/upload', course_controller.uploadSession)
router.delete('/section/:section/session/:session/upload', course_controller.deleteUpload)

router.post('/section/:section/session/:session/document', course_controller.uploadDocument)
router.delete('/section/:section/session/:session/document/:document', course_controller.deleteDocument)

module.exports = router;