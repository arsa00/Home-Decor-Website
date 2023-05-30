enum ProgressState {
    NOT_STARTED = 1,
    IN_PROGRESS,
    FINISHED
}

class RoomSketch {
    static readonly FINISHED_FILL_COLOR: string = "#a6fa57";
    static readonly UNFINISHED_FILL_COLOR: string = "#fa5757";

    height: number;
    width: number;
    x: number;
    y: number;
    progress: ProgressState;

    // isMoving?: boolean = false;
    isInvalid?: boolean = false

    constructor(height: number, width: number, x: number = 0, y: number = 0, isFilled: boolean = false, progress = ProgressState.NOT_STARTED) {
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;
        this.progress = progress;

        this.isInvalid = false;
    }
}

class ApartmentSketch {
    roomSketches: RoomSketch[] = [];
}

export { ApartmentSketch, RoomSketch, ProgressState };