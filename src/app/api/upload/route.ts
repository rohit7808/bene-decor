import { NextRequest, NextResponse } from "next/server";
import { uploadImageBuffer } from "@/lib/cloudinary";

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Maximum allowed file size (5MB in bytes)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * POST /api/upload
 * Handles image file uploads to Cloudinary folder "bene-decor".
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verify Cloudinary environment configuration
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: "Cloudinary credentials are not properly configured on the server." },
        { status: 500 }
      );
    }

    // 2. Parse FormData from incoming request
    const formData = await request.formData();
    const file = (formData.get("file") || formData.get("image")) as File | null;

    // 3. Validate file presence
    if (!file) {
      return NextResponse.json(
        { error: "No image file uploaded. Please select an image file." },
        { status: 400 }
      );
    }

    // 4. Validate MIME type (jpg, jpeg, png, webp)
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        {
          error:
            "Invalid file format. Only JPG, JPEG, PNG, and WEBP images are supported.",
        },
        { status: 400 }
      );
    }

    // 5. Validate file size (max 5MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit. Please upload a smaller image." },
        { status: 400 }
      );
    }

    // 6. Convert File to Node Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 7. Upload to Cloudinary folder "bene-decor"
    const uploadResult = await uploadImageBuffer(buffer, "bene-decor");

    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded successfully",
        url: uploadResult.url,
        public_id: uploadResult.public_id,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("POST /api/upload Error:", error);
    return NextResponse.json(
      { error: "An error occurred while uploading image to Cloudinary." },
      { status: 500 }
    );
  }
}
