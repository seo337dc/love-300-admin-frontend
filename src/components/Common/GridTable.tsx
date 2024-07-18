import {useMemo, useRef, forwardRef, useImperativeHandle} from "react";
import Sheet from "@mui/joy/Sheet";
import Box from "@mui/joy/Box";
import * as React from "react";
import {PageInfoDto} from "../../models";
import {AgGridReact} from "ag-grid-react";
import {GridOptions} from "ag-grid-community";
import {
  CheckboxSelectionCallback,
  ColDef,
  HeaderCheckboxSelectionCallback,
  ValueFormatterFunc
} from "ag-grid-community/dist/lib/entities/colDef";
import 'assets/css/ag-custom-theme-apline.css'
import { useColorScheme } from "@mui/joy";
import {TablePagination} from "@mui/material";

export class GridColDef implements ColDef {
  field!: string;
  headerName!: string;
  flex?: number = 1;
  width?: number;
  type?: string;
  valueFormatter?: string | ValueFormatterFunc<any>;
  headerCheckboxSelection?: boolean | HeaderCheckboxSelectionCallback<any>;
  checkboxSelection?: boolean | CheckboxSelectionCallback<any>;
  cellRenderer?: any;
  pinned?: boolean | 'left' | 'right' = false;
  lockPinned?: boolean;
  lockPosition?: boolean | 'left' | 'right';
}

export interface StretchyDataGridHandler {
  getSelectedRows: () => any;
}

export class StretchyDataGridProp {
  columns!: Array<GridColDef>;
  rows!: any;
  pageInfo?: PageInfoDto;
  onChangePage?: Function;
  header?: React.ReactNode;
}

const GridTable = forwardRef(({columns, rows, pageInfo, onChangePage, header}: StretchyDataGridProp, ref) => {
  const gridRef = useRef<AgGridReact<any>>(null);
  const { mode } = useColorScheme();
  useImperativeHandle(ref, () => ({
    getSelectedRows
  }), [gridRef])

  const [page, setPage] = React.useState<number>(pageInfo?.number || 0);
  const [rowCountState, setRowCountState] = React.useState(
    pageInfo?.totalElements || 0,
  );
  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null, newPage: number,) => {
    setPage(newPage);
    if (onChangePage) onChangePage(newPage);
  }

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true
  }), []);

  React.useEffect(() => {
    setRowCountState((prevRowCountState) =>
      pageInfo?.totalElements !== undefined
        ? pageInfo?.totalElements
        : prevRowCountState,
    );
  }, [pageInfo?.totalElements, setRowCountState]);

  React.useEffect(() => {
    if (pageInfo?.number) setPage(pageInfo.number);
  }, [pageInfo?.number]);
  const test: GridOptions = {}

  const getSelectedRows = () => {
    return gridRef.current!.api.getSelectedRows();
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 2,
        height: '100%'
      }}
    >
      <Sheet
        variant="outlined"
        sx={{
          height: 'auto',
          borderRadius: 'sm',
          gridColumn: '1/-1',
          gridTemplateRows: 'auto 1fr',
          bgcolor: 'background.componentBg',
          display: { xs: 'none', sm: 'grid' },
        }}
      >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mr: 2,
          my: 3
        }}>
          { header }
        </Box>
        <AgGridReact
          ref={gridRef}
          className={mode === "dark" ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'}
          columnDefs={columns as any}
          rowData={rows}
          defaultColDef={defaultColDef}
          rowHeight={52}
          headerHeight={55}
          rowSelection={'multiple'}
          suppressRowClickSelection={true}
          enableCellTextSelection={true}
        />
        {pageInfo ?
          <table>
            <tbody>
            <tr>
              <TablePagination
                count={rowCountState}
                page={page}
                rowsPerPage={pageInfo?.size || 10}
                rowsPerPageOptions={[pageInfo?.size || 10]}
                onPageChange={handlePageChange}
              />
            </tr>
            </tbody>
          </table>
          : null
        }
      </Sheet>
    </Box>
  )
});
export default GridTable;
