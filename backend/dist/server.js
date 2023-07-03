"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_router_1 = __importDefault(require("./routers/user.router"));
const path_1 = __importDefault(require("path"));
const agency_router_1 = __importDefault(require("./routers/agency.router"));
const apartment_sketch_router_1 = __importDefault(require("./routers/apartment-sketch.router"));
const job_router_1 = __importDefault(require("./routers/job.router"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
require('dotenv').config();
mongoose_1.default.connect(process.env.MONGO_DB);
const connection = mongoose_1.default.connection;
connection.once("open", () => {
    console.log("DB connected");
});
const router = express_1.default.Router();
router.use("/user", user_router_1.default);
router.use("/agency", agency_router_1.default);
router.use("/apartmentSketch", apartment_sketch_router_1.default);
router.use("/job", job_router_1.default);
//test
router.get("/", (req, res) => { res.send("Server working..."); });
app.use("/", router);
app.use("/images", express_1.default.static(path_1.default.join(__dirname, "../assets/images"))); // later maybe expand or shrink scope of static folder accessibility 
app.listen(process.env.PORT || 4005, () => console.log(`Express server running on port ${process.env.PORT || 4005}`));
//# sourceMappingURL=server.js.map