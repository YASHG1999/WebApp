import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './enum/user.role';
import Any = jasmine.Any;
import { CommonEntity } from '../core/common/common.entity';

@Entity({ name: 'user', schema: 'auth' })
export class UserEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  country_code: string;

  @Column()
  phone_number: string;

  @Column()
  email: string;

  @Column()
  avatar_url: string;

  @Column()
  phone_confirmed_at: Date;

  @Column()
  email_confirmed_at: Date;

  @Column()
  last_sign_in_at: Date;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  meta_data: Any;

  @Column({ default: true })
  is_active: boolean;

  @Column()
  banned_until: Date;

  @Column({
    type: 'enum',
    enum: UserRole,
    array: true,
    default: UserRole[UserRole.VISITOR],
  })
  roles: UserRole[];
}
