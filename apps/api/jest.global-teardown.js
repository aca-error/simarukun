/**
 * Jest Global Teardown
 * Digunakan untuk membersihkan database connection setelah tests selesai
 */

module.exports = async () => {
  // Close the database connection
  if (global.__TEST_MODULE__) {
    await global.__TEST_MODULE__.close();
    console.log('Global teardown completed: Database connection closed');
  }
};
