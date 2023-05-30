enum ProgressState {
    NOT_STARTED = 1,
    IN_PROGRESS,
    FINISHED
}

class RoomSketch {
    static readonly FINISHED_FILL_COLOR: string = "#a6fa57";
    static readonly IN_PROGRESS_FILL_COLOR: string = "#fa5757";

    height: number;
    width: number;
    savedX: number;
    savedY: number;
    x: number;
    y: number;
    progress: ProgressState;
    isCollided: boolean;

    isSet?: boolean = false;


    constructor(height: number, width: number, savedX: number = 0, savedY: number = 0, progress = ProgressState.NOT_STARTED) {
        this.height = height;
        this.width = width;
        this.savedX = savedX;
        this.savedY = savedY;
        this.progress = progress;

        this.isSet = true;
        this.isCollided = false;
    }
}

class ApartmentSketch {
    roomSketches: RoomSketch[] = [];
}

export { ApartmentSketch, RoomSketch, ProgressState };