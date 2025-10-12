class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  // 🧩 Filter
  filter() {
    const queryObj = { ...this.queryString };
    const excludesFields = ["page", "sort", "limit", "fields", "keyword"];
    excludesFields.forEach((field) => delete queryObj[field]);

    // 🎯 Price Range Filtering (price=10-50)
    if (this.queryString.price) {
      const [min, max] = this.queryString.price.split("-").map(Number);
      queryObj.price = { $gte: min || 0, $lte: max || Number.MAX_SAFE_INTEGER };
    }

    // 🎯 Active Filter
    if (this.queryString.active !== undefined) {
      queryObj.active = this.queryString.active === "true";
    }

    // 🎯 Date Filtering (endDate=true → only upcoming)
    if (this.queryString.endDate === "true") {
      queryObj.endDate = { $gte: new Date() };
    }

    // ✅ Apply filters
    this.mongooseQuery = this.mongooseQuery.find(queryObj);

    return this;
  }

  // 🔽 Sort
  sort() {
    const sortBy = this.queryString.sort
      ? this.queryString.sort.split(",").join(" ")
      : "-createdAt _id"; // ✅ ثابت حتى لا تتكرر النتائج
    this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    return this;
  }

  // 🎚 Limit number of results
  dataLimit() {
    const limit = Number(this.queryString.limit) || 0;
    if (limit > 0) this.mongooseQuery = this.mongooseQuery.limit(limit);
    return this;
  }

  // ✂️ Limit fields
  limitfields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  // 🔍 Search
  search(modelName) {
    if (this.queryString.keyword) {
      const keyword = this.queryString.keyword.trim();
      const queryKeyword = {};

      if (modelName === "product") {
        queryKeyword.$or = [
          { "title.en": { $regex: keyword, $options: "i" } },
          { "title.ar": { $regex: keyword, $options: "i" } },
          { "description.en": { $regex: keyword, $options: "i" } },
          { "description.ar": { $regex: keyword, $options: "i" } },
        ];
      } else {
        queryKeyword.$or = [
          { name: { $regex: keyword, $options: "i" } },
        ];
      }

      this.mongooseQuery = this.mongooseQuery.find(queryKeyword);
    }
    return this;
  }

  // 📄 Pagination
  pagination(countDocuments) {
    // 🟡 -1 = إلغاء الباجينيشن وجلب الكل
    if (this.queryString.page != -1) {
      const page = Math.max(1, Number(this.queryString.page) || 1);
      const limit = Math.max(1, Number(this.queryString.limit) || 15);
      const skip = (page - 1) * limit;

      this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

      const paginationResult = {
        currentPage: page,
        limit,
        numberOfPages: Math.ceil(countDocuments / limit),
      };

      if (skip + limit < countDocuments) paginationResult.next = page + 1;
      if (skip > 0) paginationResult.prev = page - 1;

      this.paginationResult = paginationResult;

 
    } else {
      this.paginationResult = {
        currentPage: -1,
        limit: countDocuments,
        numberOfPages: 1,
      };
    }

    return this;
  }
}

module.exports = ApiFeatures;
