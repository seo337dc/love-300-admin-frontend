import { useEffect, useState } from "react";
import { PageInfoDto } from "../../models";
import GridTable, { GridColDef } from "components/Common/GridTable";
import { Builder } from "builder-pattern";
import moment from "moment";
import * as React from "react";
import Layout from "components/Layout";
import { Filter, FilterInput } from "components/Filter";
import DateRangePicker from "components/Common/DateRangePicker";
import { Breadcrumbs, ModalClose, ModalDialog } from "@mui/joy";
import Typography from "@mui/joy/Typography";
import TextField from "@mui/joy/TextField";
import { KeyboardArrowRight } from "@mui/icons-material";
import Modal from "@mui/joy/Modal";
import StoreOwnerApi from "api/store-owner";
import {
  StoreOwnerFetchRequest,
  StoreOwnerFetchResponse,
} from "models/StoreOwner";

const storeOwnerApi = StoreOwnerApi.getInstance();

class FilterSearchModel implements StoreOwnerFetchRequest {
  page: number = 0;
  size: number = 10;
  startDate?: string = "";
  endDate?: string = "";
  id?: string = "";
}

/**
 * 락업 검색
 * @constructor
 */
const StoreOwnerPage = () => {
  const [filterData, setFilterData] = useState<FilterSearchModel>(
    new FilterSearchModel()
  );
  const [searchData, setSearchData] = useState<FilterSearchModel>(
    new FilterSearchModel()
  );
  const [rows, setRows] = useState<any[]>([]);
  const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
  const [pageInfo, setPageInfo] = useState<PageInfoDto>();

  const columns: Array<GridColDef> = [
    Builder(GridColDef).field("no").headerName("No").width(90).flex(0).build(),
    Builder(GridColDef)
      .field("id")
      .headerName("아이디")
      .width(200)
      .flex(0)
      .build(),
    Builder(GridColDef)
      .field("signDate")
      .headerName("가맹점주 가입일")
      .width(150)
      .valueFormatter((params) => {
        const date = moment(params.value);
        return date.isValid() ? date.format("YY-MM-DD hh:mm:ss") : "";
      })
      .build(),
    Builder(GridColDef)
      .field("phone")
      .headerName("휴대전화")
      .width(200)
      .build(),
  ];

  useEffect(() => {
    const fetchData = async () => {
      const res = await storeOwnerApi.fetch(searchData);
      if (res) setPageInfo(res);
      const rows = res.content?.map(
        (item: StoreOwnerFetchResponse, index: number) => {
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
            label="등록일시"
            component={
              <DateRangePicker
                startValue={filterData.startDate}
                endValue={filterData.endDate}
                startName="startDate"
                endName="endDate"
                onChange={onChangeFormHandler}
              />
            }
          />
          <FilterInput
            label="제목"
            component={
              <TextField
                name="id"
                placeholder="아이디 검색"
                value={filterData.id}
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
                <Typography level="h5"> 락업 검색 </Typography>
              </Breadcrumbs>
            </>
          }
        />
      </Layout.Main>
      <Modal open={openUpdateModal} onClose={() => setOpenUpdateModal(false)}>
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          aria-describedby="basic-modal-dialog-description"
          sx={{
            minWidth: 450,
            borderRadius: "md",
            p: 3,
          }}
        >
          <ModalClose />
        </ModalDialog>
      </Modal>
    </>
  );
};
export default StoreOwnerPage;
