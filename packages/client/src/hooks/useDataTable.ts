import { GridColumns, GridEnrichedColDef } from "@mui/x-data-grid";
import { useEffect, useReducer, useRef, useState } from "react";

export interface GridResult<T> {
  columns: Partial<GridEnrichedColDef>[];
  rows: T[];
}

export type ColumnNaming<T> = {
  [P in keyof T]?: Partial<GridEnrichedColDef>;
};

function useDataTable<T extends {}>(
  dataArr: T[] | undefined,
  mappings: ColumnNaming<T> | undefined,
  idField?: string
): GridResult<T> {
  const [columns, setDataCols] = useState<GridColumns>();
  const [rows, setDataRows] = useState<any[]>([]);

  useEffect(() => {
    if (dataArr && mappings) {
      const toDisplayKeys = Object.keys(mappings);
      if (dataArr.length > 0 && toDisplayKeys.length > 0) {
        const firstElem = dataArr[0];
        let gridCols = Object.keys(firstElem).reduce<GridColumns>(function (
          acc: GridColumns,
          k: string
        ) {
          if (toDisplayKeys.includes(k)) {
            //@ts-ignore
            acc.push({
              field: k,
              //@ts-ignore
              ...mappings[k],
            });
          }
          return acc;
        },
        []);
        gridCols.sort(function (a, b) {
          return (
            toDisplayKeys.indexOf(a.field) - toDisplayKeys.indexOf(b.field)
          );
        });
        let gridRows = dataArr;
        if (idField) {
          gridRows = dataArr.map((r) => {
            //@ts-ignore
            return { ...r, id: r[idField as string] };
          });
        }

        setDataCols(gridCols);
        setDataRows(gridRows);
      } else {
        setDataCols([]);
        setDataRows([]);
      }
    }
  }, [dataArr?.length]);
  //@ts-ignore
  return { columns, rows };
}

export default useDataTable;
