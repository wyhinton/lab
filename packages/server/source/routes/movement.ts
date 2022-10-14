import express from 'express';
import population from '../controllers/movement';

const router = express.Router();

router.get('/get/:movementId', population.readMovement);
router.get('/get', population.readAllMovement);
router.get('/get_recent_movements_to_premise/:premiseId', population.getRecentMovementsToPremise);
router.get('/get_recent_movements_from_premise/:premiseId', population.getRecentMovementsFromPremise);

export = router;
