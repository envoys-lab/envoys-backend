import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  const configService = app.get(ConfigService)
  app.enableCors({
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
    origin: '*'
  });
  await app.listen(configService.get<number>('server.port'))
}

bootstrap()
