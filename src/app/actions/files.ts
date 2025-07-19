import { getAuthToken } from "@/utils/helpers";
import { v4 as uuid } from "uuid";

export const uploadFile = async (file: File, isMain: boolean) => {
  try {
    const authToken = getAuthToken();
    if (!authToken) {
      return { success: false, errors: ['Authentication token not found.'] };
    }

    const fileUuid = uuid();

    // Step 1: Create file record
    const payload = {
      type: file.type,
      fileSize: file.size,
      targetType: isMain ? "PRODUCT_MAIN_IMG" : "PRODUCT",
      fileUuid: fileUuid
    };

    console.log('Creating file record with payload:', payload);

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/files`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create file record';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.errors?.[0] || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      
      console.error('File record creation failed:', errorMessage);
      return {
        success: false,
        errors: [errorMessage],
      };
    }

    const fileRecord = await response.json();
    console.log('File record created:', fileRecord);

    // Step 2: Upload file binary to the provided link
    const uploadResponse = await fetch(fileRecord.fileAccessLink.link, {
      method: 'PUT',
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': file.type,
      },
      body: file, // Send the file binary directly
    });

    if (!uploadResponse.ok) {
      console.error('File upload failed:', uploadResponse.status, uploadResponse.statusText);
      return {
        success: false,
        errors: [`Failed to upload file: ${uploadResponse.status} ${uploadResponse.statusText}`],
      };
    }

    console.log('File upload successful');
    return {
      success: true,
      data: {
        ...fileRecord,
        fileUuid: fileUuid,
      },
      errors: [],
    };
  } catch (error: any) {
    console.error('Upload error:', error);
    return {
      success: false,
      errors: [error.message],
    };
  }
};

export const getFiles = async (page: number = 0, size: number = 20) => {
  try {
    const authToken = getAuthToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/files?page=${page}&size=${size}`, {
      headers,
    });

    if (!response.ok) {
      return {
        success: false,
        errors: ['Failed to fetch files'],
        data: null,
      };
    }

    const data = await response.json();
    return {
      success: true,
      errors: [],
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      errors: [error.message],
      data: null,
    };
  }
}; 