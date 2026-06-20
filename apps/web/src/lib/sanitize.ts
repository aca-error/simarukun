/**
 * XSS Protection for SimaRukun
 * 
 * File ini bertanggung jawab untuk:
 * - Sanitize HTML input untuk mencegah XSS
 * - Sanitize object untuk form data
 * - Sanitize text untuk input teks biasa
 * 
 * Menggunakan DOMPurify untuk sanitasi HTML
 * 
 * @package SimaRukun
 * @subpackage Frontend/Lib
 */

import DOMPurify from 'dompurify';

/**
 * Sanitize HTML input untuk mencegah XSS
 * 
 * @param {string} dirty - Input yang akan disanitize
 * @returns {string} Input yang sudah aman
 * 
 * @example
 * sanitize('<script>alert(1)</script>') // Returns: '&lt;script&gt;alert(1)&lt;/script&gt;'
 * sanitize('<b>Test</b>') // Returns: '<b>Test</b>'
 */
export const sanitize = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'title', 'target'],
  });
};

/**
 * Sanitize object (untuk form data)
 * 
 * @param {T} obj - Object yang akan disanitize
 * @returns {T} Object yang sudah aman
 * 
 * @example
 * sanitizeObject({ name: '<script>Test</script>', email: 'test@example.com' })
 * // Returns: { name: '&lt;script&gt;Test&lt;/script&gt;', email: 'test@example.com' }
 */
export const sanitizeObject = <T>(obj: T): T => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  const sanitized: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof obj[key] === 'string') {
        sanitized[key] = sanitize(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitized[key] = sanitizeObject(obj[key]);
      } else {
        sanitized[key] = obj[key];
      }
    }
  }
  return sanitized;
};

/**
 * Sanitize untuk input teks biasa (non-HTML)
 * 
 * @param {string} dirty - Input yang akan disanitize
 * @returns {string} Input yang sudah aman (tanpa tag HTML)
 * 
 * @example
 * sanitizeText('<script>alert(1)</script>') // Returns: 'alert(1)'
 */
export const sanitizeText = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
  });
};

/**
 * Sanitize untuk input yang akan ditampilkan sebagai HTML
 * 
 * @param {string} dirty - Input yang akan disanitize
 * @returns {string} Input yang sudah aman untuk HTML
 */
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'title', 'target', 'class', 'id'],
  });
};

/**
 * Sanitize untuk input URL
 * 
 * @param {string} dirty - URL yang akan disanitize
 * @returns {string} URL yang sudah aman
 */
export const sanitizeUrl = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|ftp):\/\/|www\.|ftp\.)[^\s\/$.?#].[^\s]*$/i,
  });
};
