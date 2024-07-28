const cloudinary = require('cloudinary').v2;

// integared the cloudinary for storing the image
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
  });

module.exports = cloudinary;