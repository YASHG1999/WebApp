import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import Any = jasmine.Any;
import {CommonEntity} from "../../core/common/common.entity";

@Entity({ name: 'users', schema: 'public' })
export class UsersEntity  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  middle_name: string;

  @Column()
  last_name: string;

  @Column()
  phone_no: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role:number;

  @Column({ default: true })
  is_active: boolean;

  @Column()
  is_deleted: boolean;
}
