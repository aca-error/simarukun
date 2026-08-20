/**
 * Jest Global Setup
 * Digunakan untuk setup database connection sebelum menjalankan tests
 */

module.exports = async () => {
  // Setup environment variables for testing
  process.env.DB_HOST = process.env.DB_HOST || 'localhost';
  process.env.DB_PORT = process.env.DB_PORT || '5432';
  process.env.DB_USERNAME = process.env.DB_USERNAME || 'test';
  process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'test';
  process.env.DB_NAME = process.env.DB_NAME || 'simarukun_test';
  
  console.log('Global setup completed: Environment variables configured');
  console.log(`Database: ${process.env.DB_NAME}@${process.env.DB_HOST}:${process.env.DB_PORT}`);
};
