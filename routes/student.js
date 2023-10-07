import express from 'express';
export const studentRouter = express.Router();
import * as helper from '../helper.js';

// Creates new students
// format for student body
// {
//     "id": "student_1",
//     "name": "Alice Johnson",
//     "email": "alice@example.com"
// }
studentRouter.post("/addStudent", async (req, res) => {
    let student = req.body;
    let { acknowledged } = await helper.addStudentToDB(student);

    if (acknowledged) {
        res.send(`${student.name} added as student successfully`)
    }
    else {
        res.status(404).send("Some error occurred! Please try again");
    }
})

// gets the students who are not assigned to any mentors yet
studentRouter.get("/unassigned", async (req, res) => {
    let studentsNotAssigned = await helper.getAllUnassignedStudents();

    if (studentsNotAssigned) {
        res.send(studentsNotAssigned);
    }
    else {
        res.status(404).send("Some error occurred! Please try again");
    }
})

// Assigns or updates mentor of a student
// body : {
    // "mentorId": "mentor_2"
// }

studentRouter.put("/updateMentor/:studentId", async (req, res) => {
    const studentId = req.params.studentId;
    let mentorId = req.body.mentorId;
    const student = await helper.getStudentFromDB(studentId);

    if (student.mentor) {
        const { acknowledged } = await helper.removeStudentFromMentor(student.mentor, studentId);

        if (!acknowledged) {
            res.status(404).send("Some error occurred! Please try again");

            return;
        }
    }

    let { acknowledged } = await helper.assignStudentsToMentor(mentorId, [studentId]);
    if (!acknowledged) {
        res.status(404).send("Some error occurred! Please try again");

        return;
    }

    ({ acknowledged } = await helper.addMentorToStudent(studentId, mentorId));

    if (acknowledged) {
        res.send(`${studentId} assigned to mentor ${mentorId}`)
    }
    else {
        res.status(404).send("Some error occurred! Please try again");
    }
})

// gets all past mentors
// no body needed simple get request
studentRouter.get("/pastMentors/:studentId", async (req, res) => {
    const studentId = req.params.studentId;
    const student = await helper.getStudentFromDB(studentId);

    if (student) {
        res.send(student.pastMentors);
    }
    else {
        res.status(404).send("Some error occurred! Please try again");
    }
})