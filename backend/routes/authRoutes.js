const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateUserPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe); // Protected route to get user data
router.put('/password', protect, updateUserPassword); // Protected route to update password

module.exports = router;