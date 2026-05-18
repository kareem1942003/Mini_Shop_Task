import { supabase } from '../../lib/supabase';
import { signToken } from '../../utils/jwt';
import { AppError } from '../../utils/AppError';
import { RegisterInput, LoginInput, ForgotPasswordInput } from './auth.schemas';

/**
 * Register a new user via Supabase Auth.
 * Role is always 'customer' — admin promotion is a separate operation.
 */
export async function registerUser(input: RegisterInput) {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        name: input.name,
        role: 'customer', // Hardcoded — never trust the client for role assignment
      },
    },
  });

  if (error) {
    throw new AppError(error.message, 400, 'REGISTER_ERROR');
  }

  if (!data.user) {
    throw new AppError('Registration failed. Please try again.', 500, 'REGISTER_ERROR');
  }

  const userPayload = {
    id: data.user.id,
    email: data.user.email ?? input.email,
    role: 'customer' as const,
  };

  const token = signToken(userPayload);

  return { user: userPayload, token };
}

/**
 * Login with email/password.
 * Fetches the profile to get the authoritative role from the database.
 */
export async function loginUser(input: LoginInput) {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (authError) {
    throw new AppError('Invalid email or password', 401, 'LOGIN_ERROR');
  }

  // Fetch profile for the authoritative role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('name, role')
    .eq('id', authData.user.id)
    .single();

  if (profileError || !profile) {
    throw new AppError('User profile not found. Please contact support.', 404, 'PROFILE_NOT_FOUND');
  }

  const userPayload = {
    id: authData.user.id,
    email: authData.user.email ?? input.email,
    role: profile.role as 'admin' | 'customer',
  };

  const token = signToken(userPayload);

  return {
    user: { ...userPayload, name: profile.name },
    token,
  };
}

/**
 * Send a password-reset email via Supabase.
 */
export async function resetPassword(input: ForgotPasswordInput) {
  const { error } = await supabase.auth.resetPasswordForEmail(input.email);
  if (error) {
    throw new AppError(error.message, 400, 'RESET_PASSWORD_ERROR');
  }
  return true;
}

/**
 * Fetch the full profile for the currently authenticated user.
 */
export async function getUserProfile(userId: string) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !profile) {
    throw new AppError('Profile not found', 404, 'PROFILE_NOT_FOUND');
  }

  return profile;
}
