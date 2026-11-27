const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  bookingRef:        { type: String, required: true, unique: true },
  user:              { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  guestName:         { type: String, required: true },
  guestEmail:        { type: String, required: true },
  guestPhone:        { type: String, required: true },
  packageTitle:      { type: String, required: true },
  location:          { type: String, required: true },
  travelDate:        { type: String, required: true },
  guests:            { type: Number, required: true, min: 1 },
  currency:          { type: String, enum: ["GBP", "INR", "USD"], default: "INR" },
  totalAmount:       { type: Number, required: true },
  specialRequests:   { type: String, default: "" },
  paymentStatus:     { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  razorpayOrderId:   { type: String, default: "" },
  razorpayPaymentId: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
