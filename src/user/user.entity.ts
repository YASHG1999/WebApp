import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { UserRole } from './enum/user.role';
import Any = jasmine.Any;
import { CommonEntity } from '../core/common/common.entity';

@Entity({ name: 'user', schema: 'auth' })
export class UserEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100, nullable: true })
  name: string;

  @Column('varchar', { length: 5, nullable: true })
  country_code: string;

  @Index()
  @Column('varchar', { length: 15, nullable: true })
  phone_number: string;

  @Column('varchar', { length: 255, nullable: true })
  email: string;

  @Column('varchar', { length: 255, nullable: true })
  avatar_url: string;

  @Column({ nullable: true })
  phone_confirmed_at: Date;

  @Column({ nullable: true })
  email_confirmed_at: Date;

  @Column({ nullable: true })
  last_sign_in_at: Date;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: true,
  })
  meta_data: Any;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true })
  banned_until: Date;

  @Column({
    type: 'enum',
    enum: UserRole,
    array: true,
    default: [UserRole.VISITOR],
  })
  roles: UserRole[];
}
