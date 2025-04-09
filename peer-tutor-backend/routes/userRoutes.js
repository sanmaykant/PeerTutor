const express = require('express');
const { signup, login, getMatches } = require('../controllers/userController');

const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.get('/matches/:id', getMatches);

module.exports = router;
