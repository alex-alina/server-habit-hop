import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Goal from '../goal/entity';

export type HabitType = "develop" | "break";

@Entity()
export default class Habit {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'text'})
  habitDescription: string;

  @Column({
    type: "enum",
    enum: ["develop", "break"],
    default: "develop",
  })
  habitType: HabitType;

  @Column({type: 'text'})
  progressMetric: string;

  @ManyToOne(() => Goal, goal => goal.habits)
  goal: Goal
}