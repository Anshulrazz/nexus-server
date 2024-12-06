const express = require('express');
const router = express.Router();
const { register, login, profilePicUpload, logout, followUser, followstatus, addbio, registerUser, loginUser } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/face-register', authMiddleware, registerUser);
router.post('/face-login', loginUser);
router.get('/logout', logout);
router.post("/uploadprofilepic", authMiddleware, profilePicUpload);
router.route("/follow/:id").post(authMiddleware, followUser);
router.route("/add-bio").post(authMiddleware, addbio);
router.route("/follow-status/:id").get(authMiddleware, followstatus);


module.exports = router;
