import { Component, OnInit } from '@angular/core';
import { ApartmentSketch, DoorPosition, ProgressState, RoomSketch } from '../models/ApartmentSketch';

@Component({
  selector: 'app-apartment-sketch',
  templateUrl: './apartment-sketch.component.html',
  styleUrls: ['./apartment-sketch.component.css']
})
export class ApartmentSketchComponent implements OnInit {
	static readonly MOVING_ROOM_FILL_COLOR: string = "#d3d3d3";
	static readonly BORDER_FILL_OFFSET: number = 1;
	static readonly AUTOFIX_OFFSET: number = 7;
	static readonly DOOR_HEIGHT: number = 50;
    static readonly DOOR_WIDTH: number = 50;
	static readonly DOOR_TOP_SRC: string = "/assets/appartment-sketch-component/doorTop.png";
	static readonly DOOR_BOTTOM_SRC: string = "/assets/appartment-sketch-component/doorBottom.png";
	static readonly DOOR_RIGHT_SRC: string = "/assets/appartment-sketch-component/doorRight.png";
	static readonly DOOR_LEFT_SRC: string = "/assets/appartment-sketch-component/doorLeft.png";

	static doorTopImg: HTMLImageElement;
	static doorBottomImg: HTMLImageElement;
	static doorRightImg: HTMLImageElement;
	static doorLeftImg: HTMLImageElement;

	static sketchCanvas;
	static sketchCanvasContext;
	static sketchCanvasClientRect;

	static apartmentSketch?: ApartmentSketch;

	static mousePosX: number;
	static mousePosY: number;
	static selectedRoomIndex: number = -1;
	static selectedRoom?: RoomSketch;
	static isDoorSelected: boolean = false;

	constructor() {}

	ngOnInit(): void {
		ApartmentSketchComponent.sketchCanvas = document.querySelector("#apartmentCanvas");
		ApartmentSketchComponent.sketchCanvasContext = ApartmentSketchComponent.sketchCanvas.getContext("2d");
		ApartmentSketchComponent.sketchCanvasClientRect = ApartmentSketchComponent.sketchCanvas.getBoundingClientRect();

		if(!ApartmentSketchComponent.apartmentSketch){
			ApartmentSketchComponent.apartmentSketch = new ApartmentSketch();

			ApartmentSketchComponent.apartmentSketch.roomSketches.push(new RoomSketch(150, 250, 500, 300, 50, 50, DoorPosition.LEFT, ProgressState.IN_PROGRESS));
			ApartmentSketchComponent.apartmentSketch.roomSketches.push(new RoomSketch(150, 250, 100, 500, 100, 50, DoorPosition.BOTTOM, ProgressState.FINISHED));
			ApartmentSketchComponent.apartmentSketch.roomSketches.push(new RoomSketch(200, 400));
		}

		ApartmentSketchComponent.doorTopImg = new Image(ApartmentSketchComponent.DOOR_WIDTH, ApartmentSketchComponent.DOOR_HEIGHT);
		ApartmentSketchComponent.doorBottomImg = new Image(ApartmentSketchComponent.DOOR_WIDTH, ApartmentSketchComponent.DOOR_HEIGHT);
		ApartmentSketchComponent.doorRightImg = new Image(ApartmentSketchComponent.DOOR_WIDTH, ApartmentSketchComponent.DOOR_HEIGHT);
		ApartmentSketchComponent.doorLeftImg = new Image(ApartmentSketchComponent.DOOR_WIDTH, ApartmentSketchComponent.DOOR_HEIGHT);

		ApartmentSketchComponent.doorTopImg.src = ApartmentSketchComponent.DOOR_TOP_SRC;
		ApartmentSketchComponent.doorBottomImg.src = ApartmentSketchComponent.DOOR_BOTTOM_SRC;
		ApartmentSketchComponent.doorRightImg.src = ApartmentSketchComponent.DOOR_RIGHT_SRC;
		ApartmentSketchComponent.doorLeftImg.src = ApartmentSketchComponent.DOOR_LEFT_SRC;

		for(let rs of ApartmentSketchComponent.apartmentSketch.roomSketches) {
			rs.x = rs.savedX;
			rs.y = rs.savedY;
		}

		ApartmentSketchComponent.sketchCanvas.height = "700";
		ApartmentSketchComponent.sketchCanvas.style.height = "700px";
		ApartmentSketchComponent.sketchCanvas.width = "800";
		ApartmentSketchComponent.sketchCanvas.style.width = "800px";
		ApartmentSketchComponent.drawAllRoomSketches();
		ApartmentSketchComponent.drawAllRoomSketches();

		ApartmentSketchComponent.sketchCanvas.addEventListener("mousedown", ApartmentSketchComponent.startPosition);
		ApartmentSketchComponent.sketchCanvas.addEventListener("mousemove", ApartmentSketchComponent.moveRoom);
		ApartmentSketchComponent.sketchCanvas.addEventListener("mouseup",   ApartmentSketchComponent.endPosition);
		ApartmentSketchComponent.sketchCanvas.addEventListener("mouseout",  ApartmentSketchComponent.endPosition);
	}

	static clearCanvas():  void {
		ApartmentSketchComponent.sketchCanvasContext
			.clearRect(0, 0, ApartmentSketchComponent.sketchCanvas.width, ApartmentSketchComponent.sketchCanvas.height);
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
			// return;
		} else {

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

		// draw door
		let doorX: number;
		let doorY: number;
		let doorImg: HTMLImageElement = null;

		switch(rs.doorPosition) {
			case DoorPosition.TOP: {
				doorX = rs.x + rs.doorX;
				doorY = rs.y;
				doorImg = ApartmentSketchComponent.doorTopImg;
				break;
			}

			case DoorPosition.BOTTOM: {
				doorX = rs.x + rs.doorX;
				doorY = rs.y + rs.height - ApartmentSketchComponent.DOOR_HEIGHT;
				doorImg = ApartmentSketchComponent.doorBottomImg;
				break;
			}

			case DoorPosition.RIGHT: {
				doorX = rs.x + rs.width - ApartmentSketchComponent.DOOR_WIDTH;
				doorY = rs.y + rs.doorY;
				doorImg = ApartmentSketchComponent.doorRightImg;
				break;
			}

			case DoorPosition.LEFT: {
				doorX = rs.x;
				doorY = rs.y + rs.doorY;
				doorImg = ApartmentSketchComponent.doorLeftImg;
				break;
			}
		}

		if(doorImg == null) return;

		if(doorImg.complete) {
			// console.log("COMPLETED");
			ApartmentSketchComponent.sketchCanvasContext.drawImage(doorImg, doorX, doorY, 
											ApartmentSketchComponent.DOOR_WIDTH, ApartmentSketchComponent.DOOR_HEIGHT);
		}
		else {
			// console.log("NOT-COMPLETED");
			doorImg.addEventListener("load", () => {
				ApartmentSketchComponent.sketchCanvasContext.drawImage(doorImg, doorX, doorY, 
											ApartmentSketchComponent.DOOR_WIDTH, ApartmentSketchComponent.DOOR_HEIGHT);
			});
		}
	}

	static drawAllRoomSketches(): void {
		ApartmentSketchComponent.apartmentSketch.roomSketches.forEach((rs, roomIndex) => {
			if(roomIndex != ApartmentSketchComponent.selectedRoomIndex) {
				ApartmentSketchComponent.drawRoomSketch(rs);
			}
		});		
	}

	static startPosition(e): void {
		const mouseCurrX: number = e.clientX - ApartmentSketchComponent.sketchCanvasClientRect.left;
		const mouseCurrY: number = e.clientY - ApartmentSketchComponent.sketchCanvasClientRect.top;

		ApartmentSketchComponent.mousePosX = mouseCurrX;
		ApartmentSketchComponent.mousePosY = mouseCurrY;

		// console.log(mouseCurrX, mouseCurrY);

		// going backwards through array, because sketch that was drawn later is showed on top, 
		// so when clicked on intersection between two sketches, the one with higher index should be selecteed
		for(let i: number = ApartmentSketchComponent.apartmentSketch.roomSketches.length - 1; i >= 0; i--) {
			let currRS: RoomSketch = ApartmentSketchComponent.apartmentSketch.roomSketches[i];
			if(mouseCurrX >= currRS.x && mouseCurrX <= currRS.x + currRS.width && mouseCurrY >= currRS.y && mouseCurrY <= currRS.y + currRS.height) {
				ApartmentSketchComponent.selectedRoomIndex = i;
				ApartmentSketchComponent.selectedRoom = currRS;
				ApartmentSketchComponent.selectedRoom.isSet = false;
				break;
			}
		}

		if(!ApartmentSketchComponent.selectedRoom) return;

		// check if click was on door within selected room
		const mouseWithinRoomX: number = mouseCurrX - ApartmentSketchComponent.selectedRoom.x;
		const mouseWithinRoomY: number = mouseCurrY - ApartmentSketchComponent.selectedRoom.y;

		const doorStartX: number = ApartmentSketchComponent.selectedRoom.doorX;
		const doorEndX: number = ApartmentSketchComponent.selectedRoom.doorX + ApartmentSketchComponent.DOOR_WIDTH;
		const doorStartY: number = ApartmentSketchComponent.selectedRoom.doorY;
		const doorEndY: number = ApartmentSketchComponent.selectedRoom.doorY + ApartmentSketchComponent.DOOR_HEIGHT;

		if(mouseWithinRoomX >= doorStartX && mouseWithinRoomX <= doorEndX && 
			(
				(mouseWithinRoomY <= ApartmentSketchComponent.DOOR_HEIGHT 
				&& ApartmentSketchComponent.selectedRoom.doorPosition == DoorPosition.TOP)
			||
				(mouseWithinRoomY >= ApartmentSketchComponent.selectedRoom.height - ApartmentSketchComponent.DOOR_HEIGHT 
				&& ApartmentSketchComponent.selectedRoom.doorPosition == DoorPosition.BOTTOM)
			)
		) {
			ApartmentSketchComponent.isDoorSelected = true;
		} else 
		if(mouseWithinRoomY >= doorStartY && mouseWithinRoomY <= doorEndY && 
			(
				(mouseWithinRoomX <= ApartmentSketchComponent.DOOR_WIDTH 
				&& ApartmentSketchComponent.selectedRoom.doorPosition == DoorPosition.LEFT)
			||
				(mouseWithinRoomX >= ApartmentSketchComponent.selectedRoom.width - ApartmentSketchComponent.DOOR_WIDTH 
				&& ApartmentSketchComponent.selectedRoom.doorPosition == DoorPosition.RIGHT)
			)
		) {
			ApartmentSketchComponent.isDoorSelected = true;
		}
	}

	static moveRoom(e): void {
		if(!ApartmentSketchComponent.selectedRoom) return;

		const mouseCurrX: number = e.clientX - ApartmentSketchComponent.sketchCanvasClientRect.left;
		const mouseCurrY: number = e.clientY - ApartmentSketchComponent.sketchCanvasClientRect.top;

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

		// auto-align functionality & detection of collision with other room sketches
		let autofixedX: boolean = false;
		let autofixedY: boolean = false;
		for(let i = 0; i < ApartmentSketchComponent.apartmentSketch.roomSketches.length; i++) {
			if(i == ApartmentSketchComponent.selectedRoomIndex) continue;

			let rs: RoomSketch = ApartmentSketchComponent.apartmentSketch.roomSketches[i];

			let rightSideOfMovingRS: number = ApartmentSketchComponent.selectedRoom.x + ApartmentSketchComponent.selectedRoom.width;
			let rightSideofStandingRS: number = rs.x + rs.width;

			// auto fixing X coordinate (left side of the moving room to the right side of standing rooms)
			if(ApartmentSketchComponent.selectedRoom.x > rightSideofStandingRS && ApartmentSketchComponent.selectedRoom.x <= rightSideofStandingRS + ApartmentSketchComponent.AUTOFIX_OFFSET) {
				ApartmentSketchComponent.selectedRoom.x = rightSideofStandingRS;
				autofixedX = true;
			}

			if(ApartmentSketchComponent.selectedRoom.x < rightSideofStandingRS && ApartmentSketchComponent.selectedRoom.x >= rightSideofStandingRS - ApartmentSketchComponent.AUTOFIX_OFFSET) {
				ApartmentSketchComponent.selectedRoom.x = rightSideofStandingRS;
				autofixedX = true;
			}

			// auto fixing X coordinate (right side of the moving room to the left side of standing rooms)
			if(rightSideOfMovingRS < rs.x && rightSideOfMovingRS >= rs.x - ApartmentSketchComponent.AUTOFIX_OFFSET) {
				ApartmentSketchComponent.selectedRoom.x = rs.x - ApartmentSketchComponent.selectedRoom.width;
				autofixedX = true;
			}

			if(rightSideOfMovingRS > rs.x && rightSideOfMovingRS <= rs.x + ApartmentSketchComponent.AUTOFIX_OFFSET) {
				ApartmentSketchComponent.selectedRoom.x = rs.x - ApartmentSketchComponent.selectedRoom.width;
				autofixedX = true;
			}

			// auto fixing X coordinate (left side of the moving room to the left side of standing rooms)
			if(ApartmentSketchComponent.selectedRoom.x > rs.x && ApartmentSketchComponent.selectedRoom.x <= rs.x + ApartmentSketchComponent.AUTOFIX_OFFSET) {
				ApartmentSketchComponent.selectedRoom.x = rs.x;
				autofixedX = true;
			}

			if(ApartmentSketchComponent.selectedRoom.x < rs.x && ApartmentSketchComponent.selectedRoom.x >= rs.x - ApartmentSketchComponent.AUTOFIX_OFFSET) {
				ApartmentSketchComponent.selectedRoom.x = rs.x;
				autofixedX = true;
			}

			// auto fixing X coordinate (right side of the moving room to the right side of standing rooms)
			if(rightSideOfMovingRS < rightSideofStandingRS && rightSideOfMovingRS >= rightSideofStandingRS - ApartmentSketchComponent.AUTOFIX_OFFSET) {
				ApartmentSketchComponent.selectedRoom.x = rightSideofStandingRS - ApartmentSketchComponent.selectedRoom.width;
				autofixedX = true;
			}

			if(rightSideOfMovingRS > rightSideofStandingRS && rightSideOfMovingRS <= rightSideofStandingRS + ApartmentSketchComponent.AUTOFIX_OFFSET) {
				ApartmentSketchComponent.selectedRoom.x = rightSideofStandingRS - ApartmentSketchComponent.selectedRoom.width;
				autofixedX = true;
			}


			let bottomSideOfMovingRS: number = ApartmentSketchComponent.selectedRoom.y + ApartmentSketchComponent.selectedRoom.height;
			let bottomSideofStandingRS: number = rs.y + rs.height;

			// auto fixing Y coordinate (top side of the moving room to the bottom side of standing rooms)
			if(ApartmentSketchComponent.selectedRoom.y > bottomSideofStandingRS && ApartmentSketchComponent.selectedRoom.y <= bottomSideofStandingRS + ApartmentSketchComponent.AUTOFIX_OFFSET) {
				ApartmentSketchComponent.selectedRoom.y = bottomSideofStandingRS;
				autofixedY = true;
			}

			if(ApartmentSketchComponent.selectedRoom.y < bottomSideofStandingRS && ApartmentSketchComponent.selectedRoom.y >= bottomSideofStandingRS - ApartmentSketchComponent.AUTOFIX_OFFSET) {
				ApartmentSketchComponent.selectedRoom.y = bottomSideofStandingRS;
				autofixedY = true;
			}

			// auto fixing Y coordinate (bottom side of the moving room to the top side of standing rooms)
			if(bottomSideOfMovingRS > rs.y && bottomSideOfMovingRS <= rs.y + ApartmentSketchComponent.AUTOFIX_OFFSET) {
				ApartmentSketchComponent.selectedRoom.y = rs.y - ApartmentSketchComponent.selectedRoom.height;
				autofixedY = true;
			}

			if(bottomSideOfMovingRS < rs.y && bottomSideOfMovingRS >= rs.y - ApartmentSketchComponent.AUTOFIX_OFFSET) {
				ApartmentSketchComponent.selectedRoom.y = rs.y - ApartmentSketchComponent.selectedRoom.height;
				autofixedY = true;
			}

			// auto fixing Y coordinate (top side of the moving room to the top side of standing rooms)
			if(ApartmentSketchComponent.selectedRoom.y > rs.y && ApartmentSketchComponent.selectedRoom.y <= rs.y + ApartmentSketchComponent.AUTOFIX_OFFSET) {
				ApartmentSketchComponent.selectedRoom.y = rs.y;
				autofixedY = true;
			}

			if(ApartmentSketchComponent.selectedRoom.y < rs.y && ApartmentSketchComponent.selectedRoom.y >= rs.y - ApartmentSketchComponent.AUTOFIX_OFFSET) {
				ApartmentSketchComponent.selectedRoom.y = rs.y;
				autofixedY = true;
			}

			// auto fixing Y coordinate (bottom side of the moving room to the bottom side of standing rooms)
			if(bottomSideOfMovingRS > bottomSideofStandingRS && bottomSideOfMovingRS <= bottomSideofStandingRS + ApartmentSketchComponent.AUTOFIX_OFFSET) {
				ApartmentSketchComponent.selectedRoom.y = bottomSideofStandingRS - ApartmentSketchComponent.selectedRoom.height;
				autofixedY = true;
			}

			if(bottomSideOfMovingRS < bottomSideofStandingRS && bottomSideOfMovingRS >= bottomSideofStandingRS - ApartmentSketchComponent.AUTOFIX_OFFSET) {
				ApartmentSketchComponent.selectedRoom.y = bottomSideofStandingRS - ApartmentSketchComponent.selectedRoom.height;
				autofixedY = true;
			}


			// don't check for collision with non-set room sketches
			if(!rs.isSet) continue;

			if(((ApartmentSketchComponent.selectedRoom.y >= rs.y && ApartmentSketchComponent.selectedRoom.y < rs.y + rs.height) || (ApartmentSketchComponent.selectedRoom.y <= rs.y && ApartmentSketchComponent.selectedRoom.y + ApartmentSketchComponent.selectedRoom.height > rs.y)) && 
			   ((ApartmentSketchComponent.selectedRoom.x <= rs.x && ApartmentSketchComponent.selectedRoom.x + ApartmentSketchComponent.selectedRoom.width > rs.x)  || (ApartmentSketchComponent.selectedRoom.x >= rs.x && ApartmentSketchComponent.selectedRoom.x < rs.x + rs.width))) {
				ApartmentSketchComponent.selectedRoom.isCollided = true;
				break;
			}
			else
				ApartmentSketchComponent.selectedRoom.isCollided = false;
		}

		// draw room sketch and update (last) mouse position
		ApartmentSketchComponent.drawRoomSketch(ApartmentSketchComponent.selectedRoom);
		if(!autofixedX) ApartmentSketchComponent.mousePosX = mouseCurrX;
		if(!autofixedY) ApartmentSketchComponent.mousePosY = mouseCurrY;
	}

	static endPosition(): void {
		if(ApartmentSketchComponent.selectedRoom) {
			if(ApartmentSketchComponent.selectedRoom.isCollided) {
				ApartmentSketchComponent.selectedRoom.isSet = false;
			}
			else {
				ApartmentSketchComponent.selectedRoom.isSet = true; 
				ApartmentSketchComponent.selectedRoom.savedX = ApartmentSketchComponent.selectedRoom.x;
				ApartmentSketchComponent.selectedRoom.savedY = ApartmentSketchComponent.selectedRoom.y;
			}
		}

		ApartmentSketchComponent.selectedRoom = undefined;
		ApartmentSketchComponent.selectedRoomIndex = -1;
		ApartmentSketchComponent.isDoorSelected = false;

		ApartmentSketchComponent.drawAllRoomSketches();
	}

}
