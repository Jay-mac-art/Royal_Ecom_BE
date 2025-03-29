import { Entity, PrimaryGeneratedColumn, Column, OneToMany, DeleteDateColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Order } from './order.entity';
import { DiscountCode } from './discountCode.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  username: string;

  @Column({unique : true})
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  password_hash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @OneToMany(() => DiscountCode, discountCode => discountCode.user)
  discount_codes: DiscountCode[];

   
  
    
  @Column({ type: 'text', nullable: true })
  comment?: string;

    
  @Column({ nullable: true })
  isDeleted : boolean;

    @CreateDateColumn()
    createdAt: Date;
  
  
    @UpdateDateColumn()
    updatedAt: Date;
  
  
}