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



(async () => {
    try {
      // Connect the client once when the application starts
      await client.connect();
      console.log('Connected to the database');
    } catch (err) {
      console.error('Error connecting to the database:', err.stack);
    }
  })();
  
  // Define the endpoint
  app.get('/data1', async (req, res) => {
    try {
      const result = await client.query(
        'SELECT * FROM presidentes_cmvc ORDER BY id ASC'
      );
      console.log(result.rows); // Log the correct variable
      res.json(result.rows); // Send the rows as JSON
    } catch (err) {
      console.error('Error querying the database:', err.stack);
      res.status(500).json({ error: 'Database error' }); // Return a JSON error response
    }
  });
  
    // Define the endpoint
    app.get('/data2', async (req, res) => {
        try {
          const result = await client.query(
            'SELECT * FROM lojas_shopping ORDER BY id ASC'
          );
          console.log(result.rows); // Log the correct variable
          res.json(result.rows); // Send the rows as JSON
        } catch (err) {
          console.error('Error querying the database:', err.stack);
          res.status(500).json({ error: 'Database error' }); // Return a JSON error response
        }
      });

          // Define the endpoint
    app.get('/data3', async (req, res) => {
        try {
          const result = await client.query(
            'SELECT * FROM professores_estg ORDER BY id ASC'
          );
          console.log(result.rows); // Log the correct variable
          res.json(result.rows); // Send the rows as JSON
        } catch (err) {
          console.error('Error querying the database:', err.stack);
          res.status(500).json({ error: 'Database error' }); // Return a JSON error response
        }
      });


  // Start the server
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });