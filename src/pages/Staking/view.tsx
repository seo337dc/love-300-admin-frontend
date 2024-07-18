import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import Layout from 'components/Layout';
import GridTable, {GridColDef} from "components/Common/GridTable";
import {Builder} from 'builder-pattern';
import {Box, Breadcrumbs, ListDivider, ModalClose, ModalDialog, Sheet} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {ApiException} from "api/client";
import {MessageState} from "context/MessageContext";
import moment from "moment";
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import {useNavigate, useParams} from "react-router-dom";
import Link from "@mui/joy/Link";
import Button from "@mui/joy/Button";
import {PageInfoDto} from "../../models";
import {Filter, FilterInput} from "components/Filter";
import TextField from "@mui/joy/TextField";
import DateRangePicker from "components/Common/DateRangePicker";
import Modal from "@mui/joy/Modal";
import {Collapse} from "@mui/material";
import IconButton from "@mui/joy/IconButton";
import { UserDtoFetchByStakingIdRequest, UserDtoFetchByStakingIdResponse } from '../../models/User';
import {KeyboardArrowRight} from "@mui/icons-material";
import StakingApi from '../../api/staking';
import { StakingDtoFetchResponse, StakingDtoUpdateRequest } from '../../models/Staking';
import StakingUpdate, { StakingUpdateModel } from '../../components/Modal/StakingUpdate';

const stakingApi = StakingApi.getInstance()

class FilterSearchModel implements UserDtoFetchByStakingIdRequest {
  constructor(stakingId: number) {
    this.id = stakingId
  }

  id: number = 0;
  page: number = 0;
  size: number = 10;
  text?: string = "";
  startDate?: string = "";
  endDate?: string = "";
}

/**
 * 스테이킹 관리 - 상세
 * @constructor
 */
const StakingViewPage = () => {
  const navigate = useNavigate();
  const params = useParams();

  const message = useContext(MessageState);
  const [filterData, setFilterData] = useState<FilterSearchModel>(new FilterSearchModel(params.id as unknown as number));
  const [searchData, setSearchData] = useState<FilterSearchModel>(new FilterSearchModel(params.id as unknown as number));
  const [pageInfo, setPageInfo] = useState<PageInfoDto>();
  const [rows, setRows] = useState<any[]>([]);
  const [staking, setStaking] = useState<StakingDtoFetchResponse>();
  const [stakingModel, setStakingModel] = useState<StakingUpdateModel>();
  const [isHidden, setIsHidden] = React.useState(false);
  const [deleteIsLoading, setDeleteIsLoading] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const columns: Array<GridColDef> = [
    Builder(GridColDef).field("no").headerName("No").width(70).flex(0).build(),
    Builder(GridColDef).field("user.email").headerName("아이디").width(100).flex(0).build(),
    Builder(GridColDef).field("user.walletAddress").headerName("지갑주소").build(),
    Builder(GridColDef).field("seedAmount").headerName("시드").width(80).flex(0).build(),
    Builder(GridColDef).field("rewardAmount").headerName("보상").width(80).flex(0).build(),
    Builder(GridColDef).field("withdrawalAmount").headerName("출금").width(80).flex(0).build(),
    Builder(GridColDef).field("statusLabel").headerName("상태").width(80).flex(0).build(),
    Builder(GridColDef).field("regDate").headerName("신청일")
      .valueFormatter(params => {
        const date = moment(params.value);
        return date.isValid() ? date.format("YY-MM-DD") : '';
      }).width(120).flex(0).build(),
  ];

  useEffect(() => {
    fetchStacking();
  }, [params]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await stakingApi.fetchApplyById(searchData);
      if (res) setPageInfo(res);
      const rows = res.content?.map((item: UserDtoFetchByStakingIdResponse, index: number) => {
        return {no: (index + 1) + (searchData.page * searchData.size), ...item};
      });
      setRows(rows || []);
    };
    fetchData();
  }, [searchData]);

  const fetchStacking = async () => {
    try {
      const resStaking = await stakingApi.fetchById(params.id as string);
      setStaking(resStaking);
      const form: StakingUpdateModel = {
        title: resStaking.title,
        startDate: moment(resStaking.startDate).format("yyyy-MM-DD"),
        endDate: moment(resStaking.endDate).format("yyyy-MM-DD"),
        applyStartDate: moment(resStaking.applyStartDate).format("yyyy-MM-DD"),
        applyEndDate: moment(resStaking.applyEndDate).format("yyyy-MM-DD"),
        isDuplicatedApply: resStaking.isDuplicatedApply,
        rewardRate: resStaking.rewardRate
      };
      setStakingModel(form);
    } catch (error) {
      if (error instanceof ApiException) {
        message(error.message);
        navigate(-1);
      }
    }
  };

  const handleUpdateSubmitted = async (model: StakingUpdateModel) => {
    const form: StakingDtoUpdateRequest = {
      title: model.title,
      startDate: model.startDate,
      endDate: model.endDate,
      applyStartDate: model.applyStartDate,
      applyEndDate: model.applyEndDate,
      isDuplicatedApply: model.isDuplicatedApply as any,
      rewardRate: model.rewardRate
    };
    try {
      await stakingApi.update(params.id as string, form);
      message("완료되었습니다.", "success");
      setSearchData({...filterData, page: 0})
      setOpenUpdateModal(false)
      fetchStacking();
    } catch (error) {
      if (error instanceof ApiException) {
        message(error.message);
      }
    }
  }

  const handleOnClickDelete = async () => {
    if (!window.confirm("삭제하시겠습니까?")) return
    if (staking?.id) {
      setDeleteIsLoading(true);
      try {
        await stakingApi.delete(params.id as string);
        message("완료되었습니다.", "success");
        navigate(-1);
      } catch (e) {
        if (e instanceof ApiException) {
          message(e.message);
        }
      } finally {
        setDeleteIsLoading(false);
        handleOnSearch();
      }
    } else {
      message('오류발생');
    }
  }

  const onChangeFormHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterData((prevState) => {
      return {...prevState, [e.target.name]: e.target.value};
    });
  }

  const handleOnClickClearFilter = async () => {
    setFilterData(new FilterSearchModel(params.id as unknown as number));
  }

  const handleOnChangePage = async (newPage: number) => {
    setSearchData((prevState) => {
      return {...prevState, page: newPage};
    });
  }

  const handleOnSearch = () => {
    setSearchData({...filterData, page: 0})
  }

  const handleOnClickHidden = () => {
    setIsHidden((prev) => !prev);
  };

  return (
    <>
      <Layout.SidePane width='685px'>
        <Filter onClickClear={handleOnClickClearFilter} onClickSearch={handleOnSearch}>
          <FilterInput label="신청일시" component={
            <DateRangePicker startValue={filterData.startDate}
                             endValue={filterData.endDate}
                             startName="startDate"
                             endName="endDate" onChange={onChangeFormHandler}
            />
          }/>
          <FilterInput label="아이디" component={<TextField name="text" placeholder="아이디 검색"
                                                           value={filterData.text}
                                                           onChange={onChangeFormHandler}/>}/>
        </Filter>
      </Layout.SidePane>
      <Layout.Main>
        <GridTable columns={columns} rows={rows}
                   pageInfo={pageInfo} onChangePage={handleOnChangePage}
                   header={<>
                     <Breadcrumbs separator={<KeyboardArrowRight/>} aria-label="breadcrumbs">
                       <Link key="사용자 검색" underline="hover" color="neutral" fontSize="inherit" onClick={(event) => {
                         event.preventDefault();
                         navigate(-1)
                       }}>스테이킹 관리</Link>
                       <Typography level="h5">스테이킹 상세</Typography>
                     </Breadcrumbs>
                   </>}
        />
      </Layout.Main>
      <Sheet
        variant="outlined"
        sx={{
          bgcolor: 'background.componentBg',
          borderColor: 'neutral.outlinedBorder'
        }}
      >
        <Box sx={{
          width: "max-content",
          py: 3,
          px: 2,
          borderRadius: 'sm',
          minWidth: '20px'
        }}>
          <IconButton variant="plain" color="neutral" onClick={handleOnClickHidden} sx={{
            position: "absolute",
            left: "6px",
            top: "8px",
            visibility: !isHidden ? 'hidden' : 'visible'
          }}><KeyboardArrowLeft fontSize='medium'/></IconButton>
          <Collapse orientation="horizontal" in={!isHidden}>
            <Typography textColor="text.primary" level="h4" sx={{mt: 0}}>
              <b>{staking?.title ?? ""}</b>
            </Typography>
            <ModalClose sx={{visibility: isHidden ? 'hidden' : 'visible'}} onClick={handleOnClickHidden}/>
            <Box>
              <ListDivider component="hr"/>
              <Box
                sx={{
                  width: 380,
                  gap: 4,
                  p: 2,
                  display: 'grid',
                  gridTemplateColumns: 'pre-wrap',
                }}
              >
                <Typography level="body1" textColor="text.secondary">기간</Typography>
                <Typography level="body1" textColor="text.primary">{
                  (moment(staking?.startDate).isValid() ? moment(staking?.startDate).format("YY-MM-DD") : '')
                  + ' ~ ' +
                  (moment(staking?.endDate).isValid() ? moment(staking?.endDate).format("YY-MM-DD") : '')
                }</Typography>

                <Typography level="body1" textColor="text.secondary">신청기간</Typography>
                <Typography level="body1" textColor="text.primary">{
                  (moment(staking?.applyStartDate).isValid() ? moment(staking?.applyStartDate).format("YY-MM-DD") : '')
                  + ' ~ ' +
                  (moment(staking?.applyEndDate).isValid() ? moment(staking?.applyEndDate).format("YY-MM-DD") : '')
                }</Typography>

                <Typography level="body1" textColor="text.secondary">등록일시</Typography>
                <Typography level="body1" textColor="text.primary">{
                  moment(staking?.regDate).isValid() ? moment(staking?.regDate).format("YY-MM-DD HH:mm") : ''
                }</Typography>
              </Box>
              <Sheet sx={{
                py: 2,
                px: 2,
                display: 'flex',
                gap: 1
              }}>
                <Button variant="outlined" onClick={() => setOpenUpdateModal(true)}>수정</Button>
                <Button variant="outlined" color="danger" loading={deleteIsLoading} onClick={handleOnClickDelete}>삭제</Button>
              </Sheet>
            </Box>
          </Collapse>
        </Box>
      </Sheet>
      <Modal
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
      >
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          aria-describedby="basic-modal-dialog-description"
          sx={{
            minWidth: 450,
            borderRadius: 'md',
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
            스테이킹 수정
          </Typography>
          <StakingUpdate initModel={stakingModel} handleSubmitted={handleUpdateSubmitted} />
        </ModalDialog>
      </Modal>
    </>
  );
};
export default StakingViewPage;
