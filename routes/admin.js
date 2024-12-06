const express = require('express');
const router = express.Router();

const {
    getstats,
    getUsers,
    getProjects,
    getDocuments,
    deleteUser,
    deleteProject,
    deleteDocument,
    getBYday,
    getBYmonth,
    getBYyear
} = require('../controllers/admin');


// Routes for retrieving all users, projects, and documents
router.get('/users', getUsers);
router.get('/projects', getProjects);
router.get('/documents', getDocuments);

// Routes for deleting a user, project, or document by ID
router.delete('/user/:id', deleteUser);
router.delete('/project/:id', deleteProject);
router.delete('/document/:id', deleteDocument);

// Route to get statistics for users, projects, and documents
router.get('/stats', getstats);
// Routes for getting data based on creation date filters (by day, month, or year)
router.get('/byday', getBYday);
router.get('/bymonth', getBYmonth);
router.get('/byyear', getBYyear);

module.exports = router;
