class RoomSketch {
    height: number = 150;
    width: number = 400;
    x: number = 0;
    y: number = 0;

    // isMoving?: boolean = false;
    isInvalid?: boolean = false

    constructor(height: number, width: number, x: number = 0, y: number = 0) {
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;

        this.isInvalid = false;
    }
}

class ApartmentSketch {
    roomSketches: RoomSketch[] = [];
}

export { ApartmentSketch, RoomSketch };