#!/bin/bash

# Stop on errors
set -e

echo "Initializing monorepo root..."
npm init -y
npm pkg set workspaces.0="mobile" workspaces.1="backend" workspaces.2="dashboard"

echo "Initializing dashboard..."
npx --yes create-vite@latest dashboard --no-interactive --template react-ts
cd dashboard
npm install @reduxjs/toolkit react-redux tailwindcss postcss autoprefixer
npx tailwindcss init -p
cd ..

echo "Initializing backend..."
mkdir backend
cd backend
npm init -y
npm install fastify @supabase/supabase-js zod jsonwebtoken dotenv cors
npm install -D typescript @types/node @types/jsonwebtoken @types/cors tsx
npx tsc --init
cd ..

echo "Initializing mobile..."
npx --yes create-expo-app@latest mobile -t expo-template-blank-typescript --yes
cd mobile
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar expo-secure-store
npm install @reduxjs/toolkit react-redux nativewind tailwindcss react-native-reanimated
cd ..

echo "Installing monorepo tools..."
npm install -D eslint prettier typescript
