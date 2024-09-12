import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();


// Create a new record
router.post("/", async (req, res) => {
    try {
        const newDocument = {
            name: req.body.name,
            position: req.body.position,
            level: req.body.level,
        };
        const collection = db.collection("records");
        const result = await collection.insertOne(newDocument);
        res.status(201).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding record");
    }
});

// Update a record by ID
router.patch("/:id", async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send("Invalid ID format");
    }
    try {
        const query = { _id: new ObjectId(req.params.id) };
        const updates = {
            $set: {
                name: req.body.name,
                position: req.body.position,
                level: req.body.level,
            },
        };
        const collection = db.collection("records");
        const result = await collection.updateOne(query, updates);
        res.status(200).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating record");
    }
});

// Delete a record by ID
router.delete("/:id", async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send("Invalid ID format");
    }
    try {
        const query = { _id: new ObjectId(req.params.id) };
        const collection = db.collection("records");
        const result = await collection.deleteOne(query);
        res.status(200).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting record");
    }
});


export default router;