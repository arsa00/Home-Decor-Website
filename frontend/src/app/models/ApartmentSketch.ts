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


    constructor(projectWidth: number, projectHeight: number, savedX: number = 0, savedY: number = 0, doorX: number = 0, doorY: number = 0, doorPosition: DoorPosition = DoorPosition.TOP, progress = ProgressState.NOT_STARTED) {
        this.projectWidth = projectWidth;
        this.projectHeight = projectHeight;
        this.savedX = savedX;
        this.savedY = savedY;
        this.progress = progress;

        this.doorX = doorX;
        this.doorY = doorY;
        this.doorPosition = doorPosition;

        this.isSet = true;
        this.isCollided = false;

        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    }
}

class ApartmentSketch {
    firstRoomScreenUsage: number;
    type: ObjectType;
    address: string;
    squareFootage: number;
    roomSketches: RoomSketch[] = [];

    constructor(firstRoomScreenUsage?: number) {
        this.firstRoomScreenUsage = firstRoomScreenUsage;
    }


    static clone(apartmentSketch: ApartmentSketch): ApartmentSketch {
        let newAS = new ApartmentSketch(apartmentSketch.firstRoomScreenUsage);

        for(let rs of apartmentSketch.roomSketches) {
            let newRS = new RoomSketch(rs.projectWidth, rs.projectHeight, rs.savedX, rs.savedY, rs.doorX, rs.doorY, rs.doorPosition, rs.progress);
            newAS.roomSketches.push(newRS);
        }

        return newAS;
    }
}

export { ApartmentSketch, RoomSketch, ProgressState, DoorPosition, ObjectType };