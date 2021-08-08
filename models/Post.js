const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  likes: [{ userId: { type: Schema.Types.ObjectId, ref: "User" } }],
  comments: [
    {
      comment: { type: String, required: true },
      userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    },
  ],
  content: {
    required: true,
    type: String,
  },
});
module.exports = mongoose.model("Post", postSchema);
