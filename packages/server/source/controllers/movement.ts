import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import movementModel from '../models/movementModel';

const NAMESPACE = 'Movement';

/**Get all the documents from the MongoDb "population" collection */
const readAllMovement = (req: Request, res: Response, next: NextFunction) => {
    movementModel.collection.collectionName;
    const collectionName = movementModel.collection.collectionName;
    return movementModel
        .find()
        .then((movements) => {
            logging.info(NAMESPACE, `read ${movements.length} movement documents`);
            res.status(200).json({ collectionName, data: movements });
        })
        .catch((error) => res.status(500).json({ error }));
};

/**Get a single population document from the MongoDb */
const readMovement = (req: Request, res: Response, next: NextFunction) => {
    const movementId = req.params.movementId;
    const collectionName = movementModel.collection.collectionName;
    return movementModel
        .findById(movementId)
        .then((movement) => (movement ? res.status(200).json({ collectionName, data: movement }) : res.status(404).json({ message: `Animal Movement ${movementId} Not Found` })))
        .catch((error) => res.status(500).json({ error }));
};

/**Search movement documents for documents which have a provided destination premise id */
const getRecentMovementsToPremise = (req: Request, res: Response, next: NextFunction) => {
    const premiseId = req.params.premiseId;
    console.log(premiseId);
    console.log(req.params);
    return movementModel
        .find({ new_destinationpremid: premiseId })
        .then((population) => (population ? res.status(200).json(population) : res.status(404).json({ message: `Retrieved recent movements to premise ${premiseId} Not Found` })))
        .catch((error) => {
            logging.error(NAMESPACE, 'getRecentMovementsToPremise', { error });
            res.status(500).json({ error });
        });
};
/**Search movement documents for documents which have a provided origin premise id */
const getRecentMovementsFromPremise = (req: Request, res: Response, next: NextFunction) => {
    const premiseId = req.params.premiseId;
    // var pattern = '^[a-zA-Z0-9_]*$';
    var pattern = `${premiseId}`;
    return (
        movementModel
            .find({ new_originpremid: { $regex: pattern, $options: 'x' } })
            // .find({ new_originpremid: premiseId })
            .then((population) => (population ? res.status(200).json(population) : res.status(404).json({ message: `Retrieved recent movements to premise ${premiseId} Not Found` })))
            .catch((error) => {
                logging.error(NAMESPACE, 'getRecentMovementsFromPremise', { error });
                res.status(500).json({ error });
            })
    );
};

export default { readAllMovement, readMovement, getRecentMovementsToPremise, getRecentMovementsFromPremise };
