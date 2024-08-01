const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(bodyParser.json({ limit: '4.5mb' }));
app.use(cors());

mongoose.connect('mongodb+srv://ppalgaming2211:S0222p@cluster0.4z6qi4v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const imageSchema = new mongoose.Schema({
    name: String,
    description: String,
    category: String,
    image: String
});

const Image = mongoose.model('Image', imageSchema);
const PORT =  5000;

app.get('/',(req,res)=>{
 
   res.json({message:"hello All Good 👍"});

});


app.get('/api/kitchen', async (req, res) => {
  try {
    const kitchenItems = await Image.find({ category: 'kitchen' });
    res.json(kitchenItems);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/IhdUploadImg', async (req, res) => {
    const { name, description, category, image } = req.body;

    const newImage = new Image({
        name,
        description,    
        category,
        image
    });

    await newImage.save();
    res.send('Image uploaded successfully');
});

app.get('/images/:category', async (req, res) => {
    const { category } = req.params;
    const images = await Image.find({ category });
    res.json(images);
});



app.put('/IhdUploadImg/:id', async (req, res) => {
    const { description } = req.body;
  
    try {
      const updatedImage = await Image.findByIdAndUpdate(req.params.id, { description }, { new: true });
      if (!updatedImage) return res.status(404).json({ message: 'Image not found' });
      res.json(updatedImage);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  app.delete('/delete/:id', async (req, res) => {
    try {
      const deletedImage = await Image.findByIdAndDelete(req.params.id);
      if (!deletedImage) return res.status(404).json({ message: 'Image not found' });
      res.json({ message: 'Image deleted' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    } 
  });


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
