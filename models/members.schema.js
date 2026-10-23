import mongoose from "mongoose";

const memberSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  phone: {
    type: String,
    required: true,
    trim: true,
  },
});

const Member = mongoose.model("Member", memberSchema);

export default Member;