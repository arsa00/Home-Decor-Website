"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApartmentSketchModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = mongoose_1.default.Schema;
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
        type: mongoose_1.default.Types.ObjectId
    }
});
const ApartmentSketchModel = mongoose_1.default.model("ApartmentSketchModel", ApartmentSketch, "apartment_sketches");
exports.ApartmentSketchModel = ApartmentSketchModel;
//# sourceMappingURL=apartment-sketch.js.map