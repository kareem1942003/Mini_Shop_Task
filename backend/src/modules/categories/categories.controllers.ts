import { FastifyReply, FastifyRequest } from 'fastify';
import { successResponse } from '../../utils/response';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from './categories.services';
import { CreateCategoryInput, UpdateCategoryInput, CategoryParams } from './categories.schemas';

export async function listCategoriesHandler(_request: FastifyRequest, reply: FastifyReply) {
  const categories = await getAllCategories();
  return reply.send(successResponse(categories, 'Categories retrieved'));
}

export async function getCategoryHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as CategoryParams;
  const category = await getCategoryById(id);
  return reply.send(successResponse(category, 'Category retrieved'));
}

export async function createCategoryHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as CreateCategoryInput;
  const category = await createCategory(body);
  return reply.status(201).send(successResponse(category, 'Category created'));
}

export async function updateCategoryHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as CategoryParams;
  const body = request.body as UpdateCategoryInput;
  const category = await updateCategory(id, body);
  return reply.send(successResponse(category, 'Category updated'));
}

export async function deleteCategoryHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as CategoryParams;
  await deleteCategory(id);
  return reply.send(successResponse(null, 'Category deleted'));
}
