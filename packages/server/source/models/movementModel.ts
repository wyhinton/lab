import mongoose, { Schema } from 'mongoose';
import IMovement from '../interfaces/IMovement';

const MovementSchema: Schema = new Schema(
    {
        _id: { type: String, required: true },
        account: { type: String, required: true },
        new_movementreason: { type: String, required: true },
        new_species: { type: String, required: true },
        new_originaddress: { type: String, required: true },
        new_origincity: { type: String, required: true },
        new_originname: { type: String, required: true },
        new_originpostalcode: { type: String, required: true },
        new_originpremid: { type: String, required: true },
        new_originstate: { type: String, required: true },
        new_destinationaddress: { type: String, required: true },
        new_destinationcity: { type: String, required: true },
        new_destinationname: { type: String, required: true },
        new_destinationpostalcode: { type: String, required: true },
        new_destinationpremid: { type: String, required: true },
        new_destinationstate: { type: String, required: true },
        origin_Lat: { type: String, required: true },
        origin_Lon: { type: String, required: true },
        destination_Lat: { type: String, required: true },
        destination_Long: { type: String, required: true },
        new_numitemsmoved: { type: String, required: true },
        new_shipmentsstartdate: { type: String, required: true },
        extraInformation: { type: String, required: true }
    },
    {
        timestamps: true,
        collection: 'movement'
    }
);

// MovementSchema.index({ name: 'text', new_originpremid: 'text' });
export default mongoose.model<IMovement>('Movement', MovementSchema);
