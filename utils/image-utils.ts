/**
 * Utilities for handling and validating image URLs
 */

// Default fallback image if URL is invalid
const DEFAULT_IMAGE = 'https://via.placeholder.com/800x600?text=Project+Image';

/**
 * Validates an image URL and returns a safe URL for Next.js Image component
 * 
 * @param url The image URL to validate
 * @returns A valid image URL or fallback
 */
export function getSafeImageUrl(url?: string): string {
  if (!url || url.trim() === '') return DEFAULT_IMAGE;
  
  try {
    // Handle Google redirects by extracting the actual URL
    if (url.includes('google.com/url') && url.includes('&url=')) {
      const urlParam = new URLSearchParams(url.split('?')[1]).get('url');
      if (urlParam) {
        // Decode the URL parameter
        return decodeURIComponent(urlParam);
      }
    }
    
    // Check if URL is valid by trying to construct URL object
    new URL(url);
    return url;
  } catch (error) {
    console.warn(`Invalid image URL: ${url}`, error);
    return DEFAULT_IMAGE;
  }
}

/**
 * Checks if a string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  if (!url || url.trim() === '') return false;
  
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}
