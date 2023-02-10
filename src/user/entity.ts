import * as bcrypt from 'bcrypt';
import {
  BeforeInsert, 
  Column, 
  CreateDateColumn, 
  Entity, OneToMany, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn
} from 'typeorm';
import { IsEmail, MinLength } from "class-validator"
import Goal from '../goal/entity';

@Entity()
export default class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'text'})
  @MinLength(2, {
    message: 'First name should have at least two letters',
  })
  firstName: string;

  @Column({type: 'text'})
  @MinLength(2, {
    message: 'Last name should have at least two letters',
  })
  lastName: string;

  @Column({type: 'text', unique: true})
  @IsEmail({}, {
    message: 'Invalid email address or format.',
  })
  email: string;

  @Column({type: 'text', select: false})
  @MinLength(8, {
    message: 'Pasword should have at least eight characters',
  })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  checkPassword(rawPassword: string): Promise<boolean> {
    return bcrypt.compare(rawPassword, this.password)
  }

  @CreateDateColumn({ name: 'created_at' }) 
  createdAt: Date;

  @UpdateDateColumn({ name: 'last_login' }) 
  lastLogin: Date;

  @OneToMany(() => Goal, goal => goal.user) 
  goals: Goal[]
}

 
  