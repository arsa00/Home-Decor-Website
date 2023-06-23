import mongoose from "mongoose";


const schema = mongoose.Schema;

let ApartmentSketch = new schema({
    
    roomSketches: {
        type: Array
    },
    firstRoomScreenUsage: {
        type: Number
    },
    type: {
        type: String
    },
    address: {
        type: String
    },
    squareFootage: {
        type: Number
    },
    ownerId: {
        type: mongoose.Types.ObjectId
    }

});


const ApartmentSketchModel = mongoose.model("ApartmentSketchModel", ApartmentSketch, "apartment_sketches");

export { ApartmentSketchModel } 