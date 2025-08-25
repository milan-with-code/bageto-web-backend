import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
    name: string;
    slug: string;
    description: string;
    image: string;
    banner?: string;
    productCount?: number;
    status: "active" | "inactive";
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            default: "",
            maxlength: 500,
        },
        image: {
            type: String,
            required: true,
        },
        banner: {
            type: String,
        },
        productCount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    { timestamps: true }
);

export const Category = mongoose.model<ICategory>("Category", CategorySchema);
