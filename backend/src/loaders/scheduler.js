import cron from 'node-cron';
import { OrderService } from '../services/order.js';
import { AttendanceService } from '../services/attendance.js';
import { BimbelPackageService } from '../services/package.js';
import { NotificationService } from '../services/notification.js';
import fs from 'fs/promises';
import path from 'path';

const TEMP_DIR = path.resolve('public', 'temp');

async function deleteAllTempFiles() {
  try {
    const files = await fs.readdir(TEMP_DIR);
    await Promise.all(
      files.map(file => fs.unlink(path.join(TEMP_DIR, file)))
    );
    console.log('All files in public/temp have been deleted');
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Error deleting files in public/temp:', error);
    }
  }
}

const scheduleTasks = async () => { 
  try {
    await OrderService.cancelPendingOrders();
  } catch (error) {
    console.error('Error cancelling pending orders (initial run):', error);
  }

  try {
    await AttendanceService.markAlphaForMissedSchedules();
    console.log('Alpha attendance marked for missed schedules (initial run)');
  } catch (error) {
    console.error('Error marking alpha attendance (initial run):', error);
  }

  try {
    await BimbelPackageService.updateBimbelPackageStatus();
    console.log('Bimbel package status has been checked and updated (initial run)');
  } catch (error) {
    console.error('Error updating BimbelPackage status (initial run):', error);
  }

  try {
    await NotificationService.deleteNotification();
  } catch (error) {
    console.error('Error deleting old notifications (initial run):', error);
  }

  await deleteAllTempFiles();

  cron.schedule('0 8 * * *', async () => { // Setiap hari jam 8 pagi
    try {
      await OrderService.cancelPendingOrders();
      console.log('Pending orders older than 2 days have been cancelled');
    } catch (error) {
      console.error('Error cancelling pending orders:', error);
    }
  });

  cron.schedule('0 8 * * *', async () => { // Setiap hari jam 8 pagi
    try {
      await AttendanceService.markAlphaForMissedSchedules();
      console.log('Alpha attendance marked for missed schedules');
    } catch (error) {
      console.error('Error marking alpha attendance:', error);
    }
  });

  cron.schedule('0 */8 * * *', async () => { // Setiap 8 jam
    try {
      await BimbelPackageService.updateBimbelPackageStatus();
      console.log('Bimbel package status has been checked and updated');
    } catch (error) {
      console.error('Error updating BimbelPackage status:', error);
    }
  });

  cron.schedule('0 8 * * *', async () => { // Setiap hari jam 8 pagi
    try {
      await NotificationService.deleteNotification();
    } catch (error) {
      console.error('Error deleting old notifications:', error);
    }
  });

  cron.schedule('0 8 * * *', async () => { // Setiap hari jam 8 pagi
    await deleteAllTempFiles();
  });
};

export default scheduleTasks;