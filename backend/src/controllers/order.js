import { OrderService } from '../services/order.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';

/**
 * Creates a new order.
 * 
 * @function createOrder
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Resolves with the created order.
 * @throws {Error} Throws an error if order creation fails.
 */
async function createOrder(req, res) {
    const userId = res.locals.user.id;
    const { packageId, groupTypeId, address, paymentId } = req.body;
    await OrderService.createOrder(userId, packageId, groupTypeId, address, paymentId);
    res.status(201).json({ message: 'Order created successfully'});
}

/**
 * Updates the status of an order.
 * 
 * @function updateOrderStatus
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Resolves with the updated order.
 * @throws {Error} Throws an error if order status update fails.
 */
async function updateOrderStatus(req, res) {
    const { orderId, status } = req.body;
    await OrderService.updateOrderStatus(orderId, status);
    res.status(200).json({ message: 'Order status updated successfully' });
}

/**
 * Gets pending orders.
 *
 * @function getPendingOrders
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Resolves with the list of orders.
 * @throws {Error} Throws an error if fetching orders fails.
 */
async function getPendingOrders(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const orders = await OrderService.getPendingOrders({ page, limit });
    res.status(200).json({ data: orders });
}

/**
 * Gets an order by ID.
 * 
 * @function getOrderById
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Resolves with the order.
 * @throws {Error} Throws an error if fetching the order fails.
 */
async function getOrderById(req, res) {
    const { id } = req.params;
    const order = await OrderService.getOrderById(id);
    res.status(200).json({ data: order });
}

/**
 * Deletes an order by ID.
 * 
 * @function deleteOrder
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Resolves with the deleted order.
 * @throws {Error} Throws an error if deleting the order fails.
 */
async function deleteOrder(req, res) {
    const { id } = req.params;
    await OrderService.deleteOrder(id);
    res.status(200).json({ message: 'Order deleted successfully' });
}

export const OrderController = {
    createOrder: asyncWrapper(createOrder),
    updateOrderStatus: asyncWrapper(updateOrderStatus),
    getPendingOrders: asyncWrapper(getPendingOrders),
    getOrderById: asyncWrapper(getOrderById),
    deleteOrder: asyncWrapper(deleteOrder)
};