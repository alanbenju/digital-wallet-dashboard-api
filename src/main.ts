import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule); // would use cors in production receiving only requests from our front
    app.enableCors({ origin: '*' });
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3001);
}
bootstrap();
