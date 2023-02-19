import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';

@Entity({ name: 'tb_habbit' })
export class Habbit {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  answer_time: number; // 24시간 시간 단위

  @Column({ nullable: true })
  answer_period: number; // 분 단위

  @OneToOne(() => Member, { nullable: true })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @UpdateDateColumn()
  updated_at: Date;
}
