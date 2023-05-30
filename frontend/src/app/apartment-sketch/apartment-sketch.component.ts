import { Component, OnInit } from '@angular/core';
import { ApartmentSketch, ProgressState, RoomSketch } from '../models/ApartmentSketch';

@Component({
  selector: 'app-apartment-sketch',
  templateUrl: './apartment-sketch.component.html',
  styleUrls: ['./apartment-sketch.component.css']
})
export class ApartmentSketchComponent implements OnInit {
	static readonly MOVING_ROOM_FILL_COLOR: string = "#d3d3d3";
	static readonly BORDER_FILL_OFFSET: number = 1;

	static sketchCanvas;
	static sketchCanvasContext;
	static sketchCanvasClientRect;

	static apartmentSketch?: ApartmentSketch;

	static mousePosX: number;
	static mousePosY: number;
	static selectedRoomIndex: number = -1;
	static selectedRoom?: RoomSketch;

	constructor() {}

	ngOnInit(): void {
		ApartmentSketchComponent.sketchCanvas = document.querySelector("#apartmentCanvas");
		ApartmentSketchComponent.sketchCanvasContext = ApartmentSketchComponent.sketchCanvas.getContext("2d");
		ApartmentSketchComponent.sketchCanvasClientRect = ApartmentSketchComponent.sketchCanvas.getBoundingClientRect();

		if(!ApartmentSketchComponent.apartmentSketch){
			ApartmentSketchComponent.apartmentSketch = new ApartmentSketch();

			ApartmentSketchComponent.apartmentSketch.roomSketches.push(new RoomSketch(150, 250, 500, 300, ProgressState.IN_PROGRESS));
			ApartmentSketchComponent.apartmentSketch.roomSketches.push(new RoomSketch(150, 250, 100, 500, ProgressState.FINISHED));
			ApartmentSketchComponent.apartmentSketch.roomSketches.push(new RoomSketch(150, 400));
		}

		for(let rs of ApartmentSketchComponent.apartmentSketch.roomSketches) {
			rs.x = rs.savedX;
			rs.y = rs.savedY;
		}

		ApartmentSketchComponent.sketchCanvas.height = "700";
		ApartmentSketchComponent.sketchCanvas.style.height = "700px";
		ApartmentSketchComponent.sketchCanvas.width = "800";
		ApartmentSketchComponent.sketchCanvas.style.width = "800px";
		ApartmentSketchComponent.drawAllRoomSketches();

		ApartmentSketchComponent.sketchCanvas.addEventListener("mousedown", ApartmentSketchComponent.startPosition);
		ApartmentSketchComponent.sketchCanvas.addEventListener("mousemove", ApartmentSketchComponent.moveRoom);
		ApartmentSketchComponent.sketchCanvas.addEventListener("mouseup",   ApartmentSketchComponent.endPosition);
		ApartmentSketchComponent.sketchCanvas.addEventListener("mouseout",  ApartmentSketchComponent.endPosition);
	}

	static clearRoomSketch(rs: RoomSketch): void {
		let bOff: number = ApartmentSketchComponent.BORDER_FILL_OFFSET;
		ApartmentSketchComponent.sketchCanvasContext.clearRect(rs.x - bOff, rs.y - bOff, rs.width + 2*bOff, rs.height + 2*bOff);
	}

	static drawRoomSketch(rs: RoomSketch): void {
		ApartmentSketchComponent.clearRoomSketch(rs);
		// ApartmentSketchComponent.sketchCanvasContext.beginPath();

		if(!rs.isSet) {
			ApartmentSketchComponent.sketchCanvasContext.fillStyle = ApartmentSketchComponent.MOVING_ROOM_FILL_COLOR;
			ApartmentSketchComponent.sketchCanvasContext.fillRect(rs.x, rs.y, rs.width, rs.height);

			if(rs.isCollided) 
				ApartmentSketchComponent.sketchCanvasContext.strokeStyle = 'red';
			else 
				ApartmentSketchComponent.sketchCanvasContext.strokeStyle = 'black';

			ApartmentSketchComponent.sketchCanvasContext.strokeRect(rs.x, rs.y, rs.width, rs.height);

			ApartmentSketchComponent.sketchCanvasContext.strokeStyle = 'black';
			return;
		}


		if(rs.progress == ProgressState.IN_PROGRESS) {
			ApartmentSketchComponent.sketchCanvasContext.fillStyle = RoomSketch.IN_PROGRESS_FILL_COLOR;
			ApartmentSketchComponent.sketchCanvasContext.fillRect(rs.x, rs.y, rs.width, rs.height);
		} else if(rs.progress == ProgressState.FINISHED) {
			ApartmentSketchComponent.sketchCanvasContext.fillStyle = RoomSketch.FINISHED_FILL_COLOR;
			ApartmentSketchComponent.sketchCanvasContext.fillRect(rs.x, rs.y, rs.width, rs.height);
		}

		ApartmentSketchComponent.sketchCanvasContext.fillStyle = 'black';
		ApartmentSketchComponent.sketchCanvasContext.strokeRect(rs.x, rs.y, rs.width, rs.height);
	}

	static drawAllRoomSketches(): void {
		ApartmentSketchComponent.apartmentSketch.roomSketches.forEach((rs, roomIndex) => {
			if(roomIndex != ApartmentSketchComponent.selectedRoomIndex) {
				ApartmentSketchComponent.drawRoomSketch(rs);
			}
		});		
	}

	static startPosition(e): void {
		let mouseCurrX: number = e.clientX - ApartmentSketchComponent.sketchCanvasClientRect.left;
		let mouseCurrY: number = e.clientY - ApartmentSketchComponent.sketchCanvasClientRect.top;

		ApartmentSketchComponent.mousePosX = mouseCurrX;
		ApartmentSketchComponent.mousePosY = mouseCurrY;

		console.log(mouseCurrX, mouseCurrY);

		for(let i: number = ApartmentSketchComponent.apartmentSketch.roomSketches.length - 1; i >= 0; i--) {
			let currRS: RoomSketch = ApartmentSketchComponent.apartmentSketch.roomSketches[i];
			if(mouseCurrX >= currRS.x && mouseCurrX <= currRS.x + currRS.width && mouseCurrY >= currRS.y && mouseCurrY <= currRS.y + currRS.height) {
				ApartmentSketchComponent.selectedRoomIndex = i;
				ApartmentSketchComponent.selectedRoom = currRS;
				ApartmentSketchComponent.selectedRoom.isSet = false;
				break;
			}
		}
	}

	static moveRoom(e): void {
		if(!ApartmentSketchComponent.selectedRoom) return;

		let mouseCurrX: number = e.clientX - ApartmentSketchComponent.sketchCanvasClientRect.left;
		let mouseCurrY: number = e.clientY - ApartmentSketchComponent.sketchCanvasClientRect.top;

		ApartmentSketchComponent.clearRoomSketch(ApartmentSketchComponent.selectedRoom);
		ApartmentSketchComponent.drawAllRoomSketches();

		let errorX: boolean = false, errorY: boolean = false;
		
		// check and correct moving off the canvas
		if(ApartmentSketchComponent.selectedRoom.x + (mouseCurrX - ApartmentSketchComponent.mousePosX) < 0)
		{
			ApartmentSketchComponent.selectedRoom.x = 0;
			errorX = true;
		}
		if(ApartmentSketchComponent.selectedRoom.x + (mouseCurrX - ApartmentSketchComponent.mousePosX) + ApartmentSketchComponent.selectedRoom.width > ApartmentSketchComponent.sketchCanvas.width)
		{
			ApartmentSketchComponent.selectedRoom.x = ApartmentSketchComponent.sketchCanvas.width - ApartmentSketchComponent.selectedRoom.width;
			errorX = true;
		}
		if(ApartmentSketchComponent.selectedRoom.y + (mouseCurrY - ApartmentSketchComponent.mousePosY) < 0)
		{
			ApartmentSketchComponent.selectedRoom.y = 0;
			errorY = true;
		}
		if(ApartmentSketchComponent.selectedRoom.y + (mouseCurrY - ApartmentSketchComponent.mousePosY) + ApartmentSketchComponent.selectedRoom.height > ApartmentSketchComponent.sketchCanvas.height)
		{
			ApartmentSketchComponent.selectedRoom.y = ApartmentSketchComponent.sketchCanvas.height - ApartmentSketchComponent.selectedRoom.height;
			errorY = true;
		}
		
		if(!errorX) ApartmentSketchComponent.selectedRoom.x = ApartmentSketchComponent.selectedRoom.x + (mouseCurrX - ApartmentSketchComponent.mousePosX);
		if(!errorY) ApartmentSketchComponent.selectedRoom.y = ApartmentSketchComponent.selectedRoom.y + (mouseCurrY - ApartmentSketchComponent.mousePosY);

		// detect collision with other room sketches
		for(let i = 0; i < ApartmentSketchComponent.apartmentSketch.roomSketches.length; i++) {
			if(i == ApartmentSketchComponent.selectedRoomIndex || !ApartmentSketchComponent.apartmentSketch.roomSketches[i].isSet) continue;

			let rs: RoomSketch = ApartmentSketchComponent.apartmentSketch.roomSketches[i];

			if(((ApartmentSketchComponent.selectedRoom.y >= rs.y && ApartmentSketchComponent.selectedRoom.y < rs.y + rs.height) || (ApartmentSketchComponent.selectedRoom.y <= rs.y && ApartmentSketchComponent.selectedRoom.y + ApartmentSketchComponent.selectedRoom.height > rs.y)) && 
			   ((ApartmentSketchComponent.selectedRoom.x <= rs.x && ApartmentSketchComponent.selectedRoom.x + ApartmentSketchComponent.selectedRoom.width > rs.x)  || (ApartmentSketchComponent.selectedRoom.x >= rs.x && ApartmentSketchComponent.selectedRoom.x < rs.x + rs.width))) {
				ApartmentSketchComponent.selectedRoom.isCollided = true;
				break;
			}
			else
				ApartmentSketchComponent.selectedRoom.isCollided = false;
		}

		ApartmentSketchComponent.drawRoomSketch(ApartmentSketchComponent.selectedRoom);
		ApartmentSketchComponent.mousePosX = mouseCurrX;
		ApartmentSketchComponent.mousePosY = mouseCurrY;
	}

	static endPosition(): void { // ovo se takodje treba generalizovati
		if(ApartmentSketchComponent.selectedRoom) {
			if(ApartmentSketchComponent.selectedRoom.isCollided) ApartmentSketchComponent.selectedRoom.isSet = false;
			else ApartmentSketchComponent.selectedRoom.isSet = true; // TODO: update savedX & savedY of selected room
		}

		ApartmentSketchComponent.selectedRoom = undefined;
		ApartmentSketchComponent.selectedRoomIndex = -1;

		ApartmentSketchComponent.drawAllRoomSketches();
	}

}
