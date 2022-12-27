import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtTokenModule } from './core/jwt-token/jwt-token.module';
import { SmsModule } from './core/sms/sms.module';
import { CommonModule } from './core/common/common.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './core/guards/roles.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddressModule } from './user_address/user_address.module';
import configuration from './config/configuration';
import { validate } from './config/env.validation';
import { RequestLoggingMiddleware } from './core/logging.middleware';
import { UserStoreMappingModule } from './user_store/user-store-mapping.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validate,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    JwtTokenModule,
    SmsModule,
    CommonModule,
    UserAddressModule,
    UserStoreMappingModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    RequestLoggingMiddleware,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
