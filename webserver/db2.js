// Import the 'pg' module
const { Client } = require('pg');

// Create a new client instance and set up the connection
const client = new Client({
  host: 'localhost',        // PostgreSQL host
  port: 5432,               // Default port for PostgreSQL
  user: 'postgres',    // Your PostgreSQL username
  password: 'postgres', // Your PostgreSQL password
  database: 'SIG15', // The database name you want to access
});

async function fetchData() {
  try {
    // Connect to the PostgreSQL server
    await client.connect();
    
    // Query the table (replace 'your_table' with the actual table name)
    const res = await client.query('SELECT * FROM presidentes_cmvc');
    
    // Log the results
    console.log(res.rows);  // Display the rows returned from the query
    
  } catch (err) {
    console.error('Error querying the database:', err.stack);
  } finally {
    // Close the connection
    await client.end();
  }
}

fetchData();
