

import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "socket.io";

//get the client id by jwt token
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma.service";
import { PlayerService } from "src/player/player.service";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


function getIdUserFromToken(cookie: string) {

	if (!cookie) {
		// if the user not connected with intranet return null
		return null;
	}
	const cookieArray = cookie.split(';');
	const cookieObject = {};

	if (cookieArray.length === 0)
		return null;

	cookieArray.forEach((cookie) => {
		const cookieKeyValue = cookie.split('=');
		cookieObject[cookieKeyValue[0]] = decodeURIComponent(cookieKeyValue[1]);
	}
	);

	// get user id from jwt token
	const token = cookieObject['auth-cookie'];
	const tokenArray = token.split('.');
	const tokenObject = JSON.parse(atob(tokenArray[1]));

	return (tokenObject);
}

//

// @UseGuards(AuthGuard('jwt'))
@WebSocketGateway({
	namespace: "chat",
	cors: {
		origin: "*",
	},
})
export class ChatGateway {
	@WebSocketServer() wss: Socket;
	private roomPrefix = 'roomSocket';

	constructor(private readonly playerservice: PlayerService) { }

	async handleConnection(client: Socket, ...args: any[]) {
		// emyconsole.log("Client connected", client.id);

		// let userLog = getIdUserFromToken(client.handshake.headers.cookie)

		// discconnect socket
		// if(!userLog){
		//   this.wss.to(client.id).emit("EventAlmerdi", "You are not connected");
		//   client.disconnect(); 
		//   return;
		// }

		// get user id from jwt token from frontend
		// userLog = { id: "3c2d8759-126c-4d2a-b8bb-83475c0b8e63", nickname: "mlabrayj" }


		// const allrooms = await this.playerservice.getAllRooms(userLog.id);
		// let allmsgs = [];

		// // room
		// for (let room of allrooms) {
		// 	let roomId = this.roomPrefix + room.id;
		// 	client.join(roomId);

		// 	const msgofroom = await this.playerservice.getMessagesOfRoom(userLog, room.id);

		// 	allmsgs.push({
		// 		...room,
		// 		messages: msgofroom,
		// 	});
		// }

		// console.log('ALL ROOMS WITH MSGS ', allmsgs[0]);

		// this.wss.to(client.id).emit("La7sen", allmsgs); // listen to this event in frontend to get all rooms with messages fot the fisrt time connection
	}

	@SubscribeMessage("joinroom")
	async handleJoinRoom(client: Socket, data: any): Promise<void> {
		// emyconsole.log("joinroom", data);

		// validate user object passed in data
		if (!data.user)
			return;
		const user = await this.playerservice.findPlayerById(data.user.id);
		// exception if user not found
		if (!user)
			return;

		//emyconsole.log('SOCKET JOIN', data);
			
		// validate room object passed in data
		if (!data.room)
			return;
		// join room
		const room = await this.playerservice.getRoomById(data.user.id,data.room);
		if (!room)
			return;

		client.join(this.roomPrefix + data.roomId);
	}

	@SubscribeMessage("newmessage")
	async handleMessage(client: Socket, data: any): Promise<void> {
		// emyconsole.log("Message received", data); //data contains the message sent and room from client (frontend)

		// 
		// ALWAYS - VALIDATION
		// 
		// let userLog:any // = getIdUserFromToken(client.handshake.headers.cookie)
		// discconnect socket
		// if(!userLog){
		//   this.wss.to(client.id).emit("EventAlmerdi", "You are not connected");
		//   client.disconnect(); 
		//   return;
		// }

		// IF ROOM EXISTS
		if (!data.room)
			return;
		const room = await this.playerservice.getRoomById(data.user.id,data.room);
		if (!room) {
			// if user is member
			return;
		}

		// ALWAYS - VALIDATION
		// 

		// user: Current_User, msgTxt: inputMsg, room: props.room.id

		const newMessage = await this.playerservice.sendMessageinRoom(data.user.id, data.msgTxt, data.room);

		if (!newMessage) {
			return ;
		}

		/*
		{
			id          Message Id
			sender      Player
			senderId    Id Player
			msg         Text
			createdAt   Time
		}
		*/
		this.wss.to(this.roomPrefix + data.roomId).emit("addmsg", 
		{
			sender:{
				id: data.user.id,
				avatar: data.user.avatar,
				nickname: data.user.nickname
			},
			message: newMessage // event name 
		}); 
	}

	// @SubscribeMessage("message")
	// handleMessage(client: Socket, payload: any): void {
	// 	console.log("Message received", payload);
	// 	this.wss.to(client.id).emit("EventAlmerdi", payload);
	// }

	async handleDisconnect(client: Socket) {
		// emyconsole.log("Client disconnected", client.id);
	}
}