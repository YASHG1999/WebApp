import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { AddressType } from './enum/address.enum';

@Entity({ name: 'addresses', schema: 'auth' })
export class UserAddress {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  @ApiProperty()
  user_id: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column({
    type: 'enum',
    enum: ['Home', 'Work', 'Other'],
  })
  @ApiProperty()
  type: AddressType;

  @Column()
  @ApiProperty()
  lat: number;

  @Column()
  @ApiProperty()
  long: number;

  @ApiPropertyOptional()
  @Column({ default: null })
  is_default: boolean;

  @ApiProperty()
  @Column()
  address_line_1: string;

  @ApiPropertyOptional()
  @Column({ default: null })
  address_line_2: string;

  @ApiPropertyOptional()
  @Column()
  landmark: string;

  @ApiPropertyOptional()
  @Column()
  city: string;

  @ApiPropertyOptional()
  @Column()
  state: string;

  @ApiPropertyOptional()
  @Column()
  pincode: number;

  @ApiPropertyOptional()
  @Column({ default: true })
  is_active: boolean;

  @ApiPropertyOptional()
  @Column()
  contact_number: string;

  @ApiProperty()
  @Column()
  created_at: Date;

  @ApiProperty()
  @Column()
  updated_at: Date;
}
