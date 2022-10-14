import {
  Box,
  Divider,
  List,
  ListItem,
  Skeleton,
  Typography,
} from "@mui/material";
import L, { LatLngBounds, latLngBounds, LatLngExpression } from "leaflet";
import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  LayerGroup,
} from "react-leaflet";
import { ClientMovementVisualization } from "./PopulationCard";

export const pointerIcon = new L.Icon({
  iconUrl: "https://image.flaticon.com/icons/svg/1673/1673221.svg",
  iconRetinaUrl: "https://image.flaticon.com/icons/svg/1673/1673221.svg",
  iconAnchor: [5, 55],
  popupAnchor: [10, -44],
  iconSize: [25, 55],
  shadowUrl:
    "https://lh3.googleusercontent.com/proxy/H5uTMYMQZkmIP8sV47EMrt88IVbLZn7waYpmTcek9lgsPduTuN_evF7dQzrBDvePR946nRN1zLC4jD0uetqaYC043SH8pg",
  shadowSize: [68, 95],
  shadowAnchor: [20, 92],
});

const MovementMap = ({
  markers,
}: {
  markers: ClientMovementVisualization[];
}): JSX.Element => {
  const position = { lat: 51.505, lng: -0.09 };

  const [mapBounds, setMapBounds] = useState<LatLngBounds | undefined>(
    undefined
  );
  const [mapCenter, setMapCenter] = useState<LatLngExpression | undefined>(
    undefined
  );

  useEffect(() => {
    console.log(markers);
    if (markers[0]) {
      const firstMarker = markers[0];
      const bounds = latLngBounds([
        firstMarker.positions[0],
        firstMarker.positions[1],
      ]);
      markers.forEach((m) => {
        m.positions.forEach((coord) => {
          bounds.extend(coord);
        });
      });
      console.log(bounds);
      setMapBounds(bounds);
      setMapCenter(markers[0].positions[0]);
    }
  }, [markers]);
  return (
    <div style={{ height: 400, width: "100%" }}>
      {mapCenter ? (
        <MapContainer
          style={{ height: 400, width: "100%" }}
          // center={mapCenter}
          zoom={5}
          scrollWheelZoom={false}
          bounds={mapBounds}
          boundsOptions={{ padding: [10, 10] }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((marker, i) => {
            console.log(marker);
            return (
              <LayerGroup key={i}>
                <PremiseMarker
                  position={marker.positions[0]}
                  premiseId={marker.markerData.data.new_originpremid}
                />
                <PremiseMarker
                  position={marker.positions[1]}
                  premiseId={marker.markerData.data.new_destinationpremid}
                />
                <MovementPath marker={marker} />
              </LayerGroup>
            );
          })}
        </MapContainer>
      ) : (
        <Skeleton height={400} />
      )}
    </div>
  );
};

const MovementPath = ({ marker }: { marker: ClientMovementVisualization }) => {
  return (
    <Polyline
      positions={marker.positions}
      pathOptions={marker.pathOptions}
      children={
        <Popup maxWidth={450} minWidth={300} maxHeight={500}>
          {<MovementLineDataDisplay marker={marker} />}
        </Popup>
      }
      eventHandlers={{
        mouseover: (e) => {
          e.target.setStyle({ fill: "blue" });
          e.target.openPopup();
        },
        mouseout: (e) => {
          e.target.closePopup();
        },
      }}
    />
  );
};

const PremiseMarker = ({
  position,
  premiseId,
}: {
  position: LatLngExpression;
  premiseId: string;
}): JSX.Element => {
  return (
    <Marker position={position}>
      <Popup maxWidth={300} minWidth={150} maxHeight={200}>
        <List>
          <ListItem secondaryAction={<div>{premiseId}</div>}>Premise:</ListItem>
        </List>
      </Popup>
    </Marker>
  );
};

const MovementLineDataDisplay = ({
  marker,
}: {
  marker: ClientMovementVisualization;
}): JSX.Element => {
  console.log(marker);
  return (
    <Box sx={{ width: 12 / 12 }}>
      <List dense sx={{ width: 12 / 12 }}>
        {marker.markerData.lineData.map((d: any, i: number) => {
          return (
            <>
              <ListItem key={i} secondaryAction={<div>{d.value}</div>}>
                <Typography variant={"caption"}>
                  {d.display.headerName}
                </Typography>
              </ListItem>
              <Divider />
            </>
          );
        })}
      </List>
    </Box>
  );
};
export default MovementMap;
