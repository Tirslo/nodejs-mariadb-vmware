//require('newrelic');
const http = require('http');
const mariadb = require('mariadb');
const express = require('express');

const app = express();
const port = 5001;
const pool = mariadb.createPool({
    host: 'localhost', 
    port: 3306,
    user: 'map', 
    password: 'map',
    database: 'mariadb_node'
});
app.use(express.json());

app.listen(port, () => {
  console.log(`Books running on ${port}.`);
});

app.get('/titles', async(req, res) => {
    try {
        const result = await pool.query("SELECT title FROM books");
        await http.get('http://localhost:5001/deleteBook', (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            })
            res.on('end', () => {
                console.log(JSON.parse(data));
            });
            
            }).on("error", (err) => {
              console.log("Error: " + err);
        })

        await http.get('http://localhost:5001/addBook', (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            })
            res.on('end', () => {
                console.log(JSON.parse(data));
            });
            
            }).on("error", (err) => {
              console.log("Error: " + err);
        })
        res.send(result);
    } catch(err) {
        throw err;
    }
})

app.get('/deleteBook', async(req, res) => {
    try {
        const result = await pool.query("DELETE FROM books WHERE isbn = '0805210644'");
        res.send(result);
    } catch(err) {
        throw err;
    }
})

app.get('/addBook', async(req, res) => {
    try {
        const result = await pool.query("INSERT INTO books(title, author_id, isbn, year_pub)VALUES('America', '1', '0805210644', '1995');");
        res.send(result);
    } catch(err) {
        throw err;
    }
})

