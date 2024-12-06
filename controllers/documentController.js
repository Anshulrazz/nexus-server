const Document = require('../models/Document');
const User = require('../models/User');
const cloudinary = require("cloudinary");
exports.uploadDocument = async (req, res) => {
  try {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.file, {
      folder: "documents/file",
      resource_type: "raw",
    });

    const user = await User.findById(req.user._id);
    
    const newPostData = {
      name: req.body.name,
      caption: req.body.caption,
      documentation: req.body.documentation,
      category: req.body.category,
      file: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      owner: req.user._id,
    };

    const document = await Document.create(newPostData);
    user.credit += 5;
    user.document.unshift(document._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Document Uploaded",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.likeDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ msg: 'Document not found' });

    document.likes += 1;
    await document.save();
    res.json(document);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


