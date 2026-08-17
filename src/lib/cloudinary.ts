const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export const uploadToCloudinary = async (file: File) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    console.warn('Cloudinary config missing. Reading file as Base64 Data URL.');
    try {
      return await readFileAsBase64(file);
    } catch (e) {
      console.error('Failed to read file as base64:', e);
      return URL.createObjectURL(file);
    }
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  // Cloudinary can otherwise classify a PDF as an image. Uploading it as `raw`
  // preserves the original PDF response headers when it is downloaded later.
  const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
  formData.append('resource_type', isPdf ? 'raw' : 'auto');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${isPdf ? 'raw' : 'auto'}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    const data = await response.json();
    if (!response.ok || !data.secure_url) {
      throw new Error(data.error?.message || 'Cloudinary tidak mengembalikan URL berkas.');
    }
    return data.secure_url;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};
