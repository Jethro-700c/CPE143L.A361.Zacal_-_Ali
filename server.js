const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcrypt'); // Import bcrypt

const app = express();
app.use(express.json());
app.use(cors());

const uri = "mongodb+srv://najiep:d4PmwChHmJdSwIPj@cluster0.qqgurpr.mongodb.net/?project=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB Atlas successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}
connectDB();

// --- HELPER FUNCTION ---
async function findUser(username) {
  const db = client.db("restaurantDB");
  const users = db.collection("users");

  // Try to find by email or username
  const user = await users.findOne({
    $or: [{ email: username }, { username }],
  });
  return user;
}

// --- REGISTRATION ---
app.post('/register', async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    const db = client.db("restaurantDB");
    const users = db.collection("users");

    const existing = await users.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds

    await users.insertOne({ fullname, email, password: hashedPassword }); // Store the hashed password
    res.status(201).json({ success: true, message: "User registered successfully!" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --- LOGIN ---
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await findUser(username);

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Don't send the password hash back to the client
      const { password: hashedPassword, ...userWithoutPassword } = user;
      res.status(200).json({ success: true, message: "Login successful", user: userWithoutPassword }); // Send the user object
    } else {
      res.status(401).json({ success: false, message: "Invalid username or password" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));