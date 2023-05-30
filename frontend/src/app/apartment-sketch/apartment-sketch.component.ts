import { Component, OnInit } from '@angular/core';
import { ApartmentSketch, RoomSketch } from '../models/ApartmentSketch';

@Component({
  selector: 'app-apartment-sketch',
  templateUrl: './apartment-sketch.component.html',
  styleUrls: ['./apartment-sketch.component.css']
})
export class ApartmentSketchComponent implements OnInit {

	static sketchCanvas;
	static sketchCanvasContext;

	static apartmentSketch?: ApartmentSketch;

	static mousePosX: number;
	static mousePosY: number;
	static isCollisionDetected: boolean = false;
	// static isAnyMoving: boolean = false;
	static selectedRoomIndex: number = -1;
	static selectedRoom?: RoomSketch;

	constructor() {}

	ngOnInit(): void {
		ApartmentSketchComponent.sketchCanvas = document.querySelector("#apartmentCanvas");
		ApartmentSketchComponent.sketchCanvasContext = ApartmentSketchComponent.sketchCanvas.getContext("2d");

		if(!ApartmentSketchComponent.apartmentSketch){
			ApartmentSketchComponent.apartmentSketch = new ApartmentSketch();
			ApartmentSketchComponent.apartmentSketch.roomSketches.push(new RoomSketch(150, 400));
			ApartmentSketchComponent.apartmentSketch.roomSketches.push(new RoomSketch(150, 250, 500, 300));
		}

		ApartmentSketchComponent.sketchCanvas.height = "700";
		ApartmentSketchComponent.sketchCanvas.style.height = "700px";
		ApartmentSketchComponent.sketchCanvas.width = "800";
		ApartmentSketchComponent.sketchCanvas.style.width = "800px";
		ApartmentSketchComponent.drawAllTables();

		ApartmentSketchComponent.sketchCanvas.addEventListener("mousedown", ApartmentSketchComponent.startPosition);
		ApartmentSketchComponent.sketchCanvas.addEventListener("mousemove", ApartmentSketchComponent.moveTable);
		ApartmentSketchComponent.sketchCanvas.addEventListener("mouseup",   ApartmentSketchComponent.endPosition);
		ApartmentSketchComponent.sketchCanvas.addEventListener("mouseout",  ApartmentSketchComponent.endPosition);
	}

	static drawAllTables() {
		ApartmentSketchComponent.apartmentSketch.roomSketches.forEach((rs, roomIndex) => {
			if(roomIndex != ApartmentSketchComponent.selectedRoomIndex) {
				if(rs.isInvalid) {
					ApartmentSketchComponent.sketchCanvasContext.fillStyle = 'red';
					ApartmentSketchComponent.sketchCanvasContext.fillRect(rs.x, rs.y, rs.width, rs.height);
					ApartmentSketchComponent.sketchCanvasContext.fillStyle = 'black';
				}
				else {
					ApartmentSketchComponent.sketchCanvasContext.fillRect(rs.x, rs.y, rs.width, rs.height);
				}
			}
		});		
	}

	static startPosition(e)
	{
		ApartmentSketchComponent.mousePosX = e.clientX;
		ApartmentSketchComponent.mousePosY = e.clientY;

		// TODO: find which room should move and set clickedIndex accordingly
		let clickedIndex = 0;
		ApartmentSketchComponent.selectedRoomIndex = clickedIndex;
		ApartmentSketchComponent.selectedRoom = ApartmentSketchComponent.apartmentSketch.roomSketches[clickedIndex];
	}

	static moveTable(e)
	{
		if(!ApartmentSketchComponent.selectedRoom) return;

		ApartmentSketchComponent.sketchCanvasContext.clearRect(ApartmentSketchComponent.selectedRoom.x, ApartmentSketchComponent.selectedRoom.y, ApartmentSketchComponent.selectedRoom.width, ApartmentSketchComponent.selectedRoom.height);
		ApartmentSketchComponent.drawAllTables();

		let errorX: boolean = false, errorY: boolean = false;
		
		// check and correct moving off the canvas
		if(ApartmentSketchComponent.selectedRoom.x + (e.clientX - ApartmentSketchComponent.mousePosX) < 0)
		{
			ApartmentSketchComponent.selectedRoom.x = 0;
			errorX = true;
		}
		if(ApartmentSketchComponent.selectedRoom.x + (e.clientX - ApartmentSketchComponent.mousePosX) + ApartmentSketchComponent.selectedRoom.width > ApartmentSketchComponent.sketchCanvas.width)
		{
			ApartmentSketchComponent.selectedRoom.x = ApartmentSketchComponent.sketchCanvas.width - ApartmentSketchComponent.selectedRoom.width;
			errorX = true;
		}
		if(ApartmentSketchComponent.selectedRoom.y + (e.clientY - ApartmentSketchComponent.mousePosY) < 0)
		{
			ApartmentSketchComponent.selectedRoom.y = 0;
			errorY = true;
		}
		if(ApartmentSketchComponent.selectedRoom.y + (e.clientY - ApartmentSketchComponent.mousePosY) + ApartmentSketchComponent.selectedRoom.height > ApartmentSketchComponent.sketchCanvas.height)
		{
			ApartmentSketchComponent.selectedRoom.y = ApartmentSketchComponent.sketchCanvas.height - ApartmentSketchComponent.selectedRoom.height;
			errorY = true;
		}
		
		
		
		if(!errorX) ApartmentSketchComponent.selectedRoom.x = ApartmentSketchComponent.selectedRoom.x + (e.clientX - ApartmentSketchComponent.mousePosX);
		if(!errorY) ApartmentSketchComponent.selectedRoom.y = ApartmentSketchComponent.selectedRoom.y + (e.clientY - ApartmentSketchComponent.mousePosY);
		
		// TODO: detect collision with other tables (this would be some forech through some array)
		// if(((ApartmentSketchComponent.stoY >= ApartmentSketchComponent.sto2Y && ApartmentSketchComponent.stoY <= ApartmentSketchComponent.sto2Y + ApartmentSketchComponent.sto2Visina) || (ApartmentSketchComponent.stoY <= ApartmentSketchComponent.sto2Y && ApartmentSketchComponent.stoY + ApartmentSketchComponent.stoVisina >= ApartmentSketchComponent.sto2Y)) && 
		// 	((ApartmentSketchComponent.stoX <= ApartmentSketchComponent.sto2X && ApartmentSketchComponent.stoX + ApartmentSketchComponent.stoSirina >= ApartmentSketchComponent.sto2X)  || (ApartmentSketchComponent.stoX >= ApartmentSketchComponent.sto2X && ApartmentSketchComponent.stoX <= ApartmentSketchComponent.sto2X + ApartmentSketchComponent.sto2Sirina))) 
		// 	ApartmentSketchComponent.collisionDetected = true;
		// else
		// 	ApartmentSketchComponent.collisionDetected = false;
		
		if(ApartmentSketchComponent.isCollisionDetected) ApartmentSketchComponent.sketchCanvasContext.fillStyle = 'red';
		else ApartmentSketchComponent.sketchCanvasContext.fillStyle = 'green';

		ApartmentSketchComponent.sketchCanvasContext.fillRect(ApartmentSketchComponent.selectedRoom.x, ApartmentSketchComponent.selectedRoom.y, ApartmentSketchComponent.selectedRoom.width, ApartmentSketchComponent.selectedRoom.height);
		ApartmentSketchComponent.sketchCanvasContext.fillStyle = 'black';
		ApartmentSketchComponent.mousePosX = e.clientX;
		ApartmentSketchComponent.mousePosY = e.clientY;
	}

	static endPosition()
	{ // ovo se takodje treba generalizovati
		if(ApartmentSketchComponent.selectedRoom) {
			if(ApartmentSketchComponent.isCollisionDetected) ApartmentSketchComponent.selectedRoom.isInvalid = true;
			else ApartmentSketchComponent.selectedRoom.isInvalid = false;
		}

		ApartmentSketchComponent.selectedRoom = undefined;
		ApartmentSketchComponent.selectedRoomIndex = -1;

		ApartmentSketchComponent.drawAllTables();
	}

}
