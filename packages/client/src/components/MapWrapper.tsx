import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";

/**Provides a basic map container and tile layer on to which child feature components can be drawn */
const MapWrapper = ({
  children,
  center,
}: {
  center: LatLngExpression;
  children: JSX.Element | JSX.Element[];
}): JSX.Element => {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <MapContainer
        style={{ height: 400, width: "100%" }}
        center={center}
        zoom={6}
        scrollWheelZoom={false}
        //   bounds={mapBounds}
        boundsOptions={{ padding: [10, 10] }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
      </MapContainer>
    </div>
  );
};

export default MapWrapper;
