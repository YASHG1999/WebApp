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
export class DevicesEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: bigint;

  @Column()
  otp: string;

  @Column()
  user_id: string;

  @Column()
  device_id: string;

  @Column()
  mac_address: string;

  @Column()
  manufacturer: string;

  @Column()
  model: string;

  @Column()
  os: string;

  @Column()
  app_version: string;

  @Column()
  is_active: boolean;

  @Column()
  last_refreshed_at: Date;

  @Column()
  notification_token: string;
}
