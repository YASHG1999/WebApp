import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '../core/common/common.entity';

@Entity({ name: 'user_address', schema: 'public' })
export class UserAddressEntity /*extends CommonEntity*/{
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column()
  @ApiProperty()
  user_id: string;

  @Column({ nullable: true })
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  @Column({ default: null, nullable: true })
  is_default?: boolean;

  @ApiProperty()
  @Column()
  address_line1: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  address_line2: string;

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
  country: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  pincode: number;

  @ApiPropertyOptional()
  @Column({ default: true })
  is_active: boolean;


}
 //12 entities