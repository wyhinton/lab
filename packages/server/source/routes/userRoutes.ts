import express from 'express';
import user from '../controllers/user';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

router.get('/validate', extractJWT, user.validateToken);
router.post('/login', user.login);
router.post('/register', user.register);
router.get('/get/all', user.getAllUsers);

const userRoutes = router;
export default userRoutes;
