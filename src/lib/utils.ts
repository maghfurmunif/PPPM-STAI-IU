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

const isPdfDocument = (url: string, filename: string) =>
  /^data:application\/pdf[;,]/i.test(url) ||
  /\.pdf(?:[?#]|$)/i.test(url) ||
  /(?:proposal|laporan|skripsi|rkl|lpk|naskah|revisi|surat|transkrip|krs|ktm|spk)/i.test(filename);

const cloudinaryDownloadUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith('res.cloudinary.com')) return url;

    // `fl_attachment` asks Cloudinary to send a real file download instead of
    // asking the browser's PDF viewer to render a potentially incompatible URL.
    parsed.pathname = parsed.pathname.replace(/\/upload\/(?!fl_attachment\/)/, '/upload/fl_attachment/');
    return parsed.toString();
  } catch {
    return url;
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
    const isPdf = isPdfDocument(url, filename);
    const link = document.createElement('a');
    link.href = isPdf ? cloudinaryDownloadUrl(url) : url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    if (isPdf) link.download = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
