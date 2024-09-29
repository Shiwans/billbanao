const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true // Ensure every customer is associated with a user
},
  name: {
    type: String,
    required: true,
  },
  contactInfo: {
    phone: {
      type: Number,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`
      },
    },
    upi: {
      type: String,
      required: true,
    },
  },
  type: {
    type: String,
    default: "customer"
  },
  totalAmount: {
    type: Number,
    default: 0, // Total amount of goods purchased
  },
  totalPaid: {
    type: Number,
    default: 0,
    min: [0, 'Total paid cannot be negative'],
  },
  totalDue: {
    type: Number,
    default: 0, // Total left to take
  },
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);
