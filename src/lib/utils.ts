import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (hours: number) => {
  return `${hours} Jam`;
};

export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch (e) {
    return dateString;
  }
};

export const openDocument = (url: string | null | undefined, filename = 'dokumen') => {
  if (!url) return;
  
  const isBase64 = url.startsWith('data:');
  const isBlob = url.startsWith('blob:');

  if (isBase64 || isBlob) {
    let mimeType = 'application/pdf';
    let ext = 'pdf';

    if (isBase64) {
      const match = url.match(/^data:([^;]+);/);
      if (match) {
        mimeType = match[1];
        ext = mimeType.split('/')[1] || 'pdf';
      }
    } else if (isBlob) {
      // For blobs, we cannot easily read MIME, we'll default to pdf or common extension
      ext = 'pdf';
    }

    // Clean extension name if it has image flags
    if (ext === 'jpeg') ext = 'jpg';
    if (ext === 'svg+xml') ext = 'svg';

    const link = document.createElement('a');
    link.href = url;
    
    // Ensure filename ends with proper extension
    const cleanFilename = filename.toLowerCase().endsWith('.' + ext) 
      ? filename 
      : `${filename}.${ext}`;
      
    link.download = cleanFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // Remote URL (e.g. Cloudinary): open in a new tab so the browser's PDF
    // viewer renders it. No `fl_attachment` is injected (Cloudinary rejects it
    // for untrusted accounts) and no `download` attribute is set (browsers
    // ignore it for cross-origin URLs anyway).
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
