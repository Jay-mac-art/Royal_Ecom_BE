import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Configuration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  key: string;

  @Column()
  @IsNotEmpty()
  value: string;

    @Column({ type: 'text', nullable: true })
    comment?: string;
  
      
    @Column({ nullable: true })
    isDeleted : boolean;
  
      @CreateDateColumn()
      createdAt: Date;
    
    
      @UpdateDateColumn()
      updatedAt: Date;
    
}