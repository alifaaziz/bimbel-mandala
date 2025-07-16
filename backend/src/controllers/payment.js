import * as PaymentService from '../services/payment.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';

/**
 * Create a new payment
 */
async function createPayment(req, res) {
  const payment = await PaymentService.createPayment(req.body);
  res.status(201).json({ data: payment });
}

/**
 * Get all payments
 */
async function getPayments(_req, res) {
  const payments = await PaymentService.getPayments();
  res.status(200).json({ data: payments });
}

/**
 * Update payment by ID
 */
async function updatePayment(req, res) {
  const payment = await PaymentService.updatePayment(req.params.id, req.body);
  res.status(200).json({ data: payment });
}

/**
 * Delete payment by ID
 */
async function deletePayment(req, res) {
  await PaymentService.deletePayment(req.params.id);
  res.status(200).json({ message: 'Payment deleted successfully' });
}

export const PaymentController = {
  createPayment: asyncWrapper(createPayment),
  getPayments: asyncWrapper(getPayments),
  updatePayment: asyncWrapper(updatePayment),
  deletePayment: asyncWrapper(deletePayment),
};