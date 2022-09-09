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

@Entity({ name: 'refresh_token', schema: 'auth' })
export class RefreshTokenEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column()
  token: string;

  @Column()
  user_id: string;

  @Column()
  valid_till: Date;

  @Column()
  revoked: boolean;
}
