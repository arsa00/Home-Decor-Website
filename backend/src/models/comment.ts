import mongoose from "mongoose";


const schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

let Comment = new schema({

    agencyId: {
        type: ObjectId
    },
    comment: {
        type: String
    },
    grade: {
        type: Number
    },
    authorUsername: {
        type: String
    },
    authorFirstname: {
        type: String
    },
    authorLastname: {
        type: String
    },
    authorImgType: {
        type: String
    }

});


const CommentModel = mongoose.model("CommentModel", Comment, 'agency_comments');
export { CommentModel }