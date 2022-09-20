import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { CommonEntity } from '../core/common/common.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'devices', schema: 'auth' })
export class DevicesEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid', { nullable: true })
  user_id: string;

  @Column({ nullable: true })
  device_id: string;

  @Column('varchar', { length: 100, nullable: true })
  mac_address: string;

  @Column('varchar', { length: 100, nullable: true })
  manufacturer: string;

  @Column('varchar', { length: 100, nullable: true })
  model: string;

  @Column('varchar', { length: 100, nullable: true })
  os: string;

  @Column('varchar', { length: 20, nullable: true })
  app_version: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true })
  last_refreshed_at: Date;

  @Column('varchar', { length: 255, nullable: true })
  notification_token: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;
}
