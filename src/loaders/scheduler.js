import cron from 'node-cron';
import { OrderService } from '../services/order.js';

const scheduleTasks = () => { 
cron.schedule('0 */8 * * *', async () => { // pengujian 8 jam sekali
    try {
      await OrderService.cancelPendingOrders();
      console.log('Pending orders older than 2 days have been cancelled');
    } catch (error) {
      console.error('Error cancelling pending orders:', error);
    }
  });
};

export default scheduleTasks;