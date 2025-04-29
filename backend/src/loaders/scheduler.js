import cron from 'node-cron';
import { OrderService } from '../services/order.js';
import { AttendanceService } from '../services/attendance.js';
import { BimbelPackageService } from '../services/package.js';

const scheduleTasks = () => { 
  // Cron job untuk membatalkan pesanan pending lebih dari 2 hari
  cron.schedule('0 */1 * * *', async () => { // Pengujian setiap 1 jam
    try {
      await OrderService.cancelPendingOrders();
      console.log('Pending orders older than 2 days have been cancelled');
    } catch (error) {
      console.error('Error cancelling pending orders:', error);
    }
  });

  // Cron job untuk menandai kehadiran alpha pada jadwal yang terlewat
  cron.schedule('0 0 * * *', async () => { // Setiap hari pada pukul 00:00
    try {
      await AttendanceService.markAlphaForMissedSchedules();
      console.log('Alpha attendance marked for missed schedules');
    } catch (error) {
      console.error('Error marking alpha attendance:', error);
    }
  });

  // Cron job untuk mengupdate status bimbelPackage menjadi aktif
  cron.schedule('0 */1 * * *', async () => { // Pengujian setiap 1 jam
    try {
      await BimbelPackageService.updateBimbelPackageStatus();
      console.log('Bimbel package status has been checked and updated');
    } catch (error) {
      console.error('Error updating BimbelPackage status:', error);
    }
  });
};

export default scheduleTasks;