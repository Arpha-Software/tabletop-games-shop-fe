import { getAuthToken } from "@/utils/helpers";

export const uploadFile = async (file: File, targetId: number, targetType: string = "PRODUCT") => {
  try {
    const authToken = getAuthToken();
    if (!authToken) {
      return { success: false, errors: ['Authentication token not found.'] };
    }

    // Convert file to base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
    });

    // Based on the existing file structure from the GET response
    const payload = {
      fileName: `products/${targetId}/${file.name}`,
      fileSize: file.size,
      targetId: targetId,
      targetType: targetType === "PRODUCT" ? "PRODUCT_MAIN_IMG" : targetType,
      fileType: file.type,
      fileData: base64
    };

    console.log('Uploading file with payload:', {
      name: file.name,
      size: file.size,
      type: file.type,
      payload
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/files`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to upload file';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.errors?.[0] || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      
      console.error('Upload failed:', errorMessage);
      return {
        success: false,
        errors: [errorMessage],
      };
    }

    const data = await response.json();
    console.log('Upload successful:', data);
    return {
      success: true,
      data,
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