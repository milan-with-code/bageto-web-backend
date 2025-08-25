import { Request, Response } from "express";
import { Category } from "../models/category.model";

// Create Category (Admin Only)
export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, slug, description, image, banner } = req.body;

        const category = new Category({ name, slug, description, image, banner });
        await category.save();

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Categories
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find({ status: "active" }).sort("name");
        res.json({
            success: true,
            count: categories.length,
            data: categories,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Single Category by Slug
export const getCategoryBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const category = await Category.findOne({ slug, status: "active" });

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        res.json({ success: true, data: category });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Category (Admin Only)
export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const category = await Category.findByIdAndUpdate(id, updates, { new: true });

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        res.json({ success: true, message: "Category updated", data: category });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Category (Soft Delete - Premium)
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const category = await Category.findByIdAndUpdate(
            id,
            { status: "inactive" },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        res.json({ success: true, message: "Category removed (soft delete)", data: category });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
