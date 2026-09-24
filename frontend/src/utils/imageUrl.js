/**
 * Helper to resolve the complete URL for an image (handling relative storage paths,
 * localhost URLs from development, external URLs, base64 data URLs, and fallbacks).
 */
export const getFullImageUrl = (url, fallbackUrl = '') => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallbackUrl || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80';
  }

  let cleanUrl = url.trim();

  // If the image was saved with localhost/127.0.0.1 in development,
  // replace it with the configured backend URL in production
  const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/api\/?$/, '').replace(/\/+$/, '');
  
  if (cleanUrl.match(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i)) {
    if (apiBase) {
      cleanUrl = cleanUrl.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, apiBase);
      return cleanUrl;
    }
  }

  // If already absolute HTTP(S) or Data URL / Blob URL, return as is
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('data:') || cleanUrl.startsWith('blob:')) {
    return cleanUrl;
  }

  // If relative path like '/storage/...' or 'storage/...'
  if (cleanUrl.startsWith('/')) {
    return apiBase ? `${apiBase}${cleanUrl}` : cleanUrl;
  }

  return apiBase ? `${apiBase}/${cleanUrl}` : `/${cleanUrl}`;
};
