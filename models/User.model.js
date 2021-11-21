const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  expertise: String,
  email: String,
  password: String,
  description: String,
  img_url: String,
  userServices: [
    {
      type: Schema.Types.ObjectId,
      ref: "Services",
    },
  ],
  userRequests: [
    {
      type: Schema.Types.ObjectId,
      ref: "Requests",
    },
  ],
});

const User = model("User", userSchema);

module.exports = User;
