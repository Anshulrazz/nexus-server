const Project = require('../models/Project');
const User = require('../models/User');

exports.myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("project");
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

 

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "project"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.editProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.getMyProjects = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const projects = [];

    for (let i = 0; i < user.projects.length; i++) {
      const project = await Project.findById(user.project[i]).populate(
        "likes comments.user owner"
      );
      projects.push(project);
    }

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
};

exports.searchUser = async (req, res) => {
  try {
    // Access nameQuery from the body for POST request
    const { nameQuery } = req.body;

    if (!nameQuery || typeof nameQuery !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameter',
      });
    }

    const users = await User.find({
      name: { $regex: nameQuery, $options: 'i' },
    });

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
};

