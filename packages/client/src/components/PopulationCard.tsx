import {
  Box,
  Divider,
  Icon,
  List,
  ListItem,
  Skeleton,
  Typography,
} from "@mui/material";
import { DataGrid, GridColumns, GridRenderCellParams } from "@mui/x-data-grid";
import L, { LatLngExpression, PathOptions } from "leaflet";
import { useState, useEffect, useRef } from "react";
import { LayerGroup, Marker, Popup, Polyline } from "react-leaflet";
import { Link, useParams } from "react-router-dom";
import useDataTable, { ColumnNaming } from "../hooks/useDataTable";
import useGetPopulationByPremiseId from "../hooks/useGetPopulationByPremisId";
import usePopulationMovementData from "../hooks/usePopulationMovementData";
import { State } from "../interfaces/HookUtilities";
import ClientMovement from "../interfaces/Movement";
import PopulationClient from "../interfaces/PopulationClient";
import ErrorOverlay from "./ErrorOverlay";
import MapWrapper from "./MapWrapper";
import { renderToStaticMarkup } from "react-dom/server";
import "leaflet-arrowheads";

const RenderCellWithLink = (params: GridRenderCellParams<any>) => {
  const { content } = useParams();
  const referencedPop = useGetPopulationByPremiseId(
    "populations",
    params.value
  );
  const [linkUrl, setLinkUrl] = useState<string>("");

  useEffect(() => {
    const linkedPopulation = referencedPop.data?.data as ClientMovement;
    if (linkedPopulation) {
      const url = `/data/${content}/${linkedPopulation._id}`;
      setLinkUrl(url);
    }
  }, [referencedPop.data]);
  return <Link to={linkUrl}>{params.value}</Link>;
};

// type ColumnEntry<T> = {
//   [key: string]: Partial<GridEnrichedColDef>;
// };
// interface ColumnDictionary<T> {
//   shared: ColumnEntry<T>;
//   [key: string]: ColumnEntry<T> | (() => ColumnDictionary<T>);
// }

// const columnDict: ColumnDictionary<ClientMovement> = {
//   shared: {
//     new_movementreason: { headerName: "Reason", width: 200 },
//     new_numitemsmoved: { headerName: "Number Moved", width: 150 },
//   },
//   outgoing: () => {
//     const shared = this.shared
//     return {
//       ...this.shared,
//       new_destinationpremid: {
//         headerName: "Destination ID",
//         width: 150,
//         renderCell: RenderCellWithLink,
//       },
//       new_destinationname: { headerName: "Destination Name", width: 100 },
//       new_destinationaddress: { headerName: "Destination Address", width: 200 },
//       new_destinationcity: { headerName: "Destination City", width: 150 },
//       new_destinationstate: { headerName: "Destination State", width: 150 },
//     };
//   },
// };
const sharedColumns: ColumnNaming<ClientMovement> = {
  new_movementreason: { headerName: "Reason", width: 200 },
  new_numitemsmoved: { headerName: "Number Moved", width: 150 },
};

const outgoingMovementsColumns: ColumnNaming<ClientMovement> = {
  ...sharedColumns,
  new_destinationpremid: {
    headerName: "Destination ID",
    width: 150,
    renderCell: RenderCellWithLink,
  },
  new_destinationname: { headerName: "Destination Name", width: 100 },
  new_destinationaddress: { headerName: "Destination Address", width: 200 },
  new_destinationcity: { headerName: "Destination City", width: 150 },
  new_destinationstate: { headerName: "Destination State", width: 150 },
};

const incomingMovementsColumns: ColumnNaming<ClientMovement> = {
  ...sharedColumns,
  new_originpremid: {
    headerName: "Origin ID",
    width: 200,
    renderCell: RenderCellWithLink,
  },
  new_originname: { headerName: "Entity Name", width: 200 },
  new_originaddress: { headerName: "Origin Address", width: 200 },
  new_origincity: { headerName: "Origin City", width: 150 },
  new_originstate: { headerName: "Origin State", width: 100 },
};

type ClientMovementData = Pick<
  ClientMovement,
  "destination_Lat" | "destination_Long" | "origin_Lat" | "origin_Lon"
>;

export interface ClientMovementVisualization {
  positions: LatLngExpression[];
  markerData: any | undefined;
  pathOptions: PathOptions;
}

function makeMarkerData<T>(data: T, mappings: ColumnNaming<T>) {
  const displayKeys = Object.keys(mappings);

  const lineData = displayKeys.reduce((displayDataAcc, key) => {
    //@ts-ignore
    if (data[key]) {
      //@ts-ignore
      const markerData = { display: mappings[key], value: data[key] };
      //@ts-ignore
      displayDataAcc.push(markerData);
    }
    return displayDataAcc;
  }, []);
  return {
    lineData,
    data,
  };
}

function makeMarkersForMovement<T>(
  movements: ClientMovementData[],
  mappings?: ColumnNaming<T>
): ClientMovementVisualization[] {
  return movements.reduce<ClientMovementVisualization[]>((acc, curMovement) => {
    const { destination_Lat, destination_Long, origin_Lat, origin_Lon } =
      curMovement;
    if (destination_Lat && destination_Long && origin_Lat && origin_Lon) {
      const start = {
        lat: parseFloat(origin_Lat),
        lng: parseFloat(origin_Lon),
      };
      const end = {
        lat: parseFloat(destination_Lat),
        lng: parseFloat(destination_Long),
      };
      acc.push({
        positions: [start, end],
        pathOptions: {
          color: "red",
          opacity: 1,
          weight: 10,
        },
        markerData: mappings
          ? makeMarkerData(curMovement, mappings)
          : undefined,
      });
    }
    return acc;
  }, []);
}

/**Dictionary of Leaflet DivIcons created by converting Material UI Icons into plain html */
const markerMap = {
  premise: () => {
    const iconMarkup = renderToStaticMarkup(
      <Icon fontSize={"medium"}>radio_button_checked</Icon>
    );
    const customMarkerIcon = L.divIcon({
      html: iconMarkup,
      iconSize: new L.Point(30, 30),
    });
    return customMarkerIcon;
  },
  activePremise: () => {
    const iconMarkup = renderToStaticMarkup(
      <Icon fontSize={"large"}>home</Icon>
    );
    const customMarkerIcon = L.divIcon({
      html: iconMarkup,
      iconSize: new L.Point(70, 70),
    });
    return customMarkerIcon;
  },
};

const PopulationCard = ({ data }: { data: PopulationClient }): JSX.Element => {
  const { recentMovementsFrom, recentMovementsTo } = usePopulationMovementData(
    data.premiseid
  );
  const [mapMarkers, setMapMarkers] = useState<ClientMovementVisualization[]>(
    []
  );
  const [premiseLocation, setPremiseLocation] = useState<
    LatLngExpression | undefined
  >(undefined);

  useEffect(() => {
    console.log(recentMovementsFrom, recentMovementsTo);
    if (recentMovementsFrom.data && recentMovementsTo.data) {
      const incomingMovementsMapData = makeMarkersForMovement(
        recentMovementsTo.data,
        incomingMovementsColumns
      );
      const outgoingMovementsMapData = makeMarkersForMovement(
        recentMovementsFrom.data,
        outgoingMovementsColumns
      );
      setMapMarkers([...incomingMovementsMapData, ...outgoingMovementsMapData]);

      //workaround for the lack of having a lat/long for a premise in our populations records
      //if there are incoming movements to the premise, use the destination coordinates as the premise coordinates
      //if there are no incoming movements, look for outgoing movements and use the origin coordinates as the premise coordinates
      if (recentMovementsFrom.data.length > 0) {
        let first = recentMovementsFrom.data[0];
        setPremiseLocation({
          lat: parseFloat(first.origin_Lat),
          lng: parseFloat(first.origin_Lon),
        });
      } else if (recentMovementsTo.data.length > 0) {
        let first = recentMovementsTo.data[0];
        setPremiseLocation({
          lat: parseFloat(first.destination_Lat),
          lng: parseFloat(first.destination_Long),
        });
      }
    }
  }, [recentMovementsFrom, recentMovementsTo]);

  return (
    <List>
      <ListItem>
        {premiseLocation ? (
          <MapWrapper center={premiseLocation}>
            {mapMarkers.map((marker, i) => {
              console.log(marker);
              return (
                <LayerGroup key={i}>
                  <PremiseMarker
                    curPremise={data.premiseid}
                    position={marker.positions[0]}
                    premiseId={marker.markerData.data.new_originpremid}
                  />
                  <PremiseMarker
                    curPremise={data.premiseid}
                    position={marker.positions[1]}
                    premiseId={marker.markerData.data.new_destinationpremid}
                  />
                  <MovementPath marker={marker} />
                </LayerGroup>
              );
            })}
          </MapWrapper>
        ) : (
          <></>
        )}
      </ListItem>
      <ListItem>{`Premise Id: ${data.premiseid}`}</ListItem>
      <ListItem>{`Total Animal Population: ${data.total_animal}`}</ListItem>
      <ListItem>
        <Typography variant="h6">Animals Moving out of Premise</Typography>
      </ListItem>
      <ListItem>
        <CardTable
          dataState={recentMovementsFrom}
          mappings={outgoingMovementsColumns}
          noDataMessage="No Recent Movements From This Population Found"
        />
      </ListItem>
      <ListItem>
        <Typography variant="h6">Animals Moving in to Premise</Typography>
      </ListItem>
      <ListItem style={{ lineHeight: 1 }}>
        <CardTable
          dataState={recentMovementsTo}
          mappings={incomingMovementsColumns}
          noDataMessage="No Recent Movements To This Population Found"
        />
      </ListItem>
    </List>
  );
};

export default PopulationCard;

interface CardTableProps<T> {
  dataState: State<T[]>;
  mappings: ColumnNaming<T>;
  noDataMessage?: string;
  idField?: string;
}

const PremiseMarker = ({
  position,
  premiseId,
  curPremise,
}: {
  position: LatLngExpression;
  premiseId: string;
  curPremise: string;
}): JSX.Element => {
  return (
    <Marker
      position={position}
      icon={
        premiseId === curPremise
          ? markerMap.activePremise()
          : markerMap.premise()
      }
    >
      <Popup maxWidth={300} minWidth={150} maxHeight={200}>
        <List>
          <ListItem secondaryAction={<div>{premiseId}</div>}>Premise:</ListItem>
        </List>
      </Popup>
    </Marker>
  );
};

const MovementPath = ({ marker }: { marker: ClientMovementVisualization }) => {
  //we need to reformat the long and lattitude as well as the js module leaflet-arrowheads because react-leaflet-arrowheads is broken
  const t = marker.positions.map((p) => {
    //@ts-ignore
    return [p.lat, p.lng];
  });
  const lineRef = useRef() as React.MutableRefObject<L.Polyline>;

  useEffect(() => {
    if (lineRef.current) {
      //@ts-ignore
      lineRef.current.arrowheads({ size: "10px" });
    }
  });

  return (
    <Polyline
      ref={lineRef}
      positions={marker.positions}
      pathOptions={marker.pathOptions}
      children={
        <Popup maxWidth={450} minWidth={300} maxHeight={500}>
          {<MovementLineDataDisplay marker={marker} />}
        </Popup>
      }
      eventHandlers={{
        mouseover: (e: any) => {
          e.target.setStyle({ fill: "blue" });
          e.target.openPopup();
        },
        mouseout: (e: any) => {
          e.target.closePopup();
        },
      }}
    />
  );
};

const MovementLineDataDisplay = ({
  marker,
}: {
  marker: ClientMovementVisualization;
}): JSX.Element => {
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

const CardTable = <T extends object>(props: CardTableProps<T>): JSX.Element => {
  const { noDataMessage, dataState, mappings, idField } = props;
  const { data, error } = dataState;
  const [tableHeight, setTableHeight] = useState(500);
  const tableHeightsDict = {
    small: 100,
    full: 500,
  };
  const tableData = useDataTable<T>(data, mappings, idField);

  const [tableError, setTableError] = useState<undefined | any>(undefined);
  useEffect(() => {
    if (error) {
      setTableError({ message: JSON.stringify(error) });
      setTableHeight(tableHeightsDict.small);
    }
    if (data && data.length === 0) {
      setTableError({ message: noDataMessage });
      setTableHeight(tableHeightsDict.small);
    } else {
      setTableError(undefined);
      setTableHeight(tableHeightsDict.full);
    }
  }, [error, data, noDataMessage]);

  if (error) return <div>There was an error</div>;
  if (!data) return <Skeleton height={tableHeightsDict.full} width={"100%"} />;

  return (
    <Box sx={{ height: tableHeight, width: "100%" }}>
      <DataGrid
        disableSelectionOnClick
        getRowId={(row) => {
          //@ts-ignore
          return row._id;
        }}
        error={tableError}
        components={{
          ErrorOverlay: ErrorOverlay,
        }}
        columns={(tableData.columns as GridColumns) ?? []}
        rows={tableData.rows ?? []}
      />
    </Box>
  );
};
