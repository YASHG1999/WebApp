import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { UserRole } from './enum/user.role';
import Any = jasmine.Any;
import { CommonEntity } from '../core/common/common.entity';

@Entity({ name: 'user', schema: 'public' })
export class UserEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()  
  middle_name: string;

  @Column()
  last_name: string;

  @Column()
  phone_number: string;

  @Column()
  email: string;

  

  @Column({ default: true })
  is_active: boolean;



  @Column()
  role:number;

  @Column()
  is_deleted: boolean;
}
