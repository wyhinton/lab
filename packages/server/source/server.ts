import http from 'http';
import express from 'express';
import logging from './config/logging';
import config from './config/config';
import populationRoutes from './routes/population';
import movementRoutes from './routes/movement';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';

//**debug namespace */
const NAMESPACE = 'Server';
/**Connect to Mongo */

const router = express();

mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then((result) => {
        logging.info(NAMESPACE, 'Mongo Connected');
        StartServer();
    })
    .catch((error) => {
        logging.error(NAMESPACE, error.message, error);
    });

const StartServer = () => {
    /** Log the request */
    router.use((req, res, next) => {
        /** Log the req */
        logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            /** Log the res */
            logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
        });

        next();
    });

    /** Parse the body of the request */
    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    /** Rules of our API */
    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }

        next();
    });

    /** Routes go here */
    router.use('/data/populations', populationRoutes);
    router.use('/data/movements', movementRoutes);
    router.use('/users', userRoutes);

    /** Error handling */
    router.use((req, res, next) => {
        const error = new Error('Not found');

        logging.error(NAMESPACE, 'error', error);

        res.status(404).json({
            message: error.message
        });
    });

    const httpServer = http.createServer(router);

    httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`));
};
