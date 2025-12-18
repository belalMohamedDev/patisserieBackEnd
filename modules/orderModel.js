const mongoose = require("mongoose");
var mongooseI18n = require("mongoose-i18n-localize");
const Counter = require("./counterModel");
// Define the CartItem schema

const cartItemSchema = mongoose.Schema({
  product: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true },
  totalItemPrice: { type: Number },
});

/* ================= Payment ================= */
const paymentSchema = mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    method: {
      type: String,
      enum: ["cash", "card", "wallet"],
      default: "cash",
    },

    paidAt: {
      type: Date,
      default: Date.now,
    },

    paidBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },


  },
  { _id: false }
);
/* ================= Order Schema ================= */

const OrderSchema = mongoose.Schema(
  {
    orderNumber: { type: Number },

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

    payments: [paymentSchema],

    paymentStatus: {
      type: String,
      enum: ["unpaid", "partially_paid", "paid"],
      default: "unpaid",
    },


    isDeferred: {
      type: Boolean,
      default: false,
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



// ===================== Counter Logic =====================

OrderSchema.pre("save", function (next) {
  // in-store orders
  if (this.orderSource === "in_store") {
    this.taxPrice = 0;
    this.shippingPrice = 0;
  }

  if (!this.isDeferred) {
    this.paymentStatus = "paid";
    return next();
  }

  const totalPaid = this.payments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  if (totalPaid === 0) {
    this.paymentStatus = "unpaid";
  } else if (totalPaid < this.totalOrderPrice) {
    this.paymentStatus = "partially_paid";
  } else {
    this.paymentStatus = "paid";
  }

  next();
});

OrderSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  let counter = await Counter.findOne({ name: "dailyOrderNumber" });

  if (!counter) {
    counter = await Counter.create({
      name: "dailyOrderNumber",
      value: 0,
      lastReset: new Date(),
    });
  }

  const now = new Date();
  const lastReset = counter.lastReset || new Date(0);

  const sameDay =
    now.toDateString() === lastReset.toDateString();

  if (!sameDay) {
    counter.value = 0;
    counter.lastReset = now;
  }

  counter.value += 1;
  await counter.save();

  this.orderNumber = counter.value;
  next();
});






//========= Pre hook (populate) =========
OrderSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: "user",
      select: "name email phone",
    },
    {
      path: "driverId",
      select: "name email phone",
    },
    {
      path: "cartItems.product",
      select: "title image ratingsAverage",
    },
    {
      path: "shippingAddress",
    },
    {
      path: "payments.paidBy",
      select: "name",
    },
  ]);

  next();
});


// ========= Plugins & Index =========
OrderSchema.plugin(mongooseI18n, {
  locales: ["en", "ar"],
});

OrderSchema.index({
  nearbyStoreAddress: 1,
  status: 1,
  paymentStatus: 1,
});
const OrderModel = mongoose.model("Order", OrderSchema);

module.exports = OrderModel;
