// src/controllers/products.controller.ts

import { Request, Response } from "express";
import * as Yup from "yup";
import ProductsModel from "@/models/products.model";

interface IPaginationQuery {
  page: number;
  limit: number;
  search?: string;
}

export default {
  async create(req: Request, res: Response) {
    try {
      const createValidationSchema = Yup.object({
        products: Yup.array()
          .of(
            Yup.object().shape({
              name: Yup.string().required(),
              price: Yup.number().required(),
              category: Yup.string().required(),
              description: Yup.string().required(),
              images: Yup.array().of(Yup.string()).required().min(1),
              qty: Yup.number().required().min(1),
              slug: Yup.string().required(),
            })
          )
          .required()
          .min(1),
      });

      await createValidationSchema.validate(req.body);

      const productsData = req.body.products;

      const result = await ProductsModel.insertMany(productsData);

      res.status(201).json({
        data: result,
        message: "Success create products",
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        res.status(400).json({
          data: error.errors,
          message: "Failed create products",
        });
        return;
      }

      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: "Failed create products",
      });
    }
  },

  async findAll(req: Request, res: Response) {
    try {
      const {
        limit = 10,
        page = 1,
        search = "",
      } = req.query as unknown as IPaginationQuery;

      const query = {};

      if (search) {
        Object.assign(query, {
          name: { $regex: search, $options: "i" },
        });
      }

      const result = await ProductsModel.find(query)
        .limit(+limit)
        .skip((+page - 1) * +limit)
        .sort({ createdAt: -1 })
        .populate("categoryId");

      const total = await ProductsModel.countDocuments(query);

      res.status(200).json({
        data: result,
        message: "Success get all products",
        page: +page,
        limit: +limit,
        total,
        totalPages: Math.ceil(total / +limit),
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: "Failed get all products",
      });
    }
  },

  async findOne(req: Request, res: Response) {
    try {
      const result = await ProductsModel.findById(req.params.id);
      res.status(200).json({
        data: result,
        message: "Success get one product",
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: "Failed get one product",
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const result = await ProductsModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json({
        data: result,
        message: "Success update product",
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: "Failed update product",
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const result = await ProductsModel.findByIdAndDelete(req.params.id);
      res.status(200).json({
        data: result,
        message: "Success delete product",
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: "Failed delete product",
      });
    }
  },
};
