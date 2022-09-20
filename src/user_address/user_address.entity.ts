import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AddressType } from './enum/address.enum';

@Entity({ name: 'addresses', schema: 'auth' })
export class UserAddressEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column()
  @ApiProperty()
  user_id: string;

  @Column({ nullable: true })
  @ApiProperty()
  name: string;

  @Column({
    type: 'enum',
    enum: ['Home', 'Work', 'Other'],
  })
  @ApiProperty()
  type: AddressType;

  @Column('double precision')
  @ApiProperty()
  lat: number;

  @Column('double precision')
  @ApiProperty()
  long: number;

  @ApiPropertyOptional()
  @Column({ default: null })
  is_default: boolean;

  @ApiProperty()
  @Column()
  address_line_1: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  address_line_2: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  landmark: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  city: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  state: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  pincode: number;

  @ApiPropertyOptional()
  @Column({ default: true })
  is_active: boolean;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  contact_number: string;

  @ApiProperty()
  @Column('timestamp with time zone', {
    default: () => 'now()',
  })
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}
