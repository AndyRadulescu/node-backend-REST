const express = require('express');
const router = express.Router();
const user = require('../service/').user;

router.get('/:id', user.getUser);
router.post('/login', user.login);
router.post('/sync', user.authToken);
router.post('/', user.insertUser);
router.put('/:id', user.updateUser);
router.delete('/:id', user.delete);

module.exports = router;