import Box from "@mui/material/Box";
import { DataGrid, GridColumns, GridRenderCellParams } from "@mui/x-data-grid";
import { Link, useParams } from "react-router-dom";
import useDataSet from "./hooks/useDataSet";
import useDataTable, { ColumnNaming } from "./hooks/useDataTable";
import PopulationClient from "./interfaces/PopulationClient";
import ClientMovement from "./interfaces/Movement";
import { Skeleton, Typography } from "@mui/material";

type ColumnMapping = {
  [key: string]: (params: GridRenderCellParams<any>) => JSX.Element;
};

const renderCellWithLink = (params: GridRenderCellParams<any>) => {
  return <Link to={`${params.row._id}`}>{params.value}</Link>;
};

const populationColumnSettings: ColumnNaming<PopulationClient> = {
  premiseid: {
    headerName: "Population Code",
    width: 150,
    renderCell: renderCellWithLink,
  },
  total_animal: { headerName: "Total Animals", width: 100 },
};

const movementColumnSettings: ColumnNaming<ClientMovement> = {
  new_originname: { headerName: "Entity Name", width: 400 },
  new_origincity: { headerName: "Origin City", width: 200 },
  new_originstate: { headerName: "Origin State", width: 200 },
  new_movementreason: { headerName: "Reason", width: 200 },
  new_numitemsmoved: { headerName: "Number Moved", width: 200 },
};

const columnSettings = {
  population: populationColumnSettings,
  movement: movementColumnSettings,
};

const isMovementData = (data: any): data is ClientMovement => {
  if (data) {
    return (
      "account" in data && "new_species" in data && "new_origincity" in data
    );
  }
  return false;
};

export default function DataGridDemo() {
  const { content } = useParams();
  const { data, error } = useDataSet(content);

  console.log(data);
  const dataTableInfo = useDataTable(
    //@ts-ignore
    data?.data,
    //@ts-ignore
    columnSettings[data?.collectionName]
  );

  if (error) return <div>There was an error</div>;
  if (!data) return <Skeleton width={"100%"} height={1000} />;

  return (
    <Box sx={{ height: 900, width: "100%" }}>
      <Box
        sx={{ flex: 1, display: "flex", alignItems: "center", px: 2, gap: 1 }}
      >
        <Typography variant="h6">{`${dataTableInfo.rows.length} Records Found`}</Typography>
      </Box>
      {dataTableInfo.rows && dataTableInfo.columns && (
        <DataGrid
          rows={dataTableInfo.rows}
          getRowId={(row) => {
            //@ts-ignore
            return row._id;
          }}
          columns={dataTableInfo.columns as GridColumns}
          pageSize={100}
          rowsPerPageOptions={[100]}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      )}
    </Box>
  );
}
