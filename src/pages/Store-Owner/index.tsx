import { useContext, useEffect, useRef, useState } from "react";
import { PageInfoDto } from "../../models";
import GridTable, { GridColDef } from "components/Common/GridTable";
import { Builder } from "builder-pattern";
import moment from "moment";
import * as React from "react";
import Layout from "components/Layout";
import { Filter, FilterInput } from "components/Filter";
import DateRangePicker from "components/Common/DateRangePicker";
import {
  Box,
  Breadcrumbs,
  ModalClose,
  ModalDialog,
  Tab,
  TabList,
  Tabs,
} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import TextField from "@mui/joy/TextField";
import { KeyboardArrowRight } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { MessageState } from "../../context/MessageContext";
import Modal from "@mui/joy/Modal";
import {
  LockupDtoFetchRequest,
  LockupDtoFetchResponse,
} from "../../models/Lockup";
import LockupApi from "../../api/lockup";
import { IsDeposit, LOCKUP_STATUS } from "../../types/models/const";
import { ICellRendererParams } from "ag-grid-community";
import { GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LockupUpdate, {
  LockupUpdateModel,
} from "../../components/Modal/LockupUpdate";
import { ApiException } from "../../api/client";

const lockupApi = LockupApi.getInstance();

class FilterSearchModel implements LockupDtoFetchRequest {
  page: number = 0;
  size: number = 10;
  status: number = -1;
  text?: string = "";
  startDate?: string = "";
  endDate?: string = "";
}

/**
 * 락업 검색
 * @constructor
 */
const StoreOwnerPage = () => {
  const navigate = useNavigate();
  const message = useContext(MessageState);
  const [filterData, setFilterData] = useState<FilterSearchModel>(
    new FilterSearchModel()
  );
  const [searchData, setSearchData] = useState<FilterSearchModel>(
    new FilterSearchModel()
  );
  const [searchStatus, setSearchStatus] = useState(-1);
  const [rows, setRows] = useState<any[]>([]);
  const [updateModel, setUpdateModel] = useState<LockupUpdateModel>();
  const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
  const [pageInfo, setPageInfo] = useState<PageInfoDto>();

  const columns: Array<GridColDef> = [
    Builder(GridColDef).field("no").headerName("No").width(90).flex(0).build(),
    Builder(GridColDef).field("title").headerName("제목").build(),
    Builder(GridColDef)
      .field("user.id")
      .headerName("아이디")
      .width(250)
      .flex(0)
      .build(),
    Builder(GridColDef)
      .field("user.walletAddress")
      .headerName("지갑주소")
      .build(),
    Builder(GridColDef)
      .field("statusLabel")
      .headerName("상태")
      .width(120)
      .flex(0)
      .build(),
    Builder(GridColDef).field("amount").headerName("수량").build(),
    Builder(GridColDef)
      .field("startDate")
      .headerName("시작일자")
      .valueFormatter((params) => {
        const date = moment(params.value);
        return date.isValid() ? date.format("YY-MM-DD") : "";
      })
      .width(120)
      .flex(0)
      .build(),
    Builder(GridColDef)
      .field("endDate")
      .headerName("종료일자")
      .valueFormatter((params) => {
        const date = moment(params.value);
        return date.isValid() ? date.format("YY-MM-DD") : "";
      })
      .width(120)
      .flex(0)
      .build(),
    Builder(GridColDef)
      .field("releaseRate")
      .headerName("월 지급비율")
      .width(120)
      .flex(0)
      .build(),
    Builder(GridColDef)
      .field("regDate")
      .headerName("등록일시")
      .valueFormatter((params) => {
        const date = moment(params.value);
        return date.isValid() ? date.format("YY-MM-DD HH:mm") : "";
      })
      .width(150)
      .flex(0)
      .build(),
    Builder(GridColDef)
      .field("")
      .pinned("right")
      .width(80)
      .cellRenderer(({ data }: ICellRendererParams) => [
        <GridActionsCellItem
          key="1"
          icon={<EditIcon sx={{ fontSize: 25 }} />}
          label="수정"
          onClick={() => handleOnClickUpdate(data)}
        />,
      ])
      .build(),
    Builder(GridColDef)
      .field("")
      .pinned("right")
      .width(80)
      .cellRenderer(({ data }: ICellRendererParams) => [
        <GridActionsCellItem
          key="1"
          icon={<DeleteIcon sx={{ fontSize: 25 }} />}
          label="삭제"
          onClick={() => handleOnClickDelete(data)}
        />,
      ])
      .build(),
  ];

  useEffect(() => {
    const fetchData = async () => {
      const res = await lockupApi.fetch(searchData);
      if (res) setPageInfo(res);
      const rows = res.content?.map(
        (item: LockupDtoFetchResponse, index: number) => {
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

  const handleOnChangeSearchStatus = (v: any) => {
    setSearchStatus(v);
    setSearchData((prevState) => {
      return { ...prevState, page: 0, status: v };
    });
  };

  const handleOnClickUpdate = async (data: LockupDtoFetchResponse) => {
    setUpdateModel({
      id: data.id,
      title: data.title,
      amount: data.amount,
      releaseRate: data.releaseRate,
      startDate: moment(data.startDate).format("yyyy-MM-DD"),
      endDate: moment(data.endDate).format("yyyy-MM-DD"),
    });
    setOpenUpdateModal(true);
  };

  const handleUpdateSubmitted = async (model: LockupUpdateModel) => {
    try {
      await lockupApi.update(`${model.id}`, model);
      message("완료되었습니다.", "success");
      setOpenUpdateModal(false);
      setSearchData((prevState) => {
        return { ...prevState };
      });
    } catch (error) {
      if (error instanceof ApiException) {
        message(error.message);
      }
    }
  };

  const handleOnClickDelete = async (model: LockupUpdateModel) => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    try {
      await lockupApi.delete(`${model.id}`);
      message("완료되었습니다.", "success");
      setSearchData((prevState) => {
        return { ...prevState };
      });
    } catch (e) {
      if (e instanceof ApiException) {
        message(e.message);
      }
    }
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
                name="text"
                placeholder="제목/아이디 검색"
                value={filterData.text}
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
              <Tabs
                aria-label="Outlined tabs"
                value={searchStatus}
                onChange={(e, v: any) => handleOnChangeSearchStatus(v)}
              >
                <TabList variant="soft">
                  {[
                    { name: "전체", value: -1 },
                    LOCKUP_STATUS.WAIT,
                    LOCKUP_STATUS.PROGRESS,
                    LOCKUP_STATUS.END,
                    LOCKUP_STATUS.WITHDRAWAL_END,
                  ].map((item, idx) => {
                    return (
                      <Tab
                        key={idx}
                        variant={
                          item.value === searchStatus ? "solid" : "plain"
                        }
                        color={
                          item.value === searchStatus ? "primary" : "neutral"
                        }
                        value={item.value}
                      >
                        {item.name}
                      </Tab>
                    );
                  })}
                </TabList>
              </Tabs>
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
          <Typography
            id="basic-modal-dialog-title"
            component="h2"
            level="inherit"
            mb={3}
          >
            락업 수정
          </Typography>
          <LockupUpdate
            initModel={updateModel}
            handleSubmitted={handleUpdateSubmitted}
          />
        </ModalDialog>
      </Modal>
    </>
  );
};
export default StoreOwnerPage;
