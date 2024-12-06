const faceapi = require('face-api.js');
const User = require('../models/User');
const cloudinary = require("cloudinary");


exports.register = async (req, res) => {
  const { name, email, phone, branch, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    user = await User.create({
      name,
      email,
      phone,
      branch,
      password,
    });
    const token = await user.generateToken();

    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(201).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
      .select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = await user.generateToken();

    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(200).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({
        success: true,
        message: "Logged out",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.profilePicUpload = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.avatar.public_id) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    }
    const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
      folder: "users",
    });
    user.avatar.url = myCloud.secure_url;
    user.avatar.public_id = myCloud.public_id;
    await user.save();

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
}


exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (loggedInUser.following.includes(userToFollow._id)) {
      const indexfollowing = loggedInUser.following.indexOf(userToFollow._id);
      const indexfollowers = userToFollow.followers.indexOf(loggedInUser._id);

      loggedInUser.following.splice(indexfollowing, 1);
      userToFollow.followers.splice(indexfollowers, 1);

      await loggedInUser.save();
      await userToFollow.save();

      res.status(200).json({
        success: true,
        message: "User Unfollowed",
      });
    } else {
      loggedInUser.following.push(userToFollow._id);
      userToFollow.followers.push(loggedInUser._id);

      await loggedInUser.save();
      await userToFollow.save();

      res.status(200).json({
        success: true,
        message: "User followed",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.followstatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (loggedInUser.following.includes(user._id)) {
      res.status(200).json({
        success: true,
        message: true,
      });
    } else {
      res.status(200).json({
        success: true,
        message: false
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.addbio = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    user.bio = req.body.bio;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Bio added",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

const compareFaceData = (storedFaceData, inputFaceData) => {
  if (storedFaceData.length !== inputFaceData.length) {
    throw new Error("Face data length mismatch");
  }
  const distance = faceapi.euclideanDistance(storedFaceData, inputFaceData);
  return distance < 0.6;
};

exports.registerUser = async (req, res) => {
  const { faceData } = req.body;
  if (!faceData) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const user = await User.findByIdAndUpdate(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.faceData[0] = faceData;
    user.save();
    res.status(201).json({ message: 'Face Data saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error while registering user' });
  }
};
exports.loginUser = async (req, res) => {
  try {
    const { email, faceData } = req.body;

    if (!email || typeof email !== 'string' || !faceData || typeof faceData !== 'object') {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const storedFaceData = user.faceData[0];
    const distance = calculateDistance(Object.values(faceData), Object.values(storedFaceData));
    const THRESHOLD = 0.6; // Adjust based on testing

    if (distance > THRESHOLD) {
      return res.status(401).json({ error: 'Face data mismatch' });
    }
    const token = await user.generateToken();
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(200).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const calculateDistance = (data1, data2) => {
  if (!data1 || !data2 || data1.length !== data2.length) return Infinity;
  return Math.sqrt(data1.reduce((sum, value, index) => sum + Math.pow(value - data2[index], 2), 0));
};

