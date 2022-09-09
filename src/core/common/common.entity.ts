import { Column, UpdateDateColumn } from 'typeorm';

export class CommonEntity {
  @UpdateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column()
  updated_by?: string;
}
