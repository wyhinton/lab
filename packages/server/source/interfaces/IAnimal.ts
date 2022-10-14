import { Document } from 'mongoose';

export default interface IPopulation extends Document {
    _id: string;
    premiseid: string;
    total_animal: string;
}
