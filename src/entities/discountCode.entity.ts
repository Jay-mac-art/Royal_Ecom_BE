import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Order } from './order.entity';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

@Entity()
export class DiscountCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsNotEmpty()
  code: string;

  @Column('decimal')
  @IsNumber()
  @Min(0)
  discount_percentage: number;

  @Column({ nullable: true })
  valid_until: Date; // Optional expiration date

  @Column({ default: false })
  used: boolean;

  @ManyToOne(() => User, { nullable: true })
  user: User; 

  @ManyToOne(() => Order, { nullable: true })
  generated_by_order: Order; 

    @Column({ type: 'text', nullable: true })
    comment?: string;
  
      
    @Column({ nullable: true })
    isDeleted : boolean;
  
      @CreateDateColumn()
      createdAt: Date;
    
    
      @UpdateDateColumn()
      updatedAt: Date;
    
}