import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { CommonEntity } from '../core/common/common.entity';

@Entity({ name: 'otp_tokens', schema: 'auth' })
export class OtpTokensEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column()
  otp: string;

  @Column()
  user_id: string;

  @Column()
  phone_number: string;

  @Column()
  valid_till: Date;

  @Column()
  sent_at: Date;

  @Column()
  retries_count: number;

  @Column()
  retries_allowed: number;
}
