const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const userAddressModel = require("../../modules/userAddressModel");
const i18n = require("i18n");




// exports.createCashOrderValidator = [

//   check("notes").optional(),

//   check("shippingAddress")
//     .notEmpty()
//     .withMessage((value, { req }) =>
//       i18n.__({
//         phrase: "shippingAddressRequired",
//         locale: req.headers["lang"] || "en",
//       })
//     )
//     .isMongoId()
//     .withMessage((value, { req }) =>
//       i18n.__({
//         phrase: "InvalidshippingAddressIdFormat",
//         locale: req.headers["lang"] || "en",
//       })
//     )
//     .custom(
//       asyncHandler(async (val, { req }) => {
//         if (req.userModel.role === "admin") {
//           return true; 
//         }
//         const document = await userAddressModel.findOne({ _id: val });
//         if (!document) {
//           throw new Error(
//             i18n.__({
//               phrase: "shippingAddressIdNotFound",
//               locale: req.headers["lang"] || "en",
//             })
//           );
//         }
//       })
//     ),
//   validatorMiddleware,
// ];





exports.createCashOrderValidator = [
  check("notes").optional(),

  check("shippingAddress")
    .custom(async (value, { req }) => {
   
      if (req.userModel.role  === "admin") {
        return true; 
      }

      if (!value) {
        throw new Error(
          i18n.__({
            phrase: "shippingAddressRequired",
            locale: req.headers["lang"] || "en",
          })
        );
      }
      if (!/^[0-9a-fA-F]{24}$/.test(value)) {
        throw new Error(
          i18n.__({
            phrase: "InvalidshippingAddressIdFormat",
            locale: req.headers["lang"] || "en",
          })
        );
      }


      const document = await userAddressModel.findById(value);
      if (!document) {
        throw new Error(
          i18n.__({
            phrase: "shippingAddressIdNotFound",
            locale: req.headers["lang"] || "en",
          })
        );
      }

      return true;
    }),

  validatorMiddleware,
];
