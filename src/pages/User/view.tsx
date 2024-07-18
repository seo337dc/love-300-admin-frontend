import * as React from "react";
import { useContext, useEffect, useState } from "react";
import Layout from "components/Layout";
import GridTable, { GridColDef } from "components/Common/GridTable";
import { Builder } from "builder-pattern";
import {
  Box,
  Breadcrumbs,
  ListDivider,
  ModalClose,
  ModalDialog,
  Sheet,
  Stack,
  Tab,
  TabList,
  Tabs,
} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import { ApiException } from "api/client";
import { MessageState } from "context/MessageContext";
import moment from "moment";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import { useNavigate, useParams } from "react-router-dom";
import Link from "@mui/joy/Link";
import UserApi from "api/user";
import { IsDeposit } from "types/models/const";
import Button from "@mui/joy/Button";
import { PageInfoDto } from "../../models";
import { Filter, FilterInput } from "components/Filter";
import TextField from "@mui/joy/TextField";
import DateRangePicker from "components/Common/DateRangePicker";
import Modal from "@mui/joy/Modal";
import { Collapse } from "@mui/material";
import IconButton from "@mui/joy/IconButton";
import { UserDtoFetchResponse } from "../../models/User";
import HistoryApi from "../../api/history";
import {
  HistoryDtoFetchByUserIdRequest,
  HistoryDtoFetchByUserIdResponse,
} from "../../models/History";
import Transaction, {
  TransactionModal,
} from "../../components/Modal/Transaction";
import AdminApi from "../../api/admin";
import { KeyboardArrowRight } from "@mui/icons-material";
import LockupCreate, {
  LockupCreateModel,
} from "../../components/Modal/LockupCreate";
import LockupApi from "../../api/lockup";

const userApi = UserApi.getInstance();
const adminApi = AdminApi.getInstance();
const lockupApi = LockupApi.getInstance();
const historyApi = HistoryApi.getInstance();

class FilterSearchModel implements HistoryDtoFetchByUserIdRequest {
  constructor(userId: number) {
    this.userId = userId;
  }

  page: number = 0;
  size: number = 10;
  userId: number = 0;
  text?: string = "";
  startDate?: string = "";
  endDate?: string = "";
  deposit?: number = -1;
}

/**
 * 사용자 검색 - 상세
 * @constructor
 */
const UserViewPage = () => {
  const navigate = useNavigate();
  const params = useParams();

  const message = useContext(MessageState);
  const [filterData, setFilterData] = useState<FilterSearchModel>(
    new FilterSearchModel(params.id as unknown as number)
  );
  const [searchData, setSearchData] = useState<FilterSearchModel>(
    new FilterSearchModel(params.id as unknown as number)
  );
  const [pageInfo, setPageInfo] = useState<PageInfoDto>();
  const [deposit, setDeposit] = useState(-1);
  const [rows, setRows] = useState<any[]>([]);
  const [user, setUser] = useState<UserDtoFetchResponse>();
  const [openTransferModal, setOpenTransferModal] = useState(false);
  const [openLockupModal, setOpenLockupModal] = useState(false);
  const [isHidden, setIsHidden] = React.useState(false);
  const [transactionIsLoading, setTransactionIsLoading] = useState(false);

  const columns: Array<GridColDef> = [
    Builder(GridColDef).field("no").headerName("No").width(70).flex(0).build(),
    Builder(GridColDef).field("txHash").headerName("거래해시").build(),
    Builder(GridColDef).field("txFrom").headerName("출금주소").build(),
    Builder(GridColDef).field("txTo").headerName("입금주소").build(),
    Builder(GridColDef).field("amount").headerName("금액").build(),
    Builder(GridColDef)
      .field("unit")
      .headerName("단위")
      .width(80)
      .flex(0)
      .build(),
    Builder(GridColDef)
      .field("status")
      .headerName("상태")
      .width(100)
      .flex(0)
      .build(),
    Builder(GridColDef)
      .field("deposit")
      .headerName("입출금여부")
      .valueFormatter((params) => IsDeposit.get(params.value))
      .width(100)
      .flex(0)
      .build(),
    Builder(GridColDef)
      .field("txDate")
      .headerName("거래일시")
      .valueFormatter((params) => {
        const date = moment(params.value);
        return date.isValid() ? date.format("YY-MM-DD HH:mm") : "";
      })
      .width(160)
      .flex(0)
      .build(),
  ];

  useEffect(() => {
    fetchUser();
  }, [params]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await historyApi.fetchByUserId(searchData);
      if (res) setPageInfo(res);
      const rows = res.content?.map(
        (item: HistoryDtoFetchByUserIdResponse, index: number) => {
          return { no: index + 1 + searchData.page * searchData.size, ...item };
        }
      );
      setRows(rows || []);
    };
    fetchData();
  }, [searchData]);

  const fetchUser = async () => {
    try {
      const resUser = await userApi.fetchById(params.id as string);
      setUser(resUser);
    } catch (error) {
      if (error instanceof ApiException) {
        message(error.message);
        navigate(-1);
      }
    }
  };

  const handleOnClickTransaction = async (model: TransactionModal) => {
    if (
      !window.confirm(
        "송금하시겠습니까?\n블록체인 특성상 잘못 송금할 경우 회수가 어렵습니다."
      )
    )
      return;
    if (user?.idx) {
      setTransactionIsLoading(true);
      try {
        await adminApi.transaction({
          email: user?.email,
          address: user?.walletAddress,
          amount: model.amount,
        });
        message("완료되었습니다.", "success");
      } catch (e) {
        if (e instanceof ApiException) {
          message(e.message);
        }
      } finally {
        setTransactionIsLoading(false);
        setOpenTransferModal(false);
        setOpenLockupModal(false);
        handleOnSearch();
      }
    } else {
      message("오류발생");
    }
  };

  const handleOnClickLockup = async (model: LockupCreateModel) => {
    if (
      !window.confirm(
        "락업을 생성하시겠습니까?\n추후 진행중인 락업은 수정 및 삭제가 불가능합니다."
      )
    )
      return;
    if (user?.idx) {
      setTransactionIsLoading(true);
      try {
        await lockupApi.create({
          title: model.title,
          userId: user?.idx,
          startDate: model.startDate,
          endDate: model.endDate,
          amount: model.amount,
          releaseRate: model.releaseRate,
        });
        message("완료되었습니다.", "success");
      } catch (e) {
        if (e instanceof ApiException) {
          message(e.message);
        }
      } finally {
        setTransactionIsLoading(false);
        setOpenTransferModal(false);
        setOpenLockupModal(false);
        handleOnSearch();
      }
    } else {
      message("오류발생");
    }
  };

  const onChangeFormHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const handleOnClickClearFilter = async () => {
    setFilterData(new FilterSearchModel(params.id as unknown as number));
  };

  const handleOnChangePage = async (newPage: number) => {
    setSearchData((prevState) => {
      return { ...prevState, page: newPage };
    });
  };

  const handleOnSearch = () => {
    setSearchData({ ...filterData, page: 0 });
  };

  const handleOnClickHidden = () => {
    setIsHidden((prev) => !prev);
  };

  const handleOnChangeDeposit = (v: any) => {
    setDeposit(v);
    setSearchData((prevState) => {
      return { ...prevState, page: 0, deposit: v };
    });
  };

  return (
    <>
      <Layout.SidePane width="685px">
        <Filter
          onClickClear={handleOnClickClearFilter}
          onClickSearch={handleOnSearch}
        >
          <FilterInput
            label="거래일시"
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
            label="주소/해시"
            component={
              <TextField
                name="text"
                placeholder="주소/해시 검색"
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
                <Link
                  key="사용자 검색"
                  underline="hover"
                  color="neutral"
                  fontSize="inherit"
                  onClick={(event) => {
                    event.preventDefault();
                    navigate(-1);
                  }}
                >
                  사용자 검색
                </Link>
                <Typography level="h5">사용자 상세</Typography>
              </Breadcrumbs>
              <Tabs
                aria-label="Outlined tabs"
                value={deposit}
                onChange={(e, v: any) => handleOnChangeDeposit(v)}
              >
                <TabList variant="soft">
                  {[
                    { name: "전체", value: -1 },
                    {
                      name: IsDeposit.DEPOSIT.name,
                      value: IsDeposit.DEPOSIT.value,
                    },
                    {
                      name: IsDeposit.WITHDRAWAL.name,
                      value: IsDeposit.WITHDRAWAL.value,
                    },
                  ].map((item, idx) => {
                    return (
                      <Tab
                        key={idx}
                        variant={item.value === deposit ? "solid" : "plain"}
                        color={item.value === deposit ? "primary" : "neutral"}
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
      <Sheet
        variant="outlined"
        sx={{
          bgcolor: "background.componentBg",
          borderColor: "neutral.outlinedBorder",
        }}
      >
        <Box
          sx={{
            width: "max-content",
            py: 3,
            px: 2,
            borderRadius: "sm",
            minWidth: "20px",
          }}
        >
          <IconButton
            variant="plain"
            color="neutral"
            onClick={handleOnClickHidden}
            sx={{
              position: "absolute",
              left: "6px",
              top: "8px",
              visibility: !isHidden ? "hidden" : "visible",
            }}
          >
            <KeyboardArrowLeft fontSize="medium" />
          </IconButton>
          <Collapse orientation="horizontal" in={!isHidden}>
            <ModalClose
              sx={{ visibility: isHidden ? "hidden" : "visible" }}
              onClick={handleOnClickHidden}
            />
            <Box>
              <ListDivider component="hr" />
              <Box
                sx={{
                  width: 380,
                  gap: 4,
                  p: 2,
                  display: "grid",
                  gridTemplateColumns: "pre-wrap",
                }}
              >
                <Typography level="body1" textColor="text.secondary">
                  아이디
                </Typography>
                <Typography level="body1" textColor="text.primary">
                  {user?.email}
                </Typography>

                <Typography level="body1" textColor="text.secondary">
                  가입일시
                </Typography>
                <Typography level="body1" textColor="text.primary">
                  {moment(user?.signDate).isValid()
                    ? moment(user?.signDate).format("YY-MM-DD HH:mm")
                    : ""}
                </Typography>

                <Typography level="body1" textColor="text.secondary">
                  지갑주소
                </Typography>
                <Typography level="body1" textColor="text.primary">
                  {user?.walletAddress}
                </Typography>
              </Box>
              <Sheet
                sx={{
                  py: 2,
                  px: 2,
                  display: "flex",
                  gap: 1,
                }}
              >
                <Button
                  loading={transactionIsLoading}
                  onClick={() => setOpenTransferModal(true)}
                >
                  송금하기
                </Button>
                <Button
                  loading={transactionIsLoading}
                  onClick={() => setOpenLockupModal(true)}
                >
                  락업생성
                </Button>
              </Sheet>
            </Box>
          </Collapse>
        </Box>
      </Sheet>
      <Modal
        open={openTransferModal}
        onClose={() => setOpenTransferModal(false)}
      >
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          aria-describedby="basic-modal-dialog-description"
          sx={{
            maxWidth: 500,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
          }}
        >
          <Box id="basic-modal-dialog-title" mb={4}>
            <ModalClose />
          </Box>
          <Stack spacing={3} sx={{ mb: 3 }}>
            <Transaction onNext={handleOnClickTransaction} />
          </Stack>
        </ModalDialog>
      </Modal>
      <Modal open={openLockupModal} onClose={() => setOpenLockupModal(false)}>
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
            락업생성
          </Typography>
          <LockupCreate handleSubmitted={handleOnClickLockup} />
        </ModalDialog>
      </Modal>
    </>
  );
};
export default UserViewPage;
