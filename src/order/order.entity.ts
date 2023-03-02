import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '../core/common/common.entity';

@Entity({ name: 'order', schema: 'public' })
export class OrderEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  order_id: string;

  @Column()
  id: string;

  @Column()
  product_name: string;

  @Column()
  quantity: number;

  @Column()
  order_submitted_at: string;

  @Column()
  price: string;

  @Column()
  status: number;

  @Column()
  is_active: boolean;

  @Column({ default: false })
  is_deleted: boolean;
}
