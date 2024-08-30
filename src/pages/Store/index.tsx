import { useContext, useEffect, useState } from "react";
import { PageInfo, StoreDtoFetchRequest } from "../../models/Store";
import GridTable, { GridColDef } from "components/Common/GridTable";
import { Builder } from "builder-pattern";
import moment from "moment";
import * as React from "react";
import Layout from "components/Layout";
import { Filter, FilterInput } from "components/Filter";
import {
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
import StoreApi from "../../api/store";
import { STORE_STATUS } from "../../types/models/const";
import { ICellRendererParams } from "ag-grid-community";
import { GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ApiException } from "../../api/client";
import StoreUpdate, { StoreUpdateModel } from "components/Modal/StoreUpdate";
import { StoreContent, StoreDtoUpdateRequest } from "models/Store";

const storeApi = StoreApi.getInstance();

class FilterSearchModel implements StoreDtoFetchRequest {
  page: number = 0;
  size: number = 10;
  // sort?: { id: string } = { id: "asc" };
  title?: string = "";
  storeOwnerId?: string = "";
  businessNumber?: string = "";
  approveStatus?: string = "";
  roadAddress?: string = "";
  detailAddress?: string = "";
  representativeName?: string = "";
  representativePhone?: string = "";
}

/**
 * 락업 검색
 * @constructor
 */
const StorePage = () => {
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
  const [updateModel, setUpdateModel] = useState<StoreContent>();
  const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
  const [pageInfo, setPageInfo] = useState<PageInfo>();

  const columns: Array<GridColDef> = [
    Builder(GridColDef).field("no").headerName("No").width(90).flex(0).build(),
    Builder(GridColDef).field("title").headerName("제목").width(90).build(),
    // Builder(GridColDef)
    //   .field("store.id")
    //   .headerName("번호")
    //   .width(90)
    //   .flex(0)
    //   .build(),

    Builder(GridColDef)
      .field("approveStatus")
      .headerName("상태")
      .valueFormatter((params) => {
        if (params.value === 0) {
          return "요청중";
        }
        if (params.value === 1) {
          return "승인";
        }

        return "거절";
      })
      .width(120)
      .flex(0)
      .build(),
    Builder(GridColDef)
      .field("storeType")
      .headerName("가맹점 타입")
      .valueFormatter((params) => {
        if (params.value === 0) {
          return "기타";
        }
        if (params.value === 1) {
          return "카페/디저트";
        }

        if (params.value === 2) {
          return "음식점/식당";
        }

        return "미용/뷰티";
      })
      .width(90)
      .flex(0)
      .build(),
    Builder(GridColDef)
      .field("businessNumber")
      .headerName("사업자번호")
      .build(),
    Builder(GridColDef).field("representativeName").headerName("대표").build(),
    Builder(GridColDef)
      .field("representativePhone")
      .headerName("전화번호")
      .build(),
    Builder(GridColDef)
      .field("address")
      .headerName("주소")
      .valueFormatter((params) => {
        const { data } = params;
        const value: StoreContent = data;
        return value.jibunAddress || value.roadAddress; // roadAddress || jibunAddress
      })
      .build(),
    Builder(GridColDef)
      .field("createDate")
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
      const res = await storeApi.fetch(searchData);

      if (res) setPageInfo(res);
      const rows = res.content?.map((item: StoreContent, index: number) => {
        return { no: index + 1 + searchData.page * searchData.size, ...item };
      });
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
      return { ...prevState, page: 0, approveStatus: `${v}` };
    });
  };

  const handleOnClickUpdate = async (data: StoreContent) => {
    setUpdateModel(data);
    setOpenUpdateModal(true);
  };

  const handleUpdateSubmitted = async (model: StoreDtoUpdateRequest) => {
    try {
      await storeApi.update(`${model.id}`, model);
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

  const handleOnClickDelete = async (model: StoreUpdateModel) => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    try {
      await storeApi.delete(`${model.id}`);
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
            label="제목"
            component={
              <TextField
                name="title"
                placeholder="제목 검색"
                value={filterData.title}
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
                <Typography level="h5"> 가맹점 검색 </Typography>
              </Breadcrumbs>
              <Tabs
                aria-label="Outlined tabs"
                value={searchStatus}
                onChange={(e, v: any) => handleOnChangeSearchStatus(v)}
              >
                <TabList variant="soft">
                  {[
                    { name: "전체", value: -1 },
                    STORE_STATUS.WAIT,
                    STORE_STATUS.PROGRESS,
                    STORE_STATUS.END,
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
            minWidth: 800,
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
            가맹점 수정
          </Typography>
          <StoreUpdate
            initModel={updateModel}
            handleSubmitted={handleUpdateSubmitted}
          />
        </ModalDialog>
      </Modal>
    </>
  );
};
export default StorePage;
