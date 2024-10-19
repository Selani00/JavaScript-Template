// adminRoutes.js
import express from 'express';
import { register, login, signout, updateProfile } from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/signout', signout);
router.put('/update/:id',verifyToken, updateProfile);

export default router;
