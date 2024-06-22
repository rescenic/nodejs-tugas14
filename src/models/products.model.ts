// src/models/products.models.ts

import mongoose from "mongoose";
import * as Yup from "yup";

const Schema = mongoose.Schema;

const createValidationSchema = Yup.object({
  products: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required(),
        price: Yup.number().required(),
        categoryId: Yup.string().required(),
        description: Yup.string().required(),
        images: Yup.array().of(Yup.string()).required().min(1),
        qty: Yup.number().required().min(1),
        slug: Yup.string().required(),
      })
    )
    .required()
    .min(1),
});


const ProductsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

const ProductsModel = mongoose.model("Products", ProductsSchema);

export { createValidationSchema };

export default ProductsModel;
