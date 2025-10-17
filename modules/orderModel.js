const mongoose = require("mongoose");
var mongooseI18n = require("mongoose-i18n-localize");

// Define the CartItem schema

const cartItemSchema = mongoose.Schema({
  product: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true },
  totalItemPrice: { type: Number },
});

const OrderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    notes: { type: String },

    status: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
      default: 0,
    },

    driverId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    adminAcceptedAt: Date,

    adminCompletedAt: Date,
    driverAcceptedAt: Date,
    driverDeliveredAt: Date,
    canceledAt: Date,


    cartItems: [cartItemSchema],

    taxPrice: {
      type: Number,
      default: 0,
    },

    shippingPrice: {
      type: Number,
      default: 0,
    },
    shippingAddress: {
      type: mongoose.Schema.ObjectId,
      ref: "UserAddress",
    },

    nearbyStoreAddress: {
      type: mongoose.Schema.ObjectId,
      ref: "StoreAddress",
    },


     deliveryType: {
      type: String,
      enum: ["delivery", "pickup"],
      default: "delivery",
    },

    orderSource: {
      type: String,
      enum: ["app", "phone", "in_store"],
      default: "app",
    },


    customerName: { type: String, trim: true },
    customerPhone: { type: String, trim: true },
    customerAddressText: { type: String, trim: true },

    totalOrderPrice: {
      type: Number,
    },

    paymentMethodType: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },
    canceledByDrivers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],

   
 
  },
  { timestamps: true }
);


//========= Pre hook (populate) =========
OrderSchema.pre(/^find/, function (next) {


  this.populate({
    path: "user",
    select: "name image email phone",
  })
    .populate({
      path: "cartItems.product",
      select: `title image ratingsAverage `, 
 
    })
    .populate({
      path: "shippingAddress",
    });

  next();
});







// ========= Plugins & Index =========
OrderSchema.plugin(mongooseI18n, {
  locales: ["en", "ar"],
});

OrderSchema.index({ nearbyStoreAddress: 1, status: 1, canceledByDrivers: 1 });

const OrderModel = mongoose.model("Order", OrderSchema);

module.exports = OrderModel;
