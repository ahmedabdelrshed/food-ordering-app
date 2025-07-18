import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

// Define the type for the form data file
type FormDataFile = Blob & {
    name?: string; // Optional: Some browsers may add this
};

export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get('file') as FormDataFile | null;
    if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }
    const pathName = formData.get("pathName") as string;
    try {
        const fileBuffer = await file.arrayBuffer();
        const base64File = Buffer.from(fileBuffer).toString("base64");

        const uploadResponse = await cloudinary.uploader.upload(
            `data:${file.type};base64,${base64File}`,
            {
                folder: pathName,
                transformation: [
                    { width: 200, height: 200, crop: "fill", gravity: "face" },
                ],
            }
        );
        return NextResponse.json({ url: uploadResponse.secure_url });
    } catch (error) {
        console.error("Error uploading file:", error);
        return new Response("Error uploading file", { status: 500 });

    }

}