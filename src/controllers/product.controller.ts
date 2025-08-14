import { Request, Response } from "express";
import cloudinary from "cloudinary";
import { ENV } from "../config/env";
import { Product } from "../models/product.modal";


cloudinary.v2.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET,
    secure: true,
});

const uploadToCloudinary = (fileBuffer: Buffer) => {
    return new Promise<string>((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
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

export const getProduct = async (req: Request, res: Response) => {
}

export const getAllProduct = async (req: Request, res: Response) => {

}

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, price, description, category, rating, reviews } = req.body;

        if (!name || !price || !description || !category) {
            return res.status(400).json({ error: "All required fields must be provided" });
        }

        let imageUrl = null;
        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.buffer);
        }

        const product = await Product.create({
            name,
            price,
            description,
            category,
            image: imageUrl,
            rating: rating || 0,
            reviews: reviews || 0
        });

        res.status(201).json(product);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export const deleteProduct = async (req: Request, res: Response) => {

}

export const editProduct = async (req: Request, res: Response) => {

}


