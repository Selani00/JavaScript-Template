// adminController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/admin.model.js";
import { errorHandler } from "../utils/error.js";

export const register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO admin (username, password) VALUES (?, ?)";

    db.query(query, [username, hashedPassword], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error registering admin", error: err });
      }
      res.status(201).json({ message: "Admin registered successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const query = "SELECT * FROM admin WHERE username = ?";

  db.query(query, [username], async (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching admin", error: err });
    }
    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const admin = results[0];
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({
      message: "Admin logged in successfully",
      admin: {
        id: admin.id,
        username: admin.username,
      },
      token,
    });
  });
};

export const signout = (req, res, next) => {
  try {
    res.clearCookie("token").status(200).json("User has been signed out");
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
    const id = req.params.id; // Assuming admin ID is set in req.params.id by the route
    
    if (req.admin.id != req.params.id) {
      return next(errorHandler(403, 'You are not allowed to update this user'));
    }
    
    const { username, password } = req.body;

    try {
        let updates = [];
        let queryParams = [];

        if (username) {
            updates.push('username = ?');
            queryParams.push(username);
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push('password = ?');
            queryParams.push(hashedPassword);
        }

        queryParams.push(id);
        const updateQuery = `UPDATE admin SET ${updates.join(', ')} WHERE id = ?`;

        db.query(updateQuery, queryParams, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating profile', error: err });
            }

            const selectQuery = 'SELECT id, username FROM admin WHERE id = ?';
            db.query(selectQuery, [id], (err, results) => {
                if (err) {
                    return res.status(500).json({ message: 'Error fetching updated profile', error: err });
                }

                const updatedAdmin = results[0];
                res.status(200).json({
                    message: 'Profile updated successfully',
                    admin: updatedAdmin,
                });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

