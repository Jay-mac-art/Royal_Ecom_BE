import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { DiscountCode } from './discountCode.entity';
import { OrderItem } from './orderItem.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.orders)
  user: User;

  @Column('decimal')
  total_amount: number; // Final amount after discount

  @Column('decimal', { default: 0 })
  discount_amount: number; // Amount saved due to discount

  @ManyToOne(() => DiscountCode, { nullable: true })
  discount_code: DiscountCode; // Discount applied to this order

  @Column()
  created_at: Date;

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  order_items: OrderItem[];

  @OneToMany(() => DiscountCode, discountCode => discountCode.generated_by_order)
  generated_discount_codes: DiscountCode[];

    @Column({ type: 'text', nullable: true })
    comment?: string;
  
      
    @Column({ nullable: true })
    isDeleted : boolean;
  
      @CreateDateColumn()
      createdAt: Date;
    
    
      @UpdateDateColumn()
      updatedAt: Date;
}