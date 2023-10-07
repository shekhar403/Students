import express from 'express';
export const mentorRouter = express.Router();
import { mentorCollection } from "../index.js";
import * as helper from '../helper.js';

// Creates new teachers
// format for mentor body
// {
//     "id": "mentor_1",
//     "name": "John Doe",
//     "email": "john@example.com",
//     "students": []
// }
mentorRouter.post("/addMentor", async (req, res) => {
    const mentor = req.body;
    const { acknowledged } = await helper.addMentorToDB(mentor);

    if (acknowledged) {
        res.send(`${mentor.name} added as mentor successfully`)
    }
    else {
        res.status(404).send("Some error occurred! Please try again");
    }
})

// Assigns students to mentor
// body : ["student_1", "student_2"]
mentorRouter.put("/addStudents/:mentorId", async (req, res) => {
    const mentorId = req.params.mentorId;
    let studentsToBeAdded = req.body;

    studentsToBeAdded.forEach(async id => {
        const { acknowledged } = await helper.addMentorToStudent(id, mentorId);

        if (!acknowledged) {
            res.status(404).send("Some error occurred! Please try again");
            return
        }
    });
    
    const { acknowledged } = await helper.assignStudentsToMentor(mentorId, studentsToBeAdded);

    if (acknowledged) {
        res.send(`${studentsToBeAdded.length} students assigned to mentor ${mentorId}`)
    }
    else {
        res.status(404).send("Some error occurred! Please try again");
    }
})

// get all assigned students of a mentor
// no body, simple get request
mentorRouter.get("/assignedStudents/:mentorId", async (req, res) => {
    const mentorId = req.params.mentorId;
    const mentor = await helper.getMentorFromDB(mentorId);

    if (mentor) {
        res.send(mentor.students);
    }
    else {
        res.status(404).send("Some error occurred! Please try again");
    }
})