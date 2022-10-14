import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import populationModel from '../models/populationModel';

const NAMESPACE = 'Population';

/**Get all the documents from the MongoDb "population" collection */
const readAllPopulation = (req: Request, res: Response, next: NextFunction) => {
    const collectionName = populationModel.collection.collectionName;
    return populationModel
        .find()
        .then((populations) => {
            logging.info(NAMESPACE, `read ${populations.length} population documents`);
            res.status(200).json({ collectionName, data: populations });
        })
        .catch((error) => res.status(500).json({ error }));
};

/**Get a single population document from the MongoDb */
const readPopulation = (req: Request, res: Response, next: NextFunction) => {
    const collectionName = populationModel.collection.collectionName;
    const populationId = req.params.populationId;
    return populationModel
        .findById(populationId)
        .then((population) => (population ? res.status(200).json({ collectionName, data: population }) : res.status(404).json({ message: `Animal ${populationId} Not Found` })))
        .catch((error) => res.status(500).json({ error }));
};

/**Find a single population document by its premiseid */
const readPopulationByPremiseId = (req: Request, res: Response, next: NextFunction) => {
    const collectionName = populationModel.collection.collectionName;
    const premiseId = req.params.premiseId;
    console.log(premiseId);
    return populationModel
        .findOne({ premiseid: premiseId })
        .then((population) => (population ? res.status(200).json({ collectionName, data: population }) : res.status(404).json({ message: `Animal ${premiseId} Not Found` })))
        .catch((error) => res.status(500).json({ error }));
};

export default { readAllPopulation, readPopulation, readPopulationByPremisId: readPopulationByPremiseId };
