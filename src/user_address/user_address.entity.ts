import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '../core/common/common.entity';

@Entity({ name: 'addresses', schema: 'auth' })
export class UserAddressEntity extends CommonEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column()
  @ApiProperty()
  user_id: string;

  @Column({ nullable: true })
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  type: string;

  @Column('double precision', { nullable: true })
  @ApiPropertyOptional()
  lat?: number;

  @Column('double precision', { nullable: true })
  @ApiPropertyOptional()
  long?: number;

  @ApiPropertyOptional()
  @Column({ default: null, nullable: true })
  is_default?: boolean;

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

  @Column({ nullable: true, default: null })
  lithos_ref: number;
}
