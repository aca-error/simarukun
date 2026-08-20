/**
 * Jest Global Teardown
 * Digunakan untuk membersihkan database connection setelah tests selesai
 */

module.exports = async () => {
  console.log('Global teardown completed: Test execution finished');
};
