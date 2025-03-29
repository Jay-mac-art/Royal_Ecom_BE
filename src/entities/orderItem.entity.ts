import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './order.entity';


@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.order_items)
  order: Order;

  @Column()
  productId: string; // Product ID from the frontend JSON

  @Column()
  name: string; // Product name from the frontend

  @Column()
  description: string; // Product description from the frontend

  @Column('decimal')
  price: number; // Product price from the frontend

  @Column()
  quantity: number; // Quantity from the checkout request

  @Column({ nullable: true })
   paymentMode : string;

   @Column({ nullable: true })
   paymentId : string

    @Column({ type: 'text', nullable: true })
    comment?: string;
  
      
    @Column({ nullable: true })
    isDeleted : boolean;
  
      @CreateDateColumn()
      createdAt: Date;
    
    
      @UpdateDateColumn()
      updatedAt: Date;
}