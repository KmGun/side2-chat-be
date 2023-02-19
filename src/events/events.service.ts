import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/entity/room.entity';
import { Repository } from 'typeorm';
import { arraysMatch, removeElementFromArray } from './utils';

interface IfindRoom {
  users: number[];
}

export class EventsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async findRoom({ users }: IfindRoom) {
    const allRooms = await this.roomRepository.find({
      relations: ['members'],
    });
    const room = allRooms.find((room) => {
      const members = room.members;
      const result = members.map((member) => member.id);
      return arraysMatch(result, users);
    });

    return room;
  }

  async findRoomsByMember({ member_id }) {
    const allRooms = await this.roomRepository.find({
      relations: ['members'],
    });
    // 1. 현재 유저가 포함되있는 룸들의 리스트를 갖고온다.
    const rooms = allRooms.filter((room) => {
      const members = room.members;
      const result = members.map((member) => member.id);
      return result.includes(member_id);
    });

    const result = rooms.map((room) => {
      return room.members.find((member) => member.id !== member_id);
    });
    return rooms;

    // const rooms2 = allRooms.filter((room) => {
    //   const members = room.members;
    //   const result = members.map((member) => member.id);
    //   const result2 = removeElementFromArray(result, member_id);
    //   members.find((member) => member_id === result2[0]);

    //   return {
    //     room_id: room.id,
    //     member: {
    //       member_id: result2[0],
    //       avatar: {
    //         avatar_skin_id: 1,
    //         avatar_eyes_id: 1,
    //         avatar_hair_id: 1,
    //         avatar_glasses_id: 1,
    //       },
    //     },
    //   };
    // });
    // return {
    //     room_id : ,
    //     result[0]
    // };
  }
  //   async registerUser() {
  //     // await this.roomRepository.
  //   }

  async createRoom() {
    const result = await this.roomRepository.save({});

    // 유저도 등록
    const result2 = await this.roomRepository.save({});
    console.log('결과', result);
    return result;
  }
}
