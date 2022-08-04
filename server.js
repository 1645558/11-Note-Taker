const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json')
const { uuid } = require('./utils/utils');

const PORT = process.env.PORT || 3001;
const app = express();

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));

//get index.html file
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, './public/index.html'))
);

//get notes.html file
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './public/notes.html'))
);

//get info from db.json
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);

    fs.readFile(path.join(__dirname, './db/db.json'), 'utf-8', (error, data) =>{
        if (error) throw new error;
        res.json(JSON.parse(data));
    })
});

//post info added to db.json
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received`);

    const { title, text } = req.body;

    if (title && text) {
        const newNotes = {
            title,
            text,
            id: uuid(),
        };
        notes.push(newNotes);
        
        let storedNotes = JSON.stringify((notes), null, 2);
        fs.writeFile(`./db/db.json`, storedNotes, () => {
            const response = {
                body: newNotes,
            }
            res.json(response);
        })
    }
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);