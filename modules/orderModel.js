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
    canceledAt: Date,

    paitAt: Date,

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

    isPaid: {
      type: Boolean,
      default: false,
    },
    paitAt: Date,
  },
  { timestamps: true }
);

OrderSchema.pre(/^find/, function (next) {
  // اللغة اللي جاية من options (بنمررها من الـ controller)
  const lang = this.options.lang || "en";

  this.populate({
    path: "user",
    select: "name image email phone",
  })
    .populate({
      path: "cartItems.product",
      select: `title.${lang} image ratingsAverage subCategory`, 
      populate: {
        path: "subCategory",
        select: `title.${lang} category`,
        populate: {
          path: "category",
          select: `title.${lang}`
        }
      }
    })
    .populate({
      path: "shippingAddress",
    });

  next();
});


OrderSchema.post(/^find/, function (docs, next) {
  const lang = this.options.lang || "en";

  docs.forEach(order => {
    order.cartItems.forEach(item => {
      if (item.product?.title?.[lang]) {
        item.product.title = item.product.title[lang]; // يخليها سترينج بدل object
      }
      if (item.product?.subCategory?.title?.[lang]) {
        item.product.subCategory.title = item.product.subCategory.title[lang];
      }
      if (item.product?.subCategory?.category?.title?.[lang]) {
        item.product.subCategory.category.title = item.product.subCategory.category.title[lang];
      }
    });
  });

  next();
});



// // ========= Pre hook (populate) =========
// OrderSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "user",
//     select: "name image email phone",
//   })
//     .populate({
//       path: "cartItems.product",
//       select: "title image ratingsAverage subCategory",
//       populate: {
//         path: "subCategory",
//         select: "title category",
//         populate: {
//           path: "category",
//           select: "title",
//         },
//       },
//     })
//     .populate({
//       path: "shippingAddress",
//     });

//   next();
// });

// // ========= Post hook (localization) =========
// OrderSchema.post(/^find/, function (docs, next) {
//   const lang = this.options.lang || "en";

//   docs.forEach((order) => {
//     order.cartItems.forEach((item) => {
//       if (item.product?.title?.[lang]) {
//         item.product.title = item.product.title[lang];
//       }
//       if (item.product?.subCategory?.title?.[lang]) {
//         item.product.subCategory.title = item.product.subCategory.title[lang];
//       }
//       if (item.product?.subCategory?.category?.title?.[lang]) {
//         item.product.subCategory.category.title =
//           item.product.subCategory.category.title[lang];
//       }
//     });
//   });

//   next();
// });

// ========= Plugins & Index =========
OrderSchema.plugin(mongooseI18n, {
  locales: ["en", "ar"],
});

OrderSchema.index({ nearbyStoreAddress: 1, status: 1, canceledByDrivers: 1 });

const OrderModel = mongoose.model("Order", OrderSchema);

module.exports = OrderModel;
