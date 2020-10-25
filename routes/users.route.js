const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
let User = require("../models/User");
const auth = require("../middleware/auth");

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post(async (req, res) => {
  const { username, password, role } = req.body;

  // Simple validation
  if (!username || !role || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const user = await User.findOne({ username });
    if (user) throw Error("User already exists");
    const newUser = new User({ username, password, role });
    const savedUser = await newUser.save();
    if (!savedUser) throw Error("Something went wrong saving the user");

    const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, {
      expiresIn: 3600,
    });

    res.status(200).json({
      token,
      user: {
        id: savedUser.id,
        username: savedUser.username,
        role: savedUser.role,
      },
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.route("/login").post(async (req, res) => {
  const { username, password } = req.body;

  // Simple validation
  if (!username || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    // Check for existing user
    const user = await User.findOne({ username });
    if (!user) throw Error("User does not exist");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw Error("Invalid credentials");

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: 3600 });
    if (!token) throw Error("Couldnt sign the token");

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.route("/authuser").get(auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) throw Error("User does not exist");
    res.json(user);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;
