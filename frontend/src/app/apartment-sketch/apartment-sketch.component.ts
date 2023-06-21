import { Component, OnInit } from '@angular/core';
import { ApartmentSketch, DoorPosition, ProgressState, RoomSketch } from '../models/ApartmentSketch';

@Component({
  selector: 'app-apartment-sketch',
  templateUrl: './apartment-sketch.component.html',
  styleUrls: ['./apartment-sketch.component.css']
})
export class ApartmentSketchComponent implements OnInit {
	static readonly MOVING_ROOM_FILL_COLOR: string = "#d3d3d3";
	static readonly BORDER_FILL_OFFSET: number = 2;
	static readonly AUTOFIX_OFFSET: number = 7;
	static  DOOR_HEIGHT: number = 0.95; // in meters
    static  DOOR_WIDTH: number = 0.95; // in meters
	static readonly CHANGE_DOOR_POSITION_THRESHOLD: number = 10;
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
	static showProgress: boolean = true;
	static editMode: boolean = true;
	static updateProgressMode: boolean = true;

	static isNewRoomAdded: boolean = false;
	static newRoomWidth: number = 10;
	static newRoomHeight: number = 3;
	static newRoomDoorPos: DoorPosition = DoorPosition.BOTTOM;

	static mousePosX: number;
	static mousePosY: number;
	static selectedRoomIndex: number = -1;
	static selectedRoom?: RoomSketch;
	static isDoorSelected: boolean = false;

	static screenSmallerSize: number;
	static ratio: number = 1;
	static ratioResizeChunk: number = 0.1;
	

	constructor() {}

	ngOnInit(): void {
		ApartmentSketchComponent.sketchCanvas = document.querySelector("#apartmentCanvas");
		ApartmentSketchComponent.sketchCanvasContext = ApartmentSketchComponent.sketchCanvas.getContext("2d");

		if(ApartmentSketchComponent.updateProgressMode) {
			ApartmentSketchComponent.editMode = false;
			ApartmentSketchComponent.showProgress = true;
		}

		if(!ApartmentSketchComponent.apartmentSketch){
			ApartmentSketchComponent.apartmentSketch = new ApartmentSketch(0.3125);

			ApartmentSketchComponent.apartmentSketch.roomSketches.push(new RoomSketch(5, 3, 10, 6, 1, 1, DoorPosition.LEFT, ProgressState.IN_PROGRESS));
			ApartmentSketchComponent.apartmentSketch.roomSketches.push(new RoomSketch(5, 3, 2, 10, 2, 1, DoorPosition.BOTTOM, ProgressState.FINISHED));
			ApartmentSketchComponent.apartmentSketch.roomSketches.push(new RoomSketch(8, 4));
		}

		ApartmentSketchComponent.doorTopImg = new Image(ApartmentSketchComponent.DOOR_WIDTH, ApartmentSketchComponent.DOOR_HEIGHT);
		ApartmentSketchComponent.doorBottomImg = new Image(ApartmentSketchComponent.DOOR_WIDTH, ApartmentSketchComponent.DOOR_HEIGHT);
		ApartmentSketchComponent.doorRightImg = new Image(ApartmentSketchComponent.DOOR_WIDTH, ApartmentSketchComponent.DOOR_HEIGHT);
		ApartmentSketchComponent.doorLeftImg = new Image(ApartmentSketchComponent.DOOR_WIDTH, ApartmentSketchComponent.DOOR_HEIGHT);

		ApartmentSketchComponent.doorTopImg.src = ApartmentSketchComponent.DOOR_TOP_SRC;
		ApartmentSketchComponent.doorBottomImg.src = ApartmentSketchComponent.DOOR_BOTTOM_SRC;
		ApartmentSketchComponent.doorRightImg.src = ApartmentSketchComponent.DOOR_RIGHT_SRC;
		ApartmentSketchComponent.doorLeftImg.src = ApartmentSketchComponent.DOOR_LEFT_SRC;


		ApartmentSketchComponent.screenSmallerSize 
								= (window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight) * 0.95;


		if(ApartmentSketchComponent.apartmentSketch?.roomSketches.length > 0) {
			ApartmentSketchComponent.setMeterToPixelRatio(ApartmentSketchComponent.apartmentSketch.roomSketches[0].projectWidth);
		}

		for(let rs of ApartmentSketchComponent.apartmentSketch.roomSketches) {
			rs.x = rs.savedX * ApartmentSketchComponent.ratio;
			rs.y = rs.savedY * ApartmentSketchComponent.ratio;

			rs.width = rs.projectWidth * ApartmentSketchComponent.ratio;
			rs.height = rs.projectHeight * ApartmentSketchComponent.ratio;
			rs.doorX *= ApartmentSketchComponent.ratio;
			rs.doorY *= ApartmentSketchComponent.ratio;
		}

		ApartmentSketchComponent.sketchCanvas.height = ApartmentSketchComponent.screenSmallerSize;
		ApartmentSketchComponent.sketchCanvas.style.height = `${ApartmentSketchComponent.screenSmallerSize}px`;
		ApartmentSketchComponent.sketchCanvas.width = ApartmentSketchComponent.screenSmallerSize;
		ApartmentSketchComponent.sketchCanvas.style.width = `${ApartmentSketchComponent.screenSmallerSize}px`;
		ApartmentSketchComponent.sketchCanvasClientRect = ApartmentSketchComponent.sketchCanvas.getBoundingClientRect();

		ApartmentSketchComponent.drawAllRoomSketches();

		ApartmentSketchComponent.sketchCanvas.addEventListener("mousedown", ApartmentSketchComponent.startPosition);
		ApartmentSketchComponent.sketchCanvas.addEventListener("mousemove", ApartmentSketchComponent.moveRoom);
		ApartmentSketchComponent.sketchCanvas.addEventListener("mouseup",   ApartmentSketchComponent.endPosition);
		ApartmentSketchComponent.sketchCanvas.addEventListener("mouseout",  ApartmentSketchComponent.endPosition);

		ApartmentSketchComponent.sketchCanvas.addEventListener("touchstart", ApartmentSketchComponent.startPositionMob);
		ApartmentSketchComponent.sketchCanvas.addEventListener("touchmove", ApartmentSketchComponent.moveRoomMob);
		ApartmentSketchComponent.sketchCanvas.addEventListener("touchcancel", ApartmentSketchComponent.endPosition);
		ApartmentSketchComponent.sketchCanvas.addEventListener("touchend", ApartmentSketchComponent.endPosition);
	}

	static setMeterToPixelRatio(firstRsWidth: number): void {
		const canvasSize = ApartmentSketchComponent.screenSmallerSize;
		const firstRsScreenUsage = ApartmentSketchComponent.apartmentSketch.firstRoomScreenUsage;
		// const firstRsWidth = ApartmentSketchComponent.apartmentSketch.roomSketches[0].width;
		ApartmentSketchComponent.ratio = (firstRsScreenUsage * canvasSize) / firstRsWidth;
		ApartmentSketchComponent.ratioResizeChunk = ApartmentSketchComponent.ratio / 10;
		ApartmentSketchComponent.DOOR_WIDTH *= ApartmentSketchComponent.ratio;
		ApartmentSketchComponent.DOOR_HEIGHT *= ApartmentSketchComponent.ratio;
	}

	static zoomHelper(oldRatio: number): void {
		ApartmentSketchComponent.DOOR_WIDTH *= (ApartmentSketchComponent.ratio / oldRatio);
		ApartmentSketchComponent.DOOR_HEIGHT *= (ApartmentSketchComponent.ratio / oldRatio);

		if(ApartmentSketchComponent.apartmentSketch?.roomSketches.length > 0) {
			const firstRsWidth = ApartmentSketchComponent.apartmentSketch.roomSketches[0].width;
			ApartmentSketchComponent.apartmentSketch.firstRoomScreenUsage = firstRsWidth / ApartmentSketchComponent.screenSmallerSize;
		}

		for(let rs of ApartmentSketchComponent.apartmentSketch.roomSketches) {
			rs.x = rs.x * ApartmentSketchComponent.ratio / oldRatio;
			rs.y = rs.y * ApartmentSketchComponent.ratio / oldRatio;

			rs.width *= ApartmentSketchComponent.ratio / oldRatio;
			rs.height *= ApartmentSketchComponent.ratio / oldRatio;
			rs.doorX *= ApartmentSketchComponent.ratio / oldRatio;
			rs.doorY *= ApartmentSketchComponent.ratio / oldRatio;
		}

		ApartmentSketchComponent.clearCanvas();
		ApartmentSketchComponent.drawAllRoomSketches();
	}

	zoomIn(): void {
		const oldRatio = ApartmentSketchComponent.ratio;
		ApartmentSketchComponent.ratio += ApartmentSketchComponent.ratioResizeChunk;

		ApartmentSketchComponent.zoomHelper(oldRatio);
	}

	zoomOut(): void {
		if(ApartmentSketchComponent.ratio - ApartmentSketchComponent.ratioResizeChunk == 0)
			return;

		const oldRatio = ApartmentSketchComponent.ratio;
		ApartmentSketchComponent.ratio -= ApartmentSketchComponent.ratioResizeChunk;

		ApartmentSketchComponent.zoomHelper(oldRatio);
	}

	static addNewRoom(e): void {
		// values in meters
		const projWidth = ApartmentSketchComponent.newRoomWidth;
		const projHeigth = ApartmentSketchComponent.newRoomHeight;
		let doorX = (projWidth - ApartmentSketchComponent.DOOR_WIDTH/ApartmentSketchComponent.ratio) / 2;
		let doorY = (projHeigth - ApartmentSketchComponent.DOOR_HEIGHT/ApartmentSketchComponent.ratio) / 2;

		if(!ApartmentSketchComponent.apartmentSketch 
				|| !ApartmentSketchComponent.apartmentSketch?.roomSketches 
				|| !ApartmentSketchComponent.apartmentSketch?.roomSketches.length) {
			
			ApartmentSketchComponent.apartmentSketch.firstRoomScreenUsage = 0.5;
			ApartmentSketchComponent.setMeterToPixelRatio(projWidth);
		}	
		
		// calculate values in pixels
		let width = projWidth * ApartmentSketchComponent.ratio;
		let heigth = projHeigth * ApartmentSketchComponent.ratio;
		doorX *= ApartmentSketchComponent.ratio;
		doorY *= ApartmentSketchComponent.ratio;
		
		let x = e.pageX - ApartmentSketchComponent.sketchCanvasClientRect.left - width/2;
		let y = e.pageY - ApartmentSketchComponent.sketchCanvasClientRect.top - heigth/2;
		
		// check if new room crossed border of canvas
		if(x < 0) x = 0;
		if(x + width > ApartmentSketchComponent.sketchCanvas.width) x = (ApartmentSketchComponent.sketchCanvas.width - width);
		if(y < 0) y = 0;
		if(y + heigth > ApartmentSketchComponent.sketchCanvas.height) y = (ApartmentSketchComponent.sketchCanvas.height - heigth);

		// console.log(width, heigth, x, y, doorX);

		let newRS: RoomSketch = new RoomSketch(projWidth, projHeigth, x/ApartmentSketchComponent.ratio, y/ApartmentSketchComponent.ratio, doorX, doorY, ApartmentSketchComponent.newRoomDoorPos);
		newRS.width = width;
		newRS.height = heigth;
		newRS.x = x;
		newRS.y = y;
		newRS.isSet = false;

		// console.log(newRS);

		ApartmentSketchComponent.apartmentSketch.roomSketches.push(newRS);

		// check if new room is colliding with some other room
		const index = ApartmentSketchComponent.apartmentSketch.roomSketches.length - 1;
		ApartmentSketchComponent.selectedRoom = ApartmentSketchComponent.apartmentSketch.roomSketches[index];
		ApartmentSketchComponent.selectedRoomIndex = index;
		ApartmentSketchComponent.isDoorSelected = false;
		ApartmentSketchComponent.mousePosX = x + width/2;
		ApartmentSketchComponent.mousePosY = y + heigth/2;

		for(let i = 0; i < ApartmentSketchComponent.apartmentSketch.roomSketches.length; i++) {
			
			if(i == ApartmentSketchComponent.selectedRoomIndex 
				|| ApartmentSketchComponent.apartmentSketch.roomSketches[i].isCollided) continue;

			const rs = ApartmentSketchComponent.apartmentSketch.roomSketches[i];
			if(ApartmentSketchComponent.checkForCollision(rs)) break;
		}

		ApartmentSketchComponent.drawAllRoomSketches();
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
		ApartmentSketchComponent.sketchCanvasContext.lineWidth = 2;

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

			if(ApartmentSketchComponent.showProgress) {
				switch(rs.progress) {
					case ProgressState.IN_PROGRESS: ApartmentSketchComponent.sketchCanvasContext.fillStyle = RoomSketch.IN_PROGRESS_FILL_COLOR; break;
					case ProgressState.FINISHED: ApartmentSketchComponent.sketchCanvasContext.fillStyle = RoomSketch.FINISHED_FILL_COLOR; break;
					default: ApartmentSketchComponent.sketchCanvasContext.fillStyle = "rgba(0, 0, 0, 0)";
				}

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

		// console.log(doorX, doorY);

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
				// console.log(rs);
			}
		});		
	}

	static startPositionMob(e): void {
		if(!ApartmentSketchComponent.editMode) return;

		let mouseEvt = new MouseEvent("click", {
			bubbles: true,
			cancelable: true,
			view: window,
			clientX: e.touches[0].clientX,
			clientY: e.touches[0].clientY
		});

		ApartmentSketchComponent.startPosition(mouseEvt, e.touches[0].pageX, e.touches[0].pageY);
	}

	static moveRoomMob(e): void {
		if(!ApartmentSketchComponent.editMode) return;

		let mouseEvt = new MouseEvent("click", {
			bubbles: true,
			cancelable: true,
			view: window,
			clientX: e.touches[0].clientX,
			clientY: e.touches[0].clientY
		});

		ApartmentSketchComponent.moveRoom(mouseEvt, e.touches[0].pageX, e.touches[0].pageY);
	}

	static startPosition(e, mobilePageX?, mobilePageY?): void {
		let mouseCurrX: number;
		let mouseCurrY: number;

		if(mobilePageX && mobilePageY) {
			mouseCurrX = mobilePageX - ApartmentSketchComponent.sketchCanvasClientRect.left;
			mouseCurrY = mobilePageY - ApartmentSketchComponent.sketchCanvasClientRect.top;
		} else {
			mouseCurrX = e.pageX - ApartmentSketchComponent.sketchCanvasClientRect.left;
			mouseCurrY = e.pageY - ApartmentSketchComponent.sketchCanvasClientRect.top;
		}

		// console.log(mouseCurrX, mouseCurrY, ApartmentSketchComponent.sketchCanvasClientRect.left, ApartmentSketchComponent.sketchCanvasClientRect.top, e.pageX, e.pageY);

		ApartmentSketchComponent.mousePosX = mouseCurrX;
		ApartmentSketchComponent.mousePosY = mouseCurrY;

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

		if(ApartmentSketchComponent.updateProgressMode) {
			document.getElementById("showUpdateProgresBtn").click();
			return;
		}

		if(!ApartmentSketchComponent.editMode) return;

		if(ApartmentSketchComponent.isNewRoomAdded) {
			ApartmentSketchComponent.addNewRoom(e);
			ApartmentSketchComponent.isNewRoomAdded = false;
			return;
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

	static moveRoom(e, mobilePageX?, mobilePageY?): void {
		if(!ApartmentSketchComponent.editMode || !ApartmentSketchComponent.selectedRoom) return;

		let mouseCurrX: number;
		let mouseCurrY: number;

		if(mobilePageX && mobilePageY) {
			mouseCurrX = mobilePageX - ApartmentSketchComponent.sketchCanvasClientRect.left;
			mouseCurrY = mobilePageY - ApartmentSketchComponent.sketchCanvasClientRect.top;
		} else {
			mouseCurrX = e.pageX - ApartmentSketchComponent.sketchCanvasClientRect.left;
			mouseCurrY = e.pageY - ApartmentSketchComponent.sketchCanvasClientRect.top;
		}
		 
		const threshold: number = ApartmentSketchComponent.CHANGE_DOOR_POSITION_THRESHOLD;

		// moving door within selected room sketch (if door is selected)
		if(ApartmentSketchComponent.isDoorSelected) {

			ApartmentSketchComponent.clearRoomSketch(ApartmentSketchComponent.selectedRoom);
			ApartmentSketchComponent.drawRoomSketch(ApartmentSketchComponent.selectedRoom);

			// for TOP and BOTTOM position of door, move door only horizontally
			if(ApartmentSketchComponent.selectedRoom.doorPosition == DoorPosition.TOP
				|| ApartmentSketchComponent.selectedRoom.doorPosition == DoorPosition.BOTTOM) {

				let errorX: boolean = false;
				const doorX: number = ApartmentSketchComponent.selectedRoom.doorX;
				
				// check and correct moving off the room sketch horizontally
				if(doorX + (mouseCurrX - ApartmentSketchComponent.mousePosX) < 0)
				{
					ApartmentSketchComponent.selectedRoom.doorX = 0;
					errorX = true;
				}
				if(doorX + (mouseCurrX - ApartmentSketchComponent.mousePosX) + ApartmentSketchComponent.DOOR_WIDTH > ApartmentSketchComponent.selectedRoom.width)
				{
					ApartmentSketchComponent.selectedRoom.doorX = ApartmentSketchComponent.selectedRoom.width- ApartmentSketchComponent.DOOR_WIDTH;
					errorX = true;
				}

				if(!errorX) ApartmentSketchComponent.selectedRoom.doorX = doorX + (mouseCurrX - ApartmentSketchComponent.mousePosX);


				const doorStartX: number = ApartmentSketchComponent.selectedRoom.doorX;
				const doorEndX: number = ApartmentSketchComponent.selectedRoom.doorX + ApartmentSketchComponent.DOOR_WIDTH;
				const mouseWithinRoomY: number = mouseCurrY - ApartmentSketchComponent.selectedRoom.y;

				// if door is near edges of room sketch and user is trying to move door vertically, change door position accordingly
				if(
					(
						mouseWithinRoomY > ApartmentSketchComponent.DOOR_HEIGHT + threshold 
					&& 
						ApartmentSketchComponent.selectedRoom.doorPosition == DoorPosition.TOP
					)

					||
					
					(
						mouseWithinRoomY < ApartmentSketchComponent.selectedRoom.height - ApartmentSketchComponent.DOOR_HEIGHT - threshold 
					&& 
						ApartmentSketchComponent.selectedRoom.doorPosition == DoorPosition.BOTTOM
					)
				) {

					if(doorStartX < threshold) {
						ApartmentSketchComponent.selectedRoom.doorY = ApartmentSketchComponent.selectedRoom.doorPosition == DoorPosition.TOP 
																	? 0 : ApartmentSketchComponent.selectedRoom.height - ApartmentSketchComponent.DOOR_HEIGHT;

						ApartmentSketchComponent.selectedRoom.doorPosition = DoorPosition.LEFT;
					}

					if(doorEndX > ApartmentSketchComponent.selectedRoom.width - threshold) {
						ApartmentSketchComponent.selectedRoom.doorY = ApartmentSketchComponent.selectedRoom.doorPosition == DoorPosition.TOP 
																	? 0 : ApartmentSketchComponent.selectedRoom.height - ApartmentSketchComponent.DOOR_HEIGHT;

						ApartmentSketchComponent.selectedRoom.doorPosition = DoorPosition.RIGHT;
					}
				}
				 
			}

			// for RIGHT and LEFT position of door, move door only vertically
			if(ApartmentSketchComponent.selectedRoom.doorPosition == DoorPosition.RIGHT
				|| ApartmentSketchComponent.selectedRoom.doorPosition == DoorPosition.LEFT) {

				let errorY: boolean = false;
				const doorY: number = ApartmentSketchComponent.selectedRoom.doorY;

				// check and correct moving off the room sketch vertically
				if(doorY + (mouseCurrY - ApartmentSketchComponent.mousePosY) < 0)
				{
					ApartmentSketchComponent.selectedRoom.doorY = 0;
					errorY = true;
				}
				if(doorY + (mouseCurrY - ApartmentSketchComponent.mousePosY) + ApartmentSketchComponent.DOOR_HEIGHT > ApartmentSketchComponent.selectedRoom.height)
				{
					ApartmentSketchComponent.selectedRoom.doorY = ApartmentSketchComponent.selectedRoom.height- ApartmentSketchComponent.DOOR_HEIGHT;
					errorY = true;
				}

				if(!errorY) ApartmentSketchComponent.selectedRoom.doorY = doorY + (mouseCurrY - ApartmentSketchComponent.mousePosY);


				const doorStartY: number = ApartmentSketchComponent.selectedRoom.doorY;
				const doorEndY: number = ApartmentSketchComponent.selectedRoom.doorY + ApartmentSketchComponent.DOOR_HEIGHT;
				const mouseWithinRoomX: number = mouseCurrX - ApartmentSketchComponent.selectedRoom.x;

				// if door is near edges of room sketch and user is trying to move door horizontally, change door position accordingly
				if(
					(
						mouseWithinRoomX > ApartmentSketchComponent.DOOR_WIDTH + threshold 
					&& 
						ApartmentSketchComponent.selectedRoom.doorPosition == DoorPosition.LEFT
					)

					||
					
					(
						mouseWithinRoomX < ApartmentSketchComponent.selectedRoom.width - ApartmentSketchComponent.DOOR_WIDTH - threshold 
					&& 
						ApartmentSketchComponent.selectedRoom.doorPosition == DoorPosition.RIGHT
					)
				) {

					if(doorStartY < threshold) {
						ApartmentSketchComponent.selectedRoom.doorX = ApartmentSketchComponent.selectedRoom.doorPosition == DoorPosition.LEFT 
																	? 0 : ApartmentSketchComponent.selectedRoom.width - ApartmentSketchComponent.DOOR_WIDTH;

						ApartmentSketchComponent.selectedRoom.doorPosition = DoorPosition.TOP;
						
					}

					if(doorEndY > ApartmentSketchComponent.selectedRoom.height - threshold) {
						ApartmentSketchComponent.selectedRoom.doorX = ApartmentSketchComponent.selectedRoom.doorPosition == DoorPosition.LEFT 
																	? 0 : ApartmentSketchComponent.selectedRoom.width - ApartmentSketchComponent.DOOR_WIDTH;

						ApartmentSketchComponent.selectedRoom.doorPosition = DoorPosition.BOTTOM;
					}
				}
			}

			ApartmentSketchComponent.mousePosX = mouseCurrX;
			ApartmentSketchComponent.mousePosY = mouseCurrY;

			return;
		}

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

			// if(((ApartmentSketchComponent.selectedRoom.y >= rs.y && ApartmentSketchComponent.selectedRoom.y < rs.y + rs.height) || (ApartmentSketchComponent.selectedRoom.y <= rs.y && ApartmentSketchComponent.selectedRoom.y + ApartmentSketchComponent.selectedRoom.height > rs.y)) && 
			//    ((ApartmentSketchComponent.selectedRoom.x <= rs.x && ApartmentSketchComponent.selectedRoom.x + ApartmentSketchComponent.selectedRoom.width > rs.x)  || (ApartmentSketchComponent.selectedRoom.x >= rs.x && ApartmentSketchComponent.selectedRoom.x < rs.x + rs.width))) {
			// 	ApartmentSketchComponent.selectedRoom.isCollided = true;
			// 	break;
			// }
			// else
			// 	ApartmentSketchComponent.selectedRoom.isCollided = false;

			if(ApartmentSketchComponent.checkForCollision(rs)) break;
		}

		// draw room sketch and update (last) mouse position
		ApartmentSketchComponent.drawRoomSketch(ApartmentSketchComponent.selectedRoom);
		if(!autofixedX) ApartmentSketchComponent.mousePosX = mouseCurrX;
		if(!autofixedY) ApartmentSketchComponent.mousePosY = mouseCurrY;
	}

	static checkForCollision(rs: RoomSketch): boolean {
		if(((ApartmentSketchComponent.selectedRoom.y >= rs.y && ApartmentSketchComponent.selectedRoom.y < rs.y + rs.height) || (ApartmentSketchComponent.selectedRoom.y <= rs.y && ApartmentSketchComponent.selectedRoom.y + ApartmentSketchComponent.selectedRoom.height > rs.y)) && 
			   ((ApartmentSketchComponent.selectedRoom.x <= rs.x && ApartmentSketchComponent.selectedRoom.x + ApartmentSketchComponent.selectedRoom.width > rs.x)  || (ApartmentSketchComponent.selectedRoom.x >= rs.x && ApartmentSketchComponent.selectedRoom.x < rs.x + rs.width))) {
			ApartmentSketchComponent.selectedRoom.isCollided = true;
			return true;
		}
		else {
			ApartmentSketchComponent.selectedRoom.isCollided = false;
			return false;
		}
	}

	static endPosition(): void {
		// if(!ApartmentSketchComponent.editMode) return;

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


	// html page fields and methods
	addNewRoomMode: boolean = false;
	newRoomW: number;
	newRoomH: number;
	newRoomDoorPos: string = "bottom";

	newRoomWErr: boolean = false;
	newRoomHErr: boolean = false;

	isUpdateProgressShown: boolean = false;
	rsToUpdate: RoomSketch;
	rsProgress: string;

	showAddNewRoom() {
		this.addNewRoomMode = true;
		ApartmentSketchComponent.updateProgressMode
	}

	hideAddNewRoom() {
		this.addNewRoomMode = false;
	}

	addNewRoomWrapper() {
		let isErrCatched = false;

		this.newRoomH = Number.parseInt(`${this.newRoomH}`);
		this.newRoomW = Number.parseInt(`${this.newRoomW}`);

		if(!this.newRoomH || typeof this.newRoomH != "number") {
			this.newRoomHErr = true;
			isErrCatched = true;
			this.newRoomH = undefined;
		}

		if(!this.newRoomW || typeof this.newRoomW != "number") {
			this.newRoomWErr = true;
			isErrCatched = true;
			this.newRoomW = undefined;
		}

		switch(this.newRoomDoorPos) {
			case "top": ApartmentSketchComponent.newRoomDoorPos = DoorPosition.TOP; break;
			case "right": ApartmentSketchComponent.newRoomDoorPos = DoorPosition.RIGHT; break;
			case "bottom": ApartmentSketchComponent.newRoomDoorPos = DoorPosition.BOTTOM; break;
			case "left": ApartmentSketchComponent.newRoomDoorPos = DoorPosition.LEFT; break;
		}

		if(isErrCatched) return;

		ApartmentSketchComponent.newRoomWidth = this.newRoomW;
		ApartmentSketchComponent.newRoomHeight = this.newRoomH;
		this.addNewRoomMode = false;
		ApartmentSketchComponent.isNewRoomAdded = true;
	}

	showUpdateProgress(): void {
		if(!ApartmentSketchComponent.selectedRoom) return
		
		this.rsToUpdate = ApartmentSketchComponent.selectedRoom;
		this.rsProgress = `${this.rsToUpdate.progress}`;
		this.isUpdateProgressShown = true;
	}

	hideUpdateProgress(): void {
		this.isUpdateProgressShown = false;
	}

	updateRoomProgressWrapper(): void {

		switch(this.rsProgress) {
			case `${ProgressState.NOT_STARTED}`: this.rsToUpdate.progress = ProgressState.NOT_STARTED; break; 
			case `${ProgressState.IN_PROGRESS}`: this.rsToUpdate.progress = ProgressState.IN_PROGRESS; break; 
			case `${ProgressState.FINISHED}`: this.rsToUpdate.progress = ProgressState.FINISHED; break; 
		}

		ApartmentSketchComponent.drawAllRoomSketches();
		this.isUpdateProgressShown = false;
	}
}
