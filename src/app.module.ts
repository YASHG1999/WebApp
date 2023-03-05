// import { UsersModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validate } from './config/env.validation';
import configuration from './config/configuration';
import { Module } from '@nestjs/common/decorators';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './category/category.module';
import { JwtModule} from "@nestjs/jwt";
import {UserAddressModule} from "./user_address/user_address.module";
import { PaymentModule } from './payment/payment.module';
import {ProductsEntity} from "./products/entities/product.entity";
import {UsersEntity} from "./user/entities/users.entity";
import {CategoryEntity} from "./category/entity/category.entity";
import {UserAddressEntity} from "./user_address/user_address.entity";
import {OrderEntity} from "./order/order.entity";
import {UsersModule} from "./user/users.module";
import {OrderModule} from "./order/order.module";

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
        entities: [__dirname + '/**/*.entity{.ts,.js}',ProductsEntity,UsersEntity,
          CategoryEntity , UserAddressEntity ,OrderEntity],
      }),
     inject: [ConfigService] ,
    }),

    UsersModule,
    ProductsModule,
    CategoryModule,
      JwtModule,
      UserAddressModule,
      PaymentModule,
      OrderModule,
   
    
   
  ],
  controllers: [],
  providers: [
    
  ],
})
export class AppModule {
 
}
