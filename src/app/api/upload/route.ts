import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
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

    // Generate unique filename
    const filename = imageStorage.generateFilename(file.name);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, that's fine
    }

    // Write file to uploads directory
    const filePath = join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    // Create result object
    const result = {
      url: imageStorage.getImageUrl(filename),
      filename: filename,
      size: file.size,
      uploadedAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: result
    });

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
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        { error: 'Image filename required' },
        { status: 400 }
      );
    }

    // Delete file from uploads directory
    const filePath = join(process.cwd(), 'public', 'uploads', filename);
    try {
      const fs = await import('fs/promises');
      await fs.unlink(filePath);
    } catch (error) {
      // File might not exist, that's fine
      console.log('File not found or already deleted:', filename);
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
