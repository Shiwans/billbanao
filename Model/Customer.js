// const mongoose = require("mongoose");

// const customerSchema = new mongoose.Schema({
//   // userId: {
//   //   type: mongoose.Schema.Types.ObjectId,
//   //   ref: 'User', // Reference to the User model
//   //   required: true, // Ensure that every customer is associated with a user
//   // },
//   name: {
//     type: String,
//     required: true,
//   },
//   contactInfo: {
//     phone: {
//       type: Number,
//       required: true,
//     },
//     email: {
//       type: String,
//       type: String,
//       required: true,
//       unique: true,
//       // default: 'shiwans.vaishya@gmail.com'
//     },
//     upi: {
//       type: String,
//       required: true,
//     },
//   },
//   type: {
//     type: String,
//     default:"customer"
//   },
//   totalAmount: {
//     type: Number,
//     default: 0, // Total amount of goods purchased
//   },
//   totalPaid: {
//     type: Number,
//     default: 0, // Total amount paid
//   },
//   totalDue: {
//     type: Number,
//     default: 0, // Total left to take
//   },
// //   createdAt: {
// //     type: Date,
// //     default: Date.now,
// //   },
//   // sales: [{
//   //     type: mongoose.Schema.Types.ObjectId,
//   //     ref: 'Sale' // Reference to sales related to this customer
//   // }],
//   // payments: [{
//   //     type: mongoose.Schema.Types.ObjectId,
//   //     ref: 'Payment' // Reference to payments related to this customer
//   // }]
// },{timestamps:true});

// module.exports = mongoose.model("Customer", customerSchema);


const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contactInfo: {
    phone: {
      type: Number,
      required: true,
      unique: true, // Ensure phone number is unique
      validate: {
        validator: function (v) {
          return /^(?=.*[0-9])[- +()0-9]+$/.test(v); // Add your phone number format validation
        },
        message: props => `${props.value} is not a valid phone number!`
      },
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique
      validate: {
        validator: function (v) {
          return /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v); // Email validation regex
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
    default: 0, // Total amount paid
  },
  totalDue: {
    type: Number,
    default: 0, // Total left to take
  },
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);
