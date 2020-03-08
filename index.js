let express = require("express");
let joi = require("@hapi/joi"); //an external module to validate data 
let app = express();
let port = process.env.PORT || 4500; 

app.use(express.json()); // to accept the value from body in json format // An inbuilt middleware 

//creating songs object array

let songs = [{
    id:1,
    songName:"Nightcrawler",
    genre:"Rap",
    artist:"Travis Scott",
    album:"Rodeo",
    releasedYear:2015,
    producer:"Metro Boomin",
    price:2000,
    availableOnYoutube:"Yes",
    views:"5M",
},
{
    id:2,
    songName:"Circles",
    genre:"Pop",
    artist:"Post Malone",
    album:"Circles",
    releasedYear:2019,
    producer:"Post Malone",
    price:5000,
    availableOnYoutube:"Yes",
    views:"181M",
},
{
    id:3,
    songName:"Antidote",
    genre:"Rap",
    artist:"Travis Scott",
    album:"Rodeo",
    releasedYear:2015,
    producer:"Travis Scott",
    price:3000,
    availableOnYoutube:"Yes",
    views:"308M",
},
{
    id:4,
    songName:"Starboy",
    genre:"R&B",
    artist:"The Weeknd",
    album:"Starboy",
    releasedYear:2016,
    producer:"The Weeknd",
    price:7000,
    availableOnYoutube:"Yes",
    views:"1.6B",
},
{
    id:5,
    songName:"Rich",
    genre:"Hip-Hop",
    artist:"NAV",
    album:"Perfect Timing",
    releasedYear:2017,
    producer:"Metro Boomin",
    price:4000,
    availableOnYoutube:"Yes",
    views:"2M",
}
];

//Fetching all songs
app.get("/api/songs/allList",(req,res)=>{
    res.send(songs);
});

//Fetching songs by ID
app.get("/api/songs/songById/:id",(req,res)=>{

    //Requesting the value from the browser thats why using the req.params method.
    let song = songs.find((item)=>item.id===parseInt(req.params.id)); 

    if(!song){
        return res.status(404).send({message:"Song Not Available"});
    }
    res.send(song);
});

//Adding new song

app.post("/api/songs/createSong",(req,res)=>{

    //creating the schema of accepted string
    let schema = joi.object({
        songName: joi.string().min(2).max(100).required(),
        releasedYear:  joi.number().max(2020).required(),
        price: joi.number().required()
    });

    //Validating the data with schema created
    let result = schema.validate(req.body,options={allowUnknown: true});
    //Object destructuring
    let {error} = result;
    //let {error} = schema.validate(req.body); more optimized

    if(error){
        return res.send(error.details[0].message);
    }

    let song = {
        id: songs.length + 1,
        //Since we are requesting the data from the body in which the form data is stored thats why using req.body
        songName: req.body.songName,
        genre: req.body.genre,
        artist: req.body.artist,
        album: req.body.album,
        releasedYear: req.body.releasedYear,
        producer: req.body.producer,
        price: req.body.price,
        availableOnYoutube: req.body.availableOnYoutube,
        views: req.body.views
    }
    songs.push(song);
    res.send(songs);
});

//Updations in the existing song

app.put("/api/songs/updateSong/:id",(req,res)=>{
    //checking requesting id is valid or not
    let song = songs.find((item)=>item.id === parseInt(req.params.id));
    if(!song){
        return res.status(404).send({message:"Invalid Song ID"});
    }

    //creating the schema of accepted string
    let schema = joi.object({
    songName: joi.string().min(2).max(100).required(),
    releasedYear:  joi.number().max(2020),
    price: joi.number()
    });
    
    //Validating the data with schema created
    let result = schema.validate(req.body,options={allowUnknown: true});
    //Object destructuring
    let {error} = result;
    //let {error} = schema.validate(req.body); more optimized

    if(error){
        return res.send(error.details[0].message);
    }

    song.songName = req.body.songName;
    song.genre = req.body.genre;
    song.artist = req.body.artist;
    song.album = req.body.album;
    song.releasedYear = req.body.releasedYear;
    song.producer = req.body.producer;
    song.price = req.body.price;
    song.availableOnYoutube = req.body.availableOnYoutube;
    song.views = req.body.views;
    res.send(songs);
});

//Delete song by ID

app.delete("/api/songs/removeSong/:id",(req,res)=>{
    let song = songs.find((data)=>data.id === parseInt(req.params.id));
    if(!song){
        return res.status(404).send({message:"Invalid Song ID"});
    }

    let index = songs.indexOf(song);
    songs.splice(index,1);
    res.send(songs);
})

app.listen(port,()=>console.log(`Port is Working on ${port}`));

