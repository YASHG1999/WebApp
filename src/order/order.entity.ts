import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '../core/common/common.entity';

@Entity({ name: 'order', schema: 'public' })
export class OrderEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  order_id: string;

  @Column()
  product_name: string;

  @Column()
  order_quantity: string;

  @Column()
  order_sumbitted_at: string;

  @Column()
  final_amount: string;

  @Column()
  status: number;

  @Column()
  is_active: boolean;

  @Column({ default: false })
  is_deleted: boolean;
}
