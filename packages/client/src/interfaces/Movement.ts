import { Document } from "mongoose";

export default interface ClientMovement extends Document {
  _id: string;
  account: string;
  new_movementreason: string;
  new_species: string;
  new_originaddress: string;
  new_origincity: string;
  new_originname: string;
  new_originpostalcode: string;
  new_originpremid: string;
  new_originstate: string;
  new_destinationaddress: string;
  new_destinationcity: string;
  new_destinationname: string;
  new_destinationpostalcode: string;
  new_destinationpremid: string;
  new_destinationstate: string;
  origin_Lat: string;
  origin_Lon: string;
  destination_Lat: string;
  destination_Long: string;
  new_numitemsmoved: string;
  new_shipmentsstartdate: string;
}
