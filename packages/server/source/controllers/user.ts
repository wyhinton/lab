import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import UserModel from '../models/userModel';
import bcryptjs from 'bcryptjs';
import mongoose from 'mongoose';
import signJWT from '../functions/signJWT';
import userModel from '../models/userModel';

const NAMESPACE = 'User';

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Token validated, user authorized');
    return res.status(200).json({
        message: 'Authorized'
    });
};
const register = (req: Request, res: Response, next: NextFunction) => {
    let { username, password } = req.body;

    bcryptjs.hash(password, 10, (hashError, hash) => {
        if (hashError) {
            return res.status(401).json({
                message: hashError.message,
                error: hashError
            });
        }

        const _user = new userModel({
            _id: new mongoose.Types.ObjectId(),
            username,
            password: hash
        });

        return _user
            .save()
            .then((user) => {
                logging.info(NAMESPACE, `Registered User: ${username}`);
                return res.status(201).json({
                    user
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    message: error.message,
                    error
                });
            });
    });
};
const login = (req: Request, res: Response, next: NextFunction) => {
    let { username, password } = req.body;
    console.log(username, password);
    return UserModel.find({ username })
        .then((users) => {
            if (users.length !== 1) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            console.log(JSON.stringify(users));
            bcryptjs.compare(password, users[0].password, (error, result) => {
                if (error) {
                    logging.error(NAMESPACE, error.message, error);
                    return res.status(401).json({ message: 'Unauthorized' });
                } else if (result) {
                    signJWT(users[0], (_error, token) => {
                        if (_error) {
                            logging.error(NAMESPACE, `Unable to sign token for user: ${username}`, error);
                            return res.status(401).json({ message: 'Unauthorized' });
                        } else if (token) {
                            logging.info(NAMESPACE, `Logged In User: ${username}`);
                            return res.status(200).json({
                                message: 'Auth Successful',
                                token,
                                user: users[0]
                            });
                        }
                    });
                }
            });
        })
        .catch((error) => res.status(500).json({ error }));
};
const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
    UserModel.find()
        .select('-password')
        .exec()
        .then((users) => {
            logging.info(NAMESPACE, `Returned ${users.length} Users`);
            return res.status(200).json({ users, count: users.length });
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
};

export default { validateToken, register, login, getAllUsers };
