import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Emotion } from './emotion.entity';
import { Habbit } from './habbit.entity';
import { Room } from './room.entity';

@Entity({ name: 'tb_member' })
export class Member {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar_skin_id: number;

  @Column({ nullable: true })
  avatar_eyes_id: number;

  @Column({ nullable: true })
  avatar_hair_id: number;

  @Column({ nullable: true })
  avatar_glasses_id: number;

  @Column({ nullable: true })
  status_message: string;

  @OneToOne(() => Emotion, { nullable: true })
  @JoinColumn({ name: 'emotion_id' })
  emotion: Emotion;

  @OneToOne(() => Habbit, { nullable: true })
  @JoinColumn({ name: 'habbit_id' })
  habbit: Habbit;

  // @OneToMany(() => Room, (rooms) => rooms.member)
  // rooms: Room[];

  @JoinTable({
    name: 'tb_member_room',
    joinColumns: [{ name: 'member_id' }],
    inverseJoinColumns: [{ name: 'room_id' }],
  })
  @ManyToMany(() => Room, (rooms) => rooms.members, { nullable: true })
  rooms: Room[];
}
