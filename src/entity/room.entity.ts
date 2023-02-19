import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { Texts } from './text.entity';

@Entity({ name: 'tb_room' })
export class Room {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // @Column({ nullable: true })

  @OneToMany(() => Texts, (texts) => texts.room, { nullable: true })
  texts: Texts[];

  @JoinTable({
    name: 'tb_member_room',
    joinColumns: [{ name: 'room_id' }],
    inverseJoinColumns: [{ name: 'member_id' }],
  })
  @ManyToMany(() => Member, (members) => members.rooms, { nullable: true })
  members: Member[];
}
