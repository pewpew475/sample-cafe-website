import { NextRequest, NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';
import { imageStorage } from '@/services/imageStorage';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    // For now, we'll accept any Bearer token since this is admin-only functionality
    // In production, you should verify the Firebase ID token here
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    // Optional metadata (not currently used but available for future features)
    // const type = formData.get('type') as string; // 'product', 'category', 'general'
    // const id = formData.get('id') as string; // product/category ID
    // const name = formData.get('name') as string; // for general images



    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file using imageStorage service
    const validation = imageStorage.validateImageFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Check if Vercel Blob token is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'Vercel Blob Storage not configured. Please set BLOB_READ_WRITE_TOKEN environment variable.' },
        { status: 500 }
      );
    }

    // Generate unique filename
    const filename = imageStorage.generateFilename(file.name);

    try {
      // Upload to Vercel Blob Storage
      const blob = await put(filename, file, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      // Create result object
      const result = {
        url: blob.url,
        filename: filename,
        size: file.size,
        uploadedAt: new Date()
      };

      return NextResponse.json({
        success: true,
        data: result
      });

    } catch (blobError) {
      console.error('Vercel Blob upload error:', blobError);
      return NextResponse.json(
        { error: 'Failed to upload to Vercel Blob Storage' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check if user is authenticated
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'Image URL required' },
        { status: 400 }
      );
    }

    // Check if Vercel Blob token is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'Vercel Blob Storage not configured' },
        { status: 500 }
      );
    }

    // Delete file from Vercel Blob Storage
    try {
      await del(url, {
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
    } catch (error) {
      console.log('File not found or already deleted:', url);
      // Continue anyway - file might not exist
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    );
  }
}
