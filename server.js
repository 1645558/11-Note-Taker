const fs = require('fs');
const express = require('express');
const path = require('path');
const notes = require('./Develop/db/db.json')
const { uuid } = require('./Develop/helpers/uuid.js');

const app = express();
const PORT = 3001;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./Develop/public'));

//get index.html file
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/Develop/public/index.html'))
);

//get notes.html file
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/Develop/public/notes.html'))
);

//get info from db.json
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a notes`);
    return res.json(notes);
});

//post info added to db.json
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a notes`);

    const { title, text } = req.body;

    if (title && text) {
        const newNotes = {
            title,
            text,
            noteId: uuid(),
        };

        const notesData = fs.readFileSync('./Develop/db/db.json', 'utf8');
        const reviews = notesData.length ? JSON.parse(notesData) : [];

        reviews.push(newNotes)

        const notesString = JSON.stringify(reviews, null, 2);

        fs.writeFile(`./Develop/db/db.json`, notesString, (err) =>
            err
                ? console.error(err)
                : console.log(
                    `Note for ${newNotes.title} has been written to JSON file`
                )
        );

        const response = {
            status: 'success',
            body: newNotes,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting review');
    }
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);