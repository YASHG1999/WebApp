import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Generated,
} from 'typeorm';

export class CommonEntity {
  @UpdateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column()
  updated_by?: string;
}
