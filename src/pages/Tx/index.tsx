import {useEffect, useState} from "react";
import {PageInfoDto} from "../../models";
import GridTable, {GridColDef} from "components/Common/GridTable";
import {Builder} from "builder-pattern";
import moment from "moment";
import * as React from "react";
import Layout from "components/Layout";
import {Filter, FilterInput} from "components/Filter";
import DateRangePicker from "components/Common/DateRangePicker";
import {Breadcrumbs} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import TextField from "@mui/joy/TextField";
import {HistoryDtoFetchRequest, HistoryDtoFetchResponse} from "../../models/History";
import HistoryApi from "../../api/history";
import {KeyboardArrowRight} from "@mui/icons-material";

const historyApi = HistoryApi.getInstance()

class FilterSearchModel implements HistoryDtoFetchRequest {
  page: number = 0;
  size: number = 10;
  text?: string = "";
  startDate?: string = "";
  endDate?: string = "";
}

/**
 * 거래 내역
 * @constructor
 */
const TxHistoryPage = () => {
  const [filterData, setFilterData] = useState<FilterSearchModel>(new FilterSearchModel());
  const [searchData, setSearchData] = useState<FilterSearchModel>(new FilterSearchModel());
  const [rows, setRows] = useState<any[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfoDto>();

  const columns: Array<GridColDef> = [
    Builder(GridColDef).field("no").headerName("No").width(70).flex(0).build(),
    Builder(GridColDef).field("txHash").headerName("거래해시").build(),
    Builder(GridColDef).field("txFrom").headerName("출금주소").build(),
    Builder(GridColDef).field("txTo").headerName("입금주소").build(),
    Builder(GridColDef).field("amount").headerName("수량").build(),
    Builder(GridColDef).field("unit").headerName("단위").width(80).flex(0).build(),
    Builder(GridColDef).field("status").headerName("상태").width(100).flex(0).build(),
    Builder(GridColDef).field("txDate").headerName("거래일시")
      .valueFormatter(params => {
        const date = moment(params.value);
        return date.isValid() ? date.format("YY-MM-DD HH:mm") : '';
      })
      .width(160).flex(0).build(),
  ];

  useEffect(() => {
    const fetchData = async () => {
      const res = await historyApi.fetch(searchData);
      if (res) setPageInfo(res);
      const rows = res.content?.map((item: HistoryDtoFetchResponse, index: number) => {
        return {no: (index + 1) + (searchData.page * searchData.size), ...item};
      });
      setRows(rows || []);
    };
    fetchData();
  }, [searchData]);

  const onChangeFormHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterData((prevState) => {
      return {...prevState, [e.target.name]: e.target.value};
    });
  }

  const handleOnClickClearFilter = () => {
    setFilterData(new FilterSearchModel());
  }

  const handleOnChangePage = async (newPage: number) => {
    setSearchData((prevState) => {
      return {...prevState, page: newPage};
    });
  }

  const handleOnSearch = () => {
    setSearchData({...filterData, page: 0})
  }

  return (
    <>
      <Layout.SidePane width='25vw'>
        <Filter onClickClear={handleOnClickClearFilter} onClickSearch={handleOnSearch}>
          <FilterInput label="거래일시" component={
            <DateRangePicker startValue={filterData.startDate}
                             endValue={filterData.endDate}
                             startName="startDate"
                             endName="endDate" onChange={onChangeFormHandler}
            />
          }/>
          <FilterInput label="주소/해시" component={<TextField name="text" placeholder="주소/해시 검색"
                                                               value={filterData.text}
                                                               onChange={onChangeFormHandler}/>}/>
        </Filter>
      </Layout.SidePane>
      <Layout.Main>
        <GridTable columns={columns} rows={rows} pageInfo={pageInfo} onChangePage={handleOnChangePage}
                   header={<>
                     <Breadcrumbs separator={<KeyboardArrowRight/>} aria-label="breadcrumbs">
                       <Typography level="h5"> 거래 내역 </Typography>
                     </Breadcrumbs>
                   </>
                   }
        />
      </Layout.Main>
    </>
  );
};
export default TxHistoryPage;