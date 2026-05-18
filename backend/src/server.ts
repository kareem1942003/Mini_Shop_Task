import { buildApp } from './app';
import { env } from './config/env';

const start = async () => {
  const app = buildApp();
  
  try {
    const port = parseInt(env.PORT, 10);
    await app.listen({ port, host: '0.0.0.0' });
    app.log.info(`🚀 Server listening on http://0.0.0.0:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
