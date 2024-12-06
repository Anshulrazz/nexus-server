const User = require('../models/User');
const Project = require('../models/Project');
const Document = require('../models/Document');


exports.getstats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const projects = await Project.countDocuments();
    const documents = await Document.countDocuments();
    res.status(200).json({
      success: true,
      users,
      projects,
      documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find();
    res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    await user.remove();
    res.status(200).json({
      success: true,
      message: 'User deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    await project.remove();
    res.status(200).json({
      success: true,
      message: 'Project deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }
    await document.remove();
    res.status(200).json({
      success: true,
      message: 'Document deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.getBYday = async (req, res) => {
  try {
    const projects = await Project.find({
      createdAt: {
        $gte: new Date(new Date() - 24 * 60 * 60 * 1000),
      },
    }).countDocuments();
    const documents = await Document.find({
      createdAt: {
        $gte: new Date(new Date() - 24 * 60 * 60 * 1000),
      },
    }).countDocuments();
    const users = await User.find({
      createdAt: {
        $gte: new Date(new Date() - 24 * 60 * 60 * 1000),
      },
    }).countDocuments();
    res.status(200).json({
      success: true,
      projects,
      documents,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.getBYmonth = async (req, res) => {
  try {
    const projects = await Project.find({
      createdAt: {
        $gte: new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
      },
    }).countDocuments();
    const documents = await Document.find({
      createdAt: {
        $gte: new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
      },
    }).countDocuments();
    const users = await User.find({
      createdAt: {
        $gte: new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
      },
    }).countDocuments();
    res.status(200).json({
      success: true,
      projects,
      documents,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.getBYyear = async (req, res) => {
  try {
    const projects = await Project.find({
      createdAt: {
        $gte: new Date(new Date() - 365 * 24 * 60 * 60 * 1000),
      },
    }).countDocuments();
    const documents = await Document.find({
      createdAt: {
        $gte: new Date(new Date() - 365 * 24 * 60 * 60 * 1000),
      },
    }).countDocuments();
    const users = await User.find({
      createdAt: {
        $gte: new Date(new Date() - 365 * 24 * 60 * 60 * 1000),
      },
    }).countDocuments();
    res.status(200).json({
      success: true,
      projects,
      documents,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}