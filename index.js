import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
import * as dotenv from 'dotenv';
import { mentorRouter } from './routes/mentor.js';
import { studentRouter } from './routes/student.js';

dotenv.config();
const app = express();
app.use(express.json());
const MONGO_URL = process.env.MONGO_URL;

async function createConnections() {
    const client = new MongoClient(MONGO_URL, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    await client.connect();
    return client
}

const client = await createConnections();
export const studentCollection = client.db("studentDB").collection("studentCollection");
export const mentorCollection = client.db("studentDB").collection("mentorCollection");

app.get("/", (req, res) => {
    res.write("Welcome to Students and Mentors Mapping API\n");
    res.write("1. Deployed url (render) :  https://studentsapi-l50o.onrender.com\n");
    res.write("2. Get all Students, Request method : GET, URL : https://studentsapi-l50o.onrender.com/student/\n")
    res.write("3. Get all mentors, Request method : GET, URL : https://studentsapi-l50o.onrender.com/mentor/\n")
    res.write("4. Create Mentor , Request method : POST, URL : https://studentsapi-l50o.onrender.com/mentor/addMentor\n")
    res.write(`   Body : { "id": "mentor_1", "name": "John Doe", "email": "john@example.com", "students": [] }\n`)
    res.write("5. Create Student, Request method : POST, URL : https://studentsapi-l50o.onrender.com/student/addStudent\n")
    res.write(`   Body : { "id": "student_1", "name": "Alice Johnson", "email": "alice@example.com" }\n`)
    res.write("6. Show Students that are not assigned to any mentor, Request method: GET, URL : https://studentsapi-l50o.onrender.com/student/unassigned\n")
    res.write("7. Assign students to Mentor, Request method: PUT, URL : https://studentsapi-l50o.onrender.com/mentor/\n")
    res.write("addStudents/{mentor_id}\n")
    res.write(`   Body : ["student_1", "student_2".....]\n`)
    res.write("8. add / update mentor of single student, Request method: PUT, URL : https://studentsapi-l50o.onrender.com/student/updateMentor/{student_id}\n")
    res.write(`   Body : { "mentorId": "mentor_2" }\n`)
    res.write("9. show all assigned students for mentor, Request method: GET, URL : https://studentsapi-l50o.onrender.com/mentor/assignedStudents/{mentor_id}\n")
    res.write("10. show all past mentors of a student, Request method: GET, URL : https://studentsapi-l50o.onrender.com/student/pastMentors/{student_id}\n")
})
app.use("/mentor", mentorRouter);
app.use("/student", studentRouter);

app.listen(5000, () => {
    console.log("running on port 5000")
})