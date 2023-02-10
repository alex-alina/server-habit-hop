import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from '../user/entity';

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

  @Column({type: 'timestamptz', nullable: true})
  startDate: Date;

  @Column({type: 'timestamptz', nullable: true})
  endDate: Date;

  @ManyToOne(() => User, user => user.goals)
  user: User
}