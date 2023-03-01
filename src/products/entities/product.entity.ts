import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";


@Entity({ name: 'products', schema: 'public' })
export class ProductsEntity  {

  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  product_name: string;

  @Column()  
  category_id: number;

  @Column()
  packet_description: string;

  @Column()
  quantity: number;

  @Column({ default: true })
  is_active: boolean;

  @Column()
  price: number;
}