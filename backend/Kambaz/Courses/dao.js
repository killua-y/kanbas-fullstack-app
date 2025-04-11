import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export function findAllCourses() {
    return model.find();
}

// export function findCoursesForEnrolledUser(userId) {
//     return model.aggregate([
//         {
//             $lookup: {
//                 from: "enrollments",
//                 localField: "_id",
//                 foreignField: "course",
//                 as: "enrollments"
//             }
//         },
//         {
//             $match: {
//                 "enrollments.user": userId
//             }
//         }
//     ]);
// }

export function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    return model.create(newCourse);
}

export function deleteCourse(courseId) {
    return model.deleteOne({ _id: courseId });
}

export function updateCourse(courseId, courseUpdates) {
    return model.updateOne({ _id: courseId }, { $set: courseUpdates });
}

export function findUsersForCourse(cid) {
    return model.find({ course: cid }).populate("user");
}
