import { Column, Entity,OneToMany,  ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from '../user/entity';
import Habit from '../habit/entity';

export type Priority = "main" | "secondary" | "tertiary";

@Entity()
export default class Goal {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'text'})
  goalDefinition: string;

  @Column({
    type: "enum",
    enum: ["main", "secondary", "tertiary"],
    default: "main",
  })
  priority: Priority;

  @Column({type: 'date', nullable: true})
  startDate: Date;

  @Column({type: 'date', nullable: true})
  endDate: Date;

  @ManyToOne(() => User, user => user.goals)
  user: User

  @OneToMany(() => Habit, habit => habit.goal) 
  habits: Habit[]
}