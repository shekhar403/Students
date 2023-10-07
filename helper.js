import { studentCollection, mentorCollection } from "./index.js";

export async function addStudentToDB(student) {
    const result = await studentCollection.insertOne(student);
    return result
}

export async function addMentorToDB(mentor) {
    const result = await mentorCollection.insertOne(mentor);
    return result
}

export async function getMentorFromDB(mentorId) {
    const result = await mentorCollection.findOne({ id: mentorId });
    return result
}

export async function getStudentFromDB(studentId) {
    const result = await studentCollection.findOne({ id: studentId });
    return result
}

export async function getAllUnassignedStudents() {
    const cursor = studentCollection.find({ mentor: undefined });
    let students = [];

    for await (const student of cursor) {
        students.push(student);
    }

    return students
}

export async function assignStudentsToMentor(mentorId, updatedStudents) {
    const update = { $push : {
        "students" : {
            $each : updatedStudents
        }
    }}

    const result = await mentorCollection.updateOne({ id: mentorId }, update);

    return result
}

export async function removeStudentFromMentor(mentorId, studentId) {
    const update = { $pull : {"students" : studentId }}

    const result = await mentorCollection.updateOne({ id: mentorId }, update);
    
    return result
}

export async function addMentorToStudent(studentId, mentorId) {
    const update = {
        $set: { mentor: mentorId 
        },
        $push: {
          pastMentors: mentorId,
        },
      };

    const result = await studentCollection.updateOne({ id: studentId }, update);
    return result
}

