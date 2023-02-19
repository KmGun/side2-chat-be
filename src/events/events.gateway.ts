import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import axios from 'axios';
import { Namespace, Server, Socket } from 'socket.io';
import { Room } from 'src/entity/room.entity';
import { Repository } from 'typeorm';
import { EventsService } from './events.service';
import { arraysMatch } from './utils';

interface MessagePayload {
  room_id: string;
  message: string;
}

interface Icreate {
  me: number;
  other: number;
}

let createdRooms: string[][] = [];

async function addEmotionObjToMessage(body) {
  // 1. 데이터

  // 2. 네이버 감정 분석해서 emotion 객체 넣어줌
  const result = await axios
    .post(
      'https://b6f657f1-3a1b-4359-bd04-7fdcad64479f.api.kr-central-1.kakaoi.io/ai/conversation/ee04e6a0a8714d928c81d56c0c37538c',
      {
        msg: body.text,
      },
      {
        headers: {
          'x-api-key': 'fedcd7f112843a415cd8bc6dd29c8292',
          'Content-Type': 'application/json',
        },
      },
    )
    .then((res) => {
      console.log();
      const result2 = {
        ...body,
        emotion: res.data[0].candidates,
      };
      return result2;
    });
  return result;
}

@WebSocketGateway({
  cors: true,
})
export class EventsGateWay
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly eventsService: EventsService) {}

  private logger = new Logger('Gateway');

  @WebSocketServer() server: Server;

  afterInit() {
    this.logger.log('웹소켓 서버 초기화 ✅');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결`);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결 해제 ❌`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { room_id, message }: MessagePayload,
  ) {
    console.log('메세지', room_id);
    // 1. 메세지 감성분석 해서, 디비에 저장.
    const result = await addEmotionObjToMessage(message);
    console.log(result);
    // socket
    //   // .to(room_id)
    //   .emit('message', { username: socket.id, message: result });
    this.server
      // .to(room_id.toString())
      .emit('message_', { username: socket.id, message: result });

    // this.server.to(room_id).emit('message', message);

    return { username: socket.id, result };
  }

  @SubscribeMessage('room-list')
  async handleRoomList(@MessageBody() memberId: string) {
    console.log(memberId);
    const member_id = Number(memberId);
    // 1. 유저가 들어있는 모든 룸정보를 가져와야함.
    const result = await this.eventsService.findRoomsByMember({ member_id });

    return result;
  }

  // 둘다 일치하면...

  @SubscribeMessage('create-room')
  async handleCreateRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { me, other }: Icreate,
  ) {
    const member_ids = [me, other];
    console.log('create 실행', member_ids);
    // 1. 기존에 대화방 있는지 확인
    const room = await this.eventsService.findRoom({ users: member_ids });
    if (room) {
      return { success: false, room_id: `${member_ids} 방이 이미 존재합니다.` };
    }
    // 2. room 생성
    const createdRoom = await this.eventsService.createRoom();

    // const result2 = await this.eventS

    // 3. 채팅방에 등록

    // 2. DB에 채팅방 정보등록

    socket.join(createdRoom.id.toString()); // 기존에 없던 room으로 join하면 room이 생성됨
    this.server.emit('create-room', createdRoom.id.toString()); // 대기실 방 생성

    // 유저가 생성한 room 목록에 추가
    // console.log(createdRoom_id_str, '네임스페이스에 번방 방생성');

    return {
      success: true,
      room_id: createdRoom.id.toString(),
      members: member_ids,
    };
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() room_id: string,
  ) {
    socket.join(room_id); // join room
    // socket
    //   // .to(room_id)
    //   .emit('message', { message: `${socket.id}가 들어왔습니다.` }, () => {
    //     console.log('조인', room_id);
    //   });
    return { success: true };
  }
}

// 텍스트 에서 감정 뽑아내기
// 1. 데이터 받으면
