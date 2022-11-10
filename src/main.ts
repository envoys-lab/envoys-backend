import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ServerResponse } from 'http'
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  const configService = app.get(ConfigService)
  app.enableCors({
    origin: '*',
    credentials: true
  });

  app.use((_, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH')
    next();
  });


  await app.listen(configService.get<number>('server.port'))
}

bootstrap()
