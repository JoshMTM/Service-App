const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  services: [
    {
      type: Schema.Types.ObjectId,
      ref: "Services",
    },
  ],
  requests: [
    {
      type: Schema.Types.ObjectId,
      ref: "Requests",
    },
  ],
});

const User = model("User", userSchema);

module.exports = User;
