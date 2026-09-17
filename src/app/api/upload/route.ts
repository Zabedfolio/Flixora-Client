import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = (formData.get("file") || formData.get("image")) as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = buffer.toString("base64");
    const mimeType = file.type || "image/png";

    const apiKey =
      process.env.IMGBB_API_KEY ||
      process.env.NEXT_PUBLIC_IMGBB_API_KEY ||
      "11a68652db5672d694741402f649a797";

    if (apiKey) {
      try {
        const body = new URLSearchParams();
        body.append("image", base64String);

        const imgbbRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: body.toString(),
          }
        );

        if (imgbbRes.ok) {
          const imgbbData = await imgbbRes.json();
          const imageUrl =
            imgbbData.data?.display_url || imgbbData.data?.url;
          if (imageUrl) {
            return NextResponse.json({
              success: true,
              url: imageUrl,
              display_url: imageUrl,
            });
          }
        }
      } catch (err) {
        console.warn("ImgBB API upload failed, falling back to base64 Data URL:", err);
      }
    }

    // Fallback: return base64 Data URL if ImgBB API fails or key is missing
    const dataUrl = `data:${mimeType};base64,${base64String}`;
    return NextResponse.json({
      success: true,
      url: dataUrl,
    });
  } catch (error: any) {
    console.error("Upload API route error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process upload" },
      { status: 500 }
    );
  }
}
