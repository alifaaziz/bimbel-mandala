import { jest } from '@jest/globals';
import { setupExpressMock } from '../../utils/jest.js';

const orderMock = { id: 1, packageId: 2, groupTypeId: 3, address: 'Jl. Test', status: 'pending' };
const ordersMock = [orderMock];

jest.unstable_mockModule('../../services/order.js', () => ({
  OrderService: {
    createOrder: jest.fn(() => Promise.resolve(orderMock)),
    updateOrderStatus: jest.fn(() => Promise.resolve()),
    getAllOrders: jest.fn(() => Promise.resolve(ordersMock)),
    getOrderById: jest.fn(() => Promise.resolve(orderMock)),
    deleteOrder: jest.fn(() => Promise.resolve()),
  },
}));

const { OrderController } = await import('../../controllers/order.js');
const { OrderService } = await import('../../services/order.js');

describe('OrderController', () => {
  describe('createOrder', () => {
    it('should create an order and return 201', async () => {
      OrderService.createOrder.mockResolvedValue(orderMock);

      const { req, res } = setupExpressMock({
        req: { body: { packageId: 2, groupTypeId: 3, address: 'Jl. Test' } },
        res: { locals: { user: { id: 123 } } },
      });

      await OrderController.createOrder(req, res);

      expect(OrderService.createOrder).toHaveBeenCalledWith(123, 2, 3, 'Jl. Test');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Order created successfully' });
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status and return 200', async () => {
      OrderService.updateOrderStatus.mockResolvedValue();

      const { req, res } = setupExpressMock({
        req: { body: { orderId: 1, status: 'paid' } },
      });

      await OrderController.updateOrderStatus(req, res);

      expect(OrderService.updateOrderStatus).toHaveBeenCalledWith(1, 'paid');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Order status updated successfully' });
    });
  });

  describe('getAllOrders', () => {
    it('should return all orders', async () => {
      OrderService.getAllOrders.mockResolvedValue(ordersMock);

      const { req, res } = setupExpressMock();

      await OrderController.getAllOrders(req, res);

      expect(OrderService.getAllOrders).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: ordersMock });
    });
  });

  describe('getOrderById', () => {
    it('should return order by id', async () => {
      OrderService.getOrderById.mockResolvedValue(orderMock);

      const { req, res } = setupExpressMock({
        req: { params: { id: 1 } },
      });

      await OrderController.getOrderById(req, res);

      expect(OrderService.getOrderById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: orderMock });
    });
  });

  describe('deleteOrder', () => {
    it('should delete order and return 200', async () => {
      OrderService.deleteOrder.mockResolvedValue();

      const { req, res } = setupExpressMock({
        req: { params: { id: 1 } },
      });

      await OrderController.deleteOrder(req, res);

      expect(OrderService.deleteOrder).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Order deleted successfully' });
    });
  });
});