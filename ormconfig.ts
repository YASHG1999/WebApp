import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { UsersEntity } from "./src/user/entities/users.entity";
import { ProductsEntity } from 'src/products/entities/product.entity';
import { CategoryEntity } from 'src/category/entity/category.entity';
import {OrderEntity} from "./src/order/order.entity";
import {UserAddressEntity} from "./src/user_address/user_address.entity";



config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  url: configService.get('DATABASE_URL'),
  entities: [
    
    UsersEntity,
    ProductsEntity,
    CategoryEntity,
      OrderEntity,
      UserAddressEntity,

  ],
  
});
