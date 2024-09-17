// Import mongoose
const mongoose = require('mongoose');

// MongoDB connection URI
const mongoURI = 'mongodb+srv://Saksh_singh:itz_sak_2052@cluster0.9lcvh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });




