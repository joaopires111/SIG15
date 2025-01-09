const express = require('express'); // Import the Express module
const path = require('path'); // Import the Path module
const { Client } = require('pg');

const app = express();
const port = 3000;

// Set up your database client
const client = new Client({
    host: 'localhost',        // PostgreSQL host
    port: 5432,               // Default port for PostgreSQL
    user: 'postgres',    // Your PostgreSQL username
    password: 'postgres', // Your PostgreSQL password
    database: 'SIG15', // The database name you want to access
  });


  

// servir páginas estáticas da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor a correr em http://localhost:${port}`);
});

  app.get('/data', async (req, res) => {
    try {
      await client.connect();
      const result = await client.query('SELECT * FROM presidentes_cmvc');
      res.json(result.rows); // Send the rows as JSON
    } catch (err) {
      console.error('Error querying the database:', err.stack);
      res.status(500).send('Database error');
    } finally {
      await client.end();
    }
  });