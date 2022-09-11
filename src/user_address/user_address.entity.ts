import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { AddressType } from './enum/address.enum';

@Entity({ name: 'addresses', schema: 'auth' })
export class UserAddress {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  user_id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ['Home', 'Work', 'Other'],
  })
  type: AddressType;

  @Column()
  lat: number;

  @Column()
  long: number;

  @Column({ default: null })
  is_default: boolean;

  @Column()
  address_line_1: string;

  @Column({ default: null })
  address_line_2: string;

  @Column()
  landmark: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  pincode: number;

  @Column({ default: true })
  is_active: boolean;

  @Column()
  contact_number: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
