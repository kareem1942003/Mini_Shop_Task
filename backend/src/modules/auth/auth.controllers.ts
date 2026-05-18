import { FastifyReply, FastifyRequest } from 'fastify';
import { registerUser, loginUser, resetPassword, getUserProfile } from './auth.services';
import { successResponse } from '../../utils/response';
import { RegisterInput, LoginInput, ForgotPasswordInput } from './auth.schemas';

export async function registerHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as RegisterInput;
  const result = await registerUser(body);
  return reply.status(201).send(successResponse(result, 'User registered successfully'));
}

export async function loginHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as LoginInput;
  const result = await loginUser(body);
  return reply.status(200).send(successResponse(result, 'Login successful'));
}

export async function forgotPasswordHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as ForgotPasswordInput;
  await resetPassword(body);
  return reply.status(200).send(successResponse(null, 'Password reset email sent successfully'));
}

export async function meHandler(request: FastifyRequest, reply: FastifyReply) {
  const profile = await getUserProfile(request.user.id);
  return reply.status(200).send(successResponse(profile, 'Profile retrieved successfully'));
}
