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

    const apiKey =
      process.env.IMGBB_API_KEY ||
      process.env.NEXT_PUBLIC_IMGBB_API_KEY ||
      "11a68652db5672d694741402f649a797";

    // Direct ImgBB API Upload
    if (apiKey) {
      try {
        const imgbbFormData = new FormData();
        imgbbFormData.append("image", file);

        const imgbbRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          {
            method: "POST",
            body: imgbbFormData,
          }
        );

        if (imgbbRes.ok) {
          const imgbbData = await imgbbRes.json();
          const imageUrl =
            imgbbData.data?.url || imgbbData.data?.display_url;
          if (imageUrl) {
            return NextResponse.json({
              success: true,
              url: imageUrl,
              display_url: imageUrl,
              delete_url: imgbbData.data?.delete_url,
            });
          }
        } else {
          const errText = await imgbbRes.text().catch(() => "");
          console.warn("ImgBB API returned non-OK status:", imgbbRes.status, errText);
        }
      } catch (err: any) {
        console.warn("ImgBB API upload exception:", err.message);
      }
    }

    // Base64 Data URL Fallback
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = buffer.toString("base64");
    const mimeType = file.type || "image/png";
    const dataUrl = `data:${mimeType};base64,${base64String}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
    });
  } catch (error: any) {
    console.error("Upload API route error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process image upload" },
      { status: 500 }
    );
  }
}
