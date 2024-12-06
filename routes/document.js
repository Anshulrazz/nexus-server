const express = require('express');
const router = express.Router();
const { uploadDocument, likeDocument } = require('../controllers/documentController');

router.post('/upload',uploadDocument);

router.post('/like/:id', likeDocument);

// Implement other document-related routes

module.exports = router;
