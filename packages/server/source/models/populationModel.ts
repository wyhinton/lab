import mongoose, { Schema } from 'mongoose';
import IPopulation from '../interfaces/IAnimal';

const PopulationSchema: Schema = new Schema(
    {
        premiseid: { type: String, required: true },
        total_animal: { type: String, required: true },
        extraInformation: { type: String, required: true }
    },
    {
        timestamps: true,
        collection: 'population'
    }
);

export default mongoose.model<IPopulation>('Population', PopulationSchema);
