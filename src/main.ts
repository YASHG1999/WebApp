import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Config } from './config/configuration';
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 
  const config = app.get<ConfigService<Config, true>>(ConfigService);
    app.use(cookieParser());
    app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true
  })
   


  await app.listen(config.get<number>('port'));
}
bootstrap();
