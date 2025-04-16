import cron from 'node-cron';
import { OrderService } from '../services/order.js';
import { markAlphaForMissedSchedules } from '../services/attendance.js';

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
      await markAlphaForMissedSchedules();
      console.log('Alpha attendance marked for missed schedules');
    } catch (error) {
      console.error('Error marking alpha attendance:', error);
    }
  });
};

export default scheduleTasks;