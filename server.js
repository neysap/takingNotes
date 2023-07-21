const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(express.json());

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to serve the notes.html file
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Route to get all notes from the db.json file
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read notes data.' });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// Route to save a new note to the db.json file
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read notes data.' });
    } else {
      const notes = JSON.parse(data);
      newNote.id = Date.now().toString(); // Generate a unique ID for the note
      notes.push(newNote);
      fs.writeFile(
        path.join(__dirname, 'db', 'db.json'),
        JSON.stringify(notes),
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to save the note.' });
          } else {
            res.json(newNote);
          }
        }
      );
    }
  });
});

// Route to delete a note with a specific id
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read notes data.' });
    } else {
      const notes = JSON.parse(data);
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      fs.writeFile(
        path.join(__dirname, 'db', 'db.json'),
        JSON.stringify(updatedNotes),
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to delete the note.' });
          } else {
            res.json({ message: 'Note deleted successfully.' });
          }
        }
      );
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const { v4: uuidv4 } = require('uuid');

// const app = express();
// const PORT = process.env.PORT || 3001;


// app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));



// app.listen(PORT, () => {
//     console.log(`Listening on http://localhost:${PORT}`);
// });

// app.get('/api/notes', (req, res) => {
//     const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'db.json')));
//     res.json(notes);
//   });

//   app.post('/api/notes', (req, res) => {
//     const newNote = req.body;
//     const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'db.json')));
//     newNote.id = uuidv4(); 
//     notes.push(newNote);
//     fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes));
//     res.json(newNote);
//   });

//   app.get('/notes', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'notes.html'));
//   });

//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public','index.html'));
//   });

