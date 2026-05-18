import { FastifyReply, FastifyRequest } from 'fastify';
import { successResponse } from '../../utils/response';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from './orders.services';
import {
  CreateOrderInput,
  OrderQuery,
  OrderParams,
  UpdateOrderStatusInput,
} from './orders.schemas';

export async function createOrderHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as CreateOrderInput;
  const order = await createOrder(request.user.id, body);
  return reply.status(201).send(successResponse(order, 'Order created'));
}

export async function myOrdersHandler(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as OrderQuery;
  const result = await getMyOrders(request.user.id, query);
  return reply.send(successResponse(result, 'Your orders retrieved'));
}

export async function allOrdersHandler(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as OrderQuery;
  const result = await getAllOrders(query);
  return reply.send(successResponse(result, 'All orders retrieved'));
}

export async function updateOrderStatusHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as OrderParams;
  const { status } = request.body as UpdateOrderStatusInput;
  const order = await updateOrderStatus(id, status);
  return reply.send(successResponse(order, 'Order status updated'));
}
