const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, min: 6, max: 15 },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["user", "admin"] },
    todos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Todo" }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  //below code using callbacks, remove async from main fn when using this
  // if (!this.isModified("password")) return next();
  // bcrypt.hash(this.password, 10, (err, passwordHash) => {
  //   if (err) return next(err);
  //   this.password = passwordHash;
  //   next();
  // });
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return cb(err);
    else {
      if (!isMatch) return cb(null, isMatch);
      return cb(null, this);
    }
  });
};

module.exports = mongoose.model("User", userSchema);
