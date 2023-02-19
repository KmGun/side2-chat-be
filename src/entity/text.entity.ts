import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from './room.entity';

@Entity({ name: 'tb_text' })
export class Texts {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Room, { nullable: true })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  member_id: number;

  @Column({ nullable: true })
  time: Date;
}
