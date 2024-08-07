import { useEffect, useState } from "react";
import { PageInfoDto } from "../../models";
import GridTable, { GridColDef } from "components/Common/GridTable";
import { Builder } from "builder-pattern";
import moment from "moment";
import * as React from "react";
import Layout from "components/Layout";
import { Filter, FilterInput } from "components/Filter";
import { Breadcrumbs, Checkbox } from "@mui/joy";
import Typography from "@mui/joy/Typography";
import TextField from "@mui/joy/TextField";
import UserApi from "api/user";
import { UserDtoFetchRequest, UserDtoFetchResponse } from "../../models/User";
import DateRangePicker from "../../components/Common/DateRangePicker";
import { ICellRendererParams } from "ag-grid-community";
import { GridActionsCellItem } from "@mui/x-data-grid";
import LastPageRoundedIcon from "@mui/icons-material/LastPageRounded";
import { useNavigate } from "react-router-dom";
import { KeyboardArrowRight } from "@mui/icons-material";

const userApi = UserApi.getInstance();

class FilterSearchModel implements UserDtoFetchRequest {
  page: number = 0;
  size: number = 10;
  text?: string = "";
  walletAddress?: string = "";
  regStartDate?: string = "";
  regEndDate?: string = "";
  phone?: string = "";
}

/**
 * 사용자 검색
 * @constructor
 */
const UserPage = () => {
  const [filterData, setFilterData] = useState<FilterSearchModel>(
    new FilterSearchModel()
  );
  const [searchData, setSearchData] = useState<FilterSearchModel>(
    new FilterSearchModel()
  );
  const [rows, setRows] = useState<any[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfoDto>();
  const navigate = useNavigate();

  const columns: Array<GridColDef> = [
    Builder(GridColDef)
      .field("")
      .headerName("")
      .width(70)
      .flex(0)
      .checkboxSelection(true)
      .build(),
    Builder(GridColDef).field("no").headerName("No").width(70).flex(0).build(),
    Builder(GridColDef)
      .field("id")
      .headerName("아이디")
      .width(250)
      .flex(0)
      .build(),
    Builder(GridColDef)
      .field("phone")
      .headerName("휴대폰번호")
      .valueFormatter((params) => {
        const phone: string = params.value ?? "";
        const convertedPhone = phone.replace("+82", "");

        return convertedPhone.startsWith("0")
          ? convertedPhone
          : "0" + convertedPhone;
      })
      .build(),
    Builder(GridColDef).field("walletAddress").headerName("지갑주소").build(),
    Builder(GridColDef)
      .field("signDate")
      .headerName("가입일시")
      .valueFormatter((params) => {
        const date = moment(params.value);
        return date.isValid() ? date.format("YYYY-MM-DD HH:mm") : "";
      })
      .width(200)
      .flex(0)
      .build(),
    Builder(GridColDef)
      .field("")
      .pinned("right")
      .width(80)
      .cellRenderer(({ data }: ICellRendererParams) => [
        <GridActionsCellItem
          key="1"
          icon={<LastPageRoundedIcon sx={{ fontSize: 25 }} />}
          label="상세보기"
          onClick={() => navigate(`/user/${data.idx}`)}
        />,
      ])
      .build(),
  ];

  useEffect(() => {
    const fetchData = async () => {
      const res = await userApi.fetch(searchData);
      if (res) setPageInfo(res);
      const rows = res.content?.map(
        (item: UserDtoFetchResponse, index: number) => {
          return { no: index + 1 + searchData.page * searchData.size, ...item };
        }
      );
      setRows(rows || []);
    };
    fetchData();
  }, [searchData]);

  const onChangeFormHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const handleOnClickClearFilter = () => {
    setFilterData(new FilterSearchModel());
  };

  const handleOnChangePage = async (newPage: number) => {
    setSearchData((prevState) => {
      return { ...prevState, page: newPage };
    });
  };

  const handleOnSearch = () => {
    setSearchData({ ...filterData, page: 0 });
  };

  return (
    <>
      <Layout.SidePane width="25vw">
        <Filter
          onClickClear={handleOnClickClearFilter}
          onClickSearch={handleOnSearch}
        >
          <FilterInput
            label="가입일시"
            component={
              <DateRangePicker
                startValue={filterData.regStartDate}
                endValue={filterData.regEndDate}
                startName="regStartDate"
                endName="regEndDate"
                onChange={onChangeFormHandler}
              />
            }
          />
          <FilterInput
            label="아이디"
            component={
              <TextField
                name="text"
                placeholder="아이디 검색"
                value={filterData.text}
                onChange={onChangeFormHandler}
              />
            }
          />
          <FilterInput
            label="지갑주소"
            component={
              <TextField
                name="walletAddress"
                placeholder="지갑주소 검색"
                value={filterData.walletAddress}
                onChange={onChangeFormHandler}
              />
            }
          />
          <FilterInput
            label="휴대폰 번호"
            component={
              <TextField
                name="phone"
                placeholder="휴대폰 번호 검색"
                value={filterData.phone}
                onChange={onChangeFormHandler}
              />
            }
          />
        </Filter>
      </Layout.SidePane>
      <Layout.Main>
        <GridTable
          columns={columns}
          rows={rows}
          pageInfo={pageInfo}
          onChangePage={handleOnChangePage}
          header={
            <>
              <Breadcrumbs
                separator={<KeyboardArrowRight />}
                aria-label="breadcrumbs"
              >
                <Typography level="h5"> 사용자 검색 </Typography>
              </Breadcrumbs>
            </>
          }
        />
      </Layout.Main>
    </>
  );
};
export default UserPage;
