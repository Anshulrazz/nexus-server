const express = require('express');
const router = express.Router();
const { uploadProject,getProject, likeAndUnlikePost,   commentOnPost, addCredit, makePremium, unlockProject, getAllProjects, deleteComment , } = require('../controllers/projectController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.route("/upload").post( authMiddleware,uploadProject);
router.route("/like/:id").post(authMiddleware, likeAndUnlikePost);
router.route("/comment/:id").post(authMiddleware, commentOnPost);
router.route("/comment/remove/:id").post(authMiddleware, deleteComment);
router.route("/addcredit").post(authMiddleware, addCredit);
router.route("/makep/:id").post( makePremium);
router.route("/unlockp/:id").post(authMiddleware, unlockProject);
router.route("/feed").get(authMiddleware,getAllProjects);
router.route("/:id").get(authMiddleware, getProject);

module.exports = router;