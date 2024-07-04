import mongoose, { Schema } from "mongoose";

export const otpSchema = new Schema({
  otp: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{6}$/.test(v); 
      },
    },
  },
  userEmail: {
    type: String,
    required: true,
    lowercase: true, 
    validate: {
      validator: function (v) {
        return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address.`,
    },
  },
}, {timestamps : true});

export const OTP = mongoose.model("OTP", otpSchema)
