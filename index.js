const express=require("express");
const app=express();
app.use(express.urlencoded({extended:true}));

const path= require("path");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
const axios=require("axios");


app.set("view engine","ejs");
const memeTemplates = [
    { id: 1, url: 'https://i.imgflip.com/1bij.jpg' }, // Drake meme
    { id: 2, url: 'https://i.imgflip.com/26am.jpg' }, // Distracted Boyfriend
    { id: 3, url: 'https://i.imgflip.com/1otk96.jpg' }, // Change My Mind
    { id: 4, url: 'https://i.imgflip.com/30b1gx.jpg' }, // Expanding Brain
    { id: 5, url: 'https://i.imgflip.com/2gnnjh.jpg' }, // Two Buttons
    { id: 6, url: 'https://i.imgflip.com/1ur9b0.jpg' }, // Leonardo Laugh
];

app.get("/",(req,res)=>{
    res.render("index");
});
app.get('/memegenerator', async (req, res) => {
    try {
        const response = await axios.get('https://api.imgflip.com/get_memes');
        const memeTemplates = response.data.data.memes.slice(0, 50); // first 20 memes
        res.render('memegenerator.ejs', { memes: memeTemplates  });
    } catch (error) {
        console.error(error);
        res.send('Error fetching memes');
    }
});

const port = process.env.PORT || 8080;

app.listen(port,()=>{
    console.log("App is listening!!");
});

