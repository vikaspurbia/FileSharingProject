import express from 'express';
import { addUser } from '../controllers/userController';
import {getUsersEmails} from '../controllers/userController'
const router = express.Router();


router.post('/add-user', (req, res, next) => {
  console.log('Add user route hit'); // route hit
  addUser(req, res, next);
});

router.get('/emails', getUsersEmails);


export default router;
