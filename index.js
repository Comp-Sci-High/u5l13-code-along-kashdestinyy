const mongoose = require("mongoose");
const express = require("express");

const app = express();

app.use(express.static(__dirname + "/public"));

app.use(express.json());

app.set("view engine", "ejs");

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path}`);
  next();
});

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    department: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const Teacher = mongoose.model("Teacher", teacherSchema, "Teachers");

const ratingSchema = new mongoose.Schema(
  {
    username: { type: String },
    teacher: { type: String },
    comment: { type: String },
    rating: { type: Number },
  },
  { timestamps: true }
);

const Rating = mongoose.model("Rating", ratingSchema, "Rating");

app.get("/", async (req, res) => {
  const teachers = await Teacher.find({}).sort({ createdAt: -1 });
  res.render("teachers.ejs", { teachers });
});

app.get("/ratings", async (req, res) => {
  const ratings = await Rating.find({}).sort({ createdAt: -1 });
  res.render("ratings.ejs", { ratings });
});

app.post("/add/rating", async (req, res) => {
  const newRating = await new Rating({
    username: req.body.username,
    teacher: req.body.teacher,
    comment: req.body.comment,
    rating: req.body.rating,
  }).save();
  res.json(newRating);
});

app.post("/add/teacher", async (req, res) => {
  const newTeacher = await new Teacher({
    name: req.body.name,
    department: req.body.department,
    image: req.body.image,
  }).save();

  res.json(newTeacher);
});

// Create a dynamic PATCH route to update a teacher by their ID
app.patch("/teachers/:id", async (req,res)=>{
  const response = await Teacher.findOneAndUpdate(
    {_id: req.params.id},
    {
      name: req.body.name,
      department: req.body.department,
      image: req.body.image
    },
    { new: true }
  )
  res.json(response)
})

app.patch("/ratings/:id", async (req,res)=>{
 const response = await Rating.findOneAndUpdate(
   {_id: req.params.id},
   {
     username: req.body.username,
     teacher: req.body.teacher,
     comment: req.body.comment,
     rating: req.body.rating
   },
   { new: true }
 )
 res.json(response)
})

app.delete("/teachers/:id", async (req,res)=>{
 const response = await Teacher.findByIdAndDelete(req.params.id)
 res.json(response)
})

app.delete("/ratings/:id", async (req,res)=>{
 const response = await Rating.findByIdAndDelete(req.params.id)
 res.json(response)
})

async function startServer() {
  try {
    // MongoDB Atlas connection (free tier)
    // Replace 'username' and 'password' with your MongoDB Atlas credentials
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/teacher-rater"
    
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
    })
    console.log("Connected to MongoDB")
    
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message)
    console.log("\nTo fix this issue:")
    console.log("1. Make sure MongoDB is running locally, OR")
    console.log("2. Use MongoDB Atlas (free): https://www.mongodb.com/cloud/atlas")
    console.log("3. Set MONGO_URI environment variable with your connection string")
    process.exit(1)
  }
}

startServer()
