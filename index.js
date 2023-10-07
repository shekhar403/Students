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



// format for mentor update body
// {
//     "students": ["student_1"]
// }
app.put("/assignStudentsToMentor/:id", async (req, res) => {
    let studentsToAdd = req.body.students;
    let mentorId = req.params.id;
   
    try {
        studentsToAdd.forEach(element => {
            
        });
        let mentor = await mentorCollection.findOne({ id: mentorId });
        let studentsAdded = mentor.students;
        studentsToAdd = [...studentsAdded, ...studentsToAdd];
        console.log(mentor);
        console.log(studentsToAdd);
        let result = await mentorCollection.updateOne({ id: mentorId }, {$set: {"students" : studentsToAdd}});
        console.log(result);
        res.send("Mentor updated successfully..");
    }
    catch (error) {
        res.send(`error: ${error}`);
    }
})

app.use("/mentor", mentorRouter);
app.use("/student", studentRouter);

app.listen(5000, () => {
    console.log("running on port 5000")
})