import { FastifyReply, FastifyRequest } from 'fastify';
import { successResponse } from '../../utils/response';
import { AppError } from '../../utils/AppError';
import {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from './products.services';
import {
  ProductQuery,
  ProductParams,
  CreateProductInput,
  UpdateProductInput,
} from './products.schemas';

export async function listProductsHandler(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as ProductQuery;
  const result = await listProducts(query);
  return reply.send(successResponse(result, 'Products retrieved'));
}

export async function getProductHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as ProductParams;
  const product = await getProductById(id);
  return reply.send(successResponse(product, 'Product retrieved'));
}

export async function createProductHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as CreateProductInput;
  const product = await createProduct(body);
  return reply.status(201).send(successResponse(product, 'Product created'));
}

export async function updateProductHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as ProductParams;
  const body = request.body as UpdateProductInput;
  const product = await updateProduct(id, body);
  return reply.send(successResponse(product, 'Product updated'));
}

export async function deleteProductHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as ProductParams;
  await deleteProduct(id);
  return reply.send(successResponse(null, 'Product deleted'));
}

export async function uploadImageHandler(request: FastifyRequest, reply: FastifyReply) {
  const file = await request.file();

  if (!file) {
    throw new AppError('No image file provided', 400);
  }

  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedMimes.includes(file.mimetype)) {
    throw new AppError('Only JPEG, PNG, and WebP images are allowed', 400);
  }

  const buffer = await file.toBuffer();
  const maxSize = 5 * 1024 * 1024; 
  if (buffer.length > maxSize) {
    throw new AppError('Image must be smaller than 5MB', 400);
  }

  const url = await uploadProductImage(buffer, file.filename, file.mimetype);
  return reply.status(201).send(successResponse({ url }, 'Image uploaded'));
}
