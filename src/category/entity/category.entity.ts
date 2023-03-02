import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
 
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('category', { schema: 'public' })
export class CategoryEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column('character varying', { name: 'name' })
  name: string;

  @Column({ default: true })
  is_active: boolean;
   @Column()
  description: string;

}

// @Column({nullable: true, default: null })
// user_id: string;