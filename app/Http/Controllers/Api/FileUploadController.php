<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class FileUploadController extends Controller
{
    /**
     * Upload file to S3 and return the path
     */
    public function uploadImage(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $file = $request->file('file');
            
            // Generate a unique filename
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            
            // Store in S3 (DigitalOcean Spaces) with public visibility
            $path = Storage::disk('s3')->putFileAs('posts', $file, $filename, 'public');
            
            // Build the full URL for DigitalOcean Spaces
            $bucket = config('filesystems.disks.s3.bucket');
            $endpoint = config('filesystems.disks.s3.endpoint');
            
            if ($endpoint) {
                // For DigitalOcean Spaces - remove bucket from endpoint if it's already there
                $baseUrl = str_replace('/' . $bucket, '', $endpoint);
                $fullUrl = $baseUrl . '/' . $bucket . '/' . $path;
            } else {
                // For regular AWS S3
                $region = config('filesystems.disks.s3.region');
                $fullUrl = "https://{$bucket}.s3.{$region}.amazonaws.com/{$path}";
            }

            return response()->json([
                'success' => true,
                'message' => 'File uploaded successfully',
                'data' => [
                    'path' => $path,
                    'url' => $fullUrl,
                    'filename' => $filename
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'File upload failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete file from S3
     */
    public function deleteImage(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'path' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $path = $request->input('path');
            
            // Delete from S3
            Storage::disk('s3')->delete($path);

            return response()->json([
                'success' => true,
                'message' => 'File deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'File deletion failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
