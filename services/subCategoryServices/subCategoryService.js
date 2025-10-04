const subCategoryModel = require("../../modules/subCategoryModel");
const factory = require("../handleFactor/handlerFactory");
const { uploadToCloudinary } = require('../../middleware/cloudinaryMiddleWare')

const { uploadSingleImage } = require('../../middleware/imageUploadMiddleware')
const {resizeImage} = require('../../middleware/resizeImage')



//upload single image
const uploadSubCategoryImage = uploadSingleImage('image')

// resize image before upload
const resizeSubCategoryImage = resizeImage()

// upload image in cloud
const uploadImageInCloud = uploadToCloudinary('subCategories')


// @ dec create subCategory
// @ route Post  /api/vi/subCategory
// @ access private
const creatSubCategory = factory.creatOne(subCategoryModel, "subCategory");

// @ dec get all  subCategory data
// @ route Get  /api/vi/subCategory
// @ access public
const getAllSubCategory = factory.getAllData(subCategoryModel, "subCategory");


// @ dec get all subCategory to categoryData
// @ route Get  /api/vi/catgoryId/subCategory
// @ access public
const getAllSubCategoryFromCategory = factory.getAllData(
  subCategoryModel,
  "getAllSubCategoryFromCategory"
);

// @ dec get specific subCategory
// @ route Get  /api/vi/subCategory/id
// @ access public
const getOneSubCategory = factory.getOne(subCategoryModel, "subCategory");

// @ dec update specific subCategory
// @ route Update  /api/vi/subCategory/id
// @ access Private
const updateSubCategory = factory.updateOne(subCategoryModel, "subCategory");

// @ dec delete specific subCategory
// @ route Update  /api/vi/subCategory/id
// @ access Private
const deleteSubCategory = factory.deleteOne(subCategoryModel, "subCategory");

// @ dec delete photo from cloud using when update
const deleteImageBeforeUpdate = factory.deletePhotoFromCloud(subCategoryModel)

const createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObject = filterObject;
  next();
};

module.exports = {
  creatSubCategory,
  getAllSubCategory,
  getOneSubCategory,
  updateSubCategory,
  deleteSubCategory,
  createFilterObject,deleteImageBeforeUpdate,
  getAllSubCategoryFromCategory,uploadSubCategoryImage,resizeSubCategoryImage,uploadImageInCloud
};
