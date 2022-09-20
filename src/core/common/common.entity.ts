import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class CommonEntity {
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('uuid', { nullable: true })
  updated_by: string;
}
