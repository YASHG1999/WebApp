import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '../core/common/common.entity';

@Entity({ name: 'order', schema: 'public' })
export class OrderEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  product_name: string;

  @Column()
  quantity: number;

  @Column()
  order_submitted_at: string;

  @Column()
  price: number;

  @Column()
  status: number;

  @Column()
  is_active: boolean;

  @Column({ default: false })
  is_deleted: boolean;
}
