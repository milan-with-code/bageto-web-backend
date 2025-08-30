import { Request, Response } from "express";
import { Product } from "../models/product.model";
import cloudinary from "../utils/cloudinary";


const uploadToCloudinary = (fileBuffer: Buffer) => {
    return new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
                if (error) return reject(error);
                if (result?.secure_url) return resolve(result.secure_url);
                reject(new Error("No image URL returned"));
            }
        );
        stream.end(fileBuffer);
    });
};

export const getAllProduct = async (req: Request, res: Response) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
}

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const products = await Product.findById(id);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
}

export const createProduct = async (req: Request, res: Response) => {
    try {
        const {
            name,
            price,
            description,
            category,
            originalPrice,
            features,
            specifications,
            colors,
            sizes,
            reviews
        } = req.body;

        if (!name || !price || !description || !category) {
            return res.status(400).json({
                success: false,
                error: "All required fields (name, price, description, category) must be provided",
            });
        }

        if (isNaN(price) || Number(price) <= 0) {
            return res.status(400).json({
                success: false,
                error: "Price must be a valid positive number",
            });
        }

        const validCategories = ["all", "bags", "wallets", "belts", "jackets", "accessories"];
        if (!validCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                error: `Invalid category. Valid categories are: ${validCategories.join(", ")}`,
            });
        }

        let imageUrls: string[] = [];
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            try {
                for (const file of req.files) {
                    const url = await uploadToCloudinary(file.buffer);
                    imageUrls.push(url);
                }
            } catch (err) {
                return res.status(500).json({
                    success: false,
                    error: "Image upload failed. Please try again.",
                });
            }
        }
        const product = await Product.create({
            name,
            price,
            originalPrice: originalPrice || null,
            description,
            category,
            images: imageUrls,
            features: features || [],
            specifications: specifications || {},
            colors: colors || [],
            sizes: sizes || [],
            rating: 0,
            reviewsCount: 0,
            inStock: true,
            stock: req.body.stock || 0,
            reviews: reviews,
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete product" });
    }

}

export const editProduct = async (req: Request, res: Response) => {
}

export const getNewArrivals = async (req: Request, res: Response) => {
    try {
        const days = 30;
        const dateThreshold = new Date();
        dateThreshold.setDate(dateThreshold.getDate() - days);

        const products = await Product.find({
            isNewArrival: true
        }).sort({ createdAt: -1 });


        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {
        console.error("Error fetching new arrivals:", error);
        res.status(500).json({ success: false, error: "Failed to fetch new arrivals" });
    }
};

export const getBestSellers = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;
        const bestSellers = await Product.find()
            .sort({ soldCount: -1 })
            .limit(limit);

        res.status(200).json({ success: true, data: bestSellers });
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to fetch best sellers" });
    }
};
