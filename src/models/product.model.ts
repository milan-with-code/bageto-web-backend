import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
    name: string;
    rating: number;
    date?: Date;
    title: string;
    comment?: string;
    verified?: boolean;
}

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    images: string[];
    features?: string[];
    specifications?: {
        dimensions?: string;
        weight?: string;
        material?: string;
        lining?: string;
        hardware?: string;
        closure?: string;
    };
    rating: number;
    reviewsCount: number;
    reviews: IReview[];
    inStock: boolean;
    stock: number;
    colors?: string[];
    sizes?: string[];
}

const reviewSchema = new Schema<IReview>(
    {
        name: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        date: { type: Date, default: Date.now },
        title: { type: String, required: true },
        comment: { type: String },
        verified: { type: Boolean, default: false },
    },
    { _id: false }
);

const productSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        originalPrice: { type: Number },
        category: {
            type: String,
            required: true,
            enum: ["all", "bags", "wallets", "belts", "jackets", "accessories"],
        },
        images: [{ type: String, required: true }],
        features: [{ type: String }],
        specifications: {
            dimensions: String,
            weight: String,
            material: String,
            lining: String,
            hardware: String,
            closure: String,
        },
        rating: { type: Number, default: 0 },
        reviewsCount: { type: Number, default: 0 },
        reviews: [reviewSchema],
        inStock: { type: Boolean, default: true },
        stock: { type: Number, default: 0 },
        colors: [{ type: String }],
        sizes: [{ type: String }],
    },
    { timestamps: true }
);

productSchema.pre("save", function (next) {
    if (this.reviews && this.reviews.length > 0) {
        this.reviewsCount = this.reviews.length;
        const avg =
            this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
        this.rating = parseFloat(avg.toFixed(1));
    } else {
        this.reviewsCount = 0;
        this.rating = 0;
    }
    next();
});

export const Product = mongoose.model<IProduct>("Product", productSchema);
