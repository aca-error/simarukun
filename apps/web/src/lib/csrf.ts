/**
 * CSRF Token Handling for SimaRukun
 * 
 * File ini bertanggung jawab untuk:
 * - Mengambil CSRF token dari cookie
 * - Menyiapkan interceptor untuk Axios
 * 
 * @package SimaRukun
 * @subpackage Frontend/Lib
 */

/**
 * Ambil CSRF token dari cookie
 * @returns {string | null} CSRF token atau null jika tidak ditemukan
 */
export const getCsrfToken = (): string | null => {
  if (typeof document !== 'undefined') {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
    return cookieValue || null;
  }
  return null;
};

/**
 * Setup CSRF token ke header Axios
 * 
 * Fungsi ini akan:
 * 1. Mengambil CSRF token dari cookie
 * 2. Menambahkan token ke header default Axios
 * 3. Digunakan untuk semua request POST, PUT, PATCH, DELETE
 */
export const setupCsrfInterceptor = () => {
  if (typeof window !== 'undefined') {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      // Tambahkan ke header default Axios
      if (typeof window !== 'undefined' && window.axios) {
        window.axios.defaults.headers.common['X-XSRF-TOKEN'] = csrfToken;
      }
    }
  }
};

/**
 * Middleware untuk menambahkan CSRF token ke request
 * 
 * @param {Request} request - Request object
 * @returns {Request} Request dengan CSRF token
 */
export const withCsrfToken = (request: Request): Request => {
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    // Tambahkan header CSRF token
    if (typeof request === 'object' && request !== null) {
      (request as any).headers = {
        ...(request as any).headers,
        'X-XSRF-TOKEN': csrfToken,
      };
    }
  }
  return request;
};
