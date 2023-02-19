import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';

@Entity({ name: 'tb_emotion' })
export class Emotion {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  none: number;

  @Column({ nullable: true })
  surprised: number;

  @Column({ nullable: true })
  fear: number;

  @Column({ nullable: true })
  uncertain: number;

  @Column({ nullable: true })
  sadness: number;

  @Column({ nullable: true })
  dislike: number;

  @Column({ nullable: true })
  good: number;

  @Column({ nullable: true })
  bored: number;

  @Column({ nullable: true })
  shame: number;

  @OneToOne(() => Member, { nullable: true })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @UpdateDateColumn()
  updated_at: Date;
}
