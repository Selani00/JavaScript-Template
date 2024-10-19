// adminModel.js
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

const adminSchema = `
CREATE TABLE IF NOT EXISTS admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
)
`;

db.query(adminSchema, (err) => {
    if (err) {
        console.log('Error creating admin table:', err);
        return;
    }
    console.log('Admin table created or already exists');
});

export default db;
