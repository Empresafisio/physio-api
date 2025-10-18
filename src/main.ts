import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // frontend
    credentials: true,
  });
  await app.listen(3001);
}
bootstrap();
