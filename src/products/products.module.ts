import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsEntity } from './entities/product.entity';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';



@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      ProductsEntity,
      
  
    ]),
  ],
  providers: [ProductsService,  ConfigService],
  controllers: [ProductsController],
})
export class ProductsModule{}


