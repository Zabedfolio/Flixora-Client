import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { image } = await request.json(); // base64 encoded image string
    if (!image) {
      return NextResponse.json({ error: 'image base64 string is required' }, { status: 400 });
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'IMGBB_API_KEY is not configured on the client server' }, { status: 500 });
    }

    // Strip out base64 prefix
    let base64Data = image;
    if (image.includes(';base64,')) {
      base64Data = image.split(';base64,')[1];
    }

    // Approximate size check (2MB)
    const approximateSizeBytes = (base64Data.length * 3) / 4;
    const limitSizeBytes = 2 * 1024 * 1024;
    if (approximateSizeBytes > limitSizeBytes) {
      return NextResponse.json({ error: 'Image size exceeds the 2MB limit' }, { status: 400 });
    }

    // Upload to ImgBB
    const body = new URLSearchParams();
    body.append('image', base64Data);

    const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    if (!imgbbRes.ok) {
      const err = await imgbbRes.text();
      throw new Error(`ImgBB API responded with status ${imgbbRes.status}: ${err}`);
    }

    const resData = await imgbbRes.json();
    const finalUrl = resData?.data?.url;
    
    if (!finalUrl) {
      return NextResponse.json({ error: 'Failed to receive image URL from ImgBB' }, { status: 500 });
    }

    return NextResponse.json({ url: finalUrl });
  } catch (error: any) {
    console.error('Error uploading image to ImgBB:', error.message);
    return NextResponse.json({ error: error.message || 'Image upload failed' }, { status: 500 });
  }
}
