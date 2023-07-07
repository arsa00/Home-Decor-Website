enum ProgressState {
    NOT_STARTED = 1,
    IN_PROGRESS,
    FINISHED
}

enum DoorPosition {
    TOP,
    RIGHT,
    BOTTOM,
    LEFT
}

enum ObjectType {
    APARTMENT = "Stan",
    HOUSE = "Kuca"
}

class RoomSketch {
    static readonly FINISHED_FILL_COLOR: string = "#a6fa57";
    static readonly IN_PROGRESS_FILL_COLOR: string = "#fa5757";

    height: number;
    width: number;
    projectHeight: number;
    projectWidth: number;
    savedX: number;
    savedY: number;
    x: number;
    y: number;
    progress: ProgressState;
    isCollided: boolean;

    doorX: number;
    doorY: number;
    doorPosition: DoorPosition;

    isSet: boolean = false;
    roomIndex: number;

    constructor(projectWidth: number, projectHeight: number, savedX: number = 0, savedY: number = 0, doorX: number = 0, doorY: number = 0, doorPosition: DoorPosition = DoorPosition.TOP, progress = ProgressState.NOT_STARTED, roomIndex: number) {
        this.projectWidth = projectWidth;
        this.projectHeight = projectHeight;
        this.savedX = savedX;
        this.savedY = savedY;
        this.progress = progress;

        this.doorX = doorX;
        this.doorY = doorY;
        this.doorPosition = doorPosition;
        this.roomIndex = roomIndex;

        this.isSet = true;
        this.isCollided = false;

        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    }
}

class ApartmentSketch {
    private static readonly MAX_ROOMS: number = 3;

    _id?: string;
    firstRoomScreenUsage: number;
    type: ObjectType;
    address: string;
    squareFootage: number;
    ownerId: string;
    roomSketches: RoomSketch[] = [];

    constructor(firstRoomScreenUsage?: number, type?: ObjectType, address?: string, squareFootage?: number, ownerId?: string, _id?: string) {
        this.firstRoomScreenUsage = firstRoomScreenUsage;
        this.type = type;
        this.address = address;
        this.squareFootage = squareFootage;
        this.ownerId = ownerId;
        this._id = _id;
    }


    static clone(apartmentSketch: ApartmentSketch): ApartmentSketch {
        let newAS = new ApartmentSketch(apartmentSketch.firstRoomScreenUsage, apartmentSketch.type, apartmentSketch.address, apartmentSketch.squareFootage, apartmentSketch.ownerId, apartmentSketch._id);

        for(let rs of apartmentSketch.roomSketches) {
            let newRS = new RoomSketch(rs.projectWidth, rs.projectHeight, rs.savedX, rs.savedY, rs.doorX, rs.doorY, rs.doorPosition, rs.progress, rs.roomIndex);
            
            newRS.x = rs.x;
            newRS.y = rs.y;
            newRS.width = rs.width;
            newRS.height = rs.height;
            newRS.isCollided = rs.isCollided;
            newRS.isSet = rs.isSet;
            
            newAS.roomSketches.push(newRS);
        }

        return newAS;
    }

    static checkRoomAvailability(roomCnt: number): boolean {
        return roomCnt < ApartmentSketch.MAX_ROOMS;
    }
}

export { ApartmentSketch, RoomSketch, ProgressState, DoorPosition, ObjectType };