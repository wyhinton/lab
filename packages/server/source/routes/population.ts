import express from 'express';
import population from '../controllers/population';

const router = express.Router();

router.get('/get/:populationId', population.readPopulation);
router.get('/get_by_premise/:premiseId', population.readPopulationByPremisId);
router.get('/get', population.readAllPopulation);

export = router;
