import { useContext, useEffect, useRef, useState } from 'react';
import { PageInfoDto } from '../../models';
import GridTable, { GridColDef, StretchyDataGridHandler } from 'components/Common/GridTable';
import { Builder } from 'builder-pattern';
import moment from 'moment';
import * as React from 'react';
import Layout from 'components/Layout';
import { Filter, FilterInput } from 'components/Filter';
import DateRangePicker from 'components/Common/DateRangePicker';
import { Box, Breadcrumbs, ModalClose, ModalDialog } from '@mui/joy';
import Typography from '@mui/joy/Typography';
import TextField from '@mui/joy/TextField';
import { KeyboardArrowRight } from '@mui/icons-material';
import { ICellRendererParams } from 'ag-grid-community';
import { GridActionsCellItem } from '@mui/x-data-grid';
import LastPageRoundedIcon from '@mui/icons-material/LastPageRounded';
import { useNavigate } from 'react-router-dom';
import { StakingDtoCreateRequest, StakingDtoFetchRequest, StakingDtoFetchResponse } from '../../models/Staking';
import StakingApi from '../../api/staking';
import Button from '@mui/joy/Button';
import { ApiException } from '../../api/client';
import { MessageState } from '../../context/MessageContext';
import Modal from '@mui/joy/Modal';
import StakingCreate, { StakingCreateModel } from '../../components/Modal/StakingCreate';

const stakingApi = StakingApi.getInstance()

class FilterSearchModel implements StakingDtoFetchRequest {
  page: number = 0;
  size: number = 10;
  text?: string = '';
  startDate?: string = '';
  endDate?: string = '';
}

/**
 * 스테이킹 관리
 * @constructor
 */
const StakingPage = () => {
  const navigate = useNavigate();
  const message = useContext(MessageState);
  const [filterData, setFilterData] = useState<FilterSearchModel>(new FilterSearchModel());
  const [searchData, setSearchData] = useState<FilterSearchModel>(new FilterSearchModel());
  const [rows, setRows] = useState<any[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfoDto>();
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const columns: Array<GridColDef> = [
    Builder(GridColDef).field('no').headerName('No').width(90).flex(0).build(),
    Builder(GridColDef).field('title').headerName('제목').build(),
    Builder(GridColDef).field('startDate').headerName('시작일자')
      .valueFormatter(params => {
        const date = moment(params.value);
        return date.isValid() ? date.format('YY-MM-DD') : '';
      })
      .width(120).flex(0).build(),
    Builder(GridColDef).field('endDate').headerName('종료일자')
      .valueFormatter(params => {
        const date = moment(params.value);
        return date.isValid() ? date.format('YY-MM-DD') : '';
      })
      .width(120).flex(0).build(),
    Builder(GridColDef).field('applyStartDate').headerName('신청시작일자')
      .valueFormatter(params => {
        const date = moment(params.value);
        return date.isValid() ? date.format('YY-MM-DD') : '';
      })
      .width(120).flex(0).build(),
    Builder(GridColDef).field('applyEndDate').headerName('신청종료일자')
      .valueFormatter(params => {
        const date = moment(params.value);
        return date.isValid() ? date.format('YY-MM-DD') : '';
      })
      .width(120).flex(0).build(),
    Builder(GridColDef).field('isDuplicatedApply').headerName('중복신청')
      .valueFormatter(params => {
        return params.value ? '가능' : '불가';
      })
      .width(90).flex(0).build(),
    Builder(GridColDef).field('rewardRate').headerName('월 이자율').width(120).flex(0).build(),
    Builder(GridColDef).field('regDate').headerName('등록일시')
      .valueFormatter(params => {
        const date = moment(params.value);
        return date.isValid() ? date.format('YY-MM-DD HH:mm') : '';
      })
      .width(150).flex(0).build(),
    Builder(GridColDef).field('').pinned('right').width(80).cellRenderer(({data}: ICellRendererParams) => [
      <GridActionsCellItem key="1" icon={<LastPageRoundedIcon sx={{fontSize: 25}}/>} label="상세보기"
                           onClick={() => navigate(`/staking/${data.id}`)}/>
    ]).build()
  ];

  useEffect(() => {
    const fetchData = async () => {
      const res = await stakingApi.fetch(searchData);
      if (res) setPageInfo(res);
      const rows = res.content?.map((item: StakingDtoFetchResponse, index: number) => {
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

  const handleCreateSubmitted = async (model: StakingCreateModel) => {
    const form: StakingDtoCreateRequest = {
      title: model.title,
      startDate: model.startDate,
      endDate: model.endDate,
      applyStartDate: model.applyStartDate,
      applyEndDate: model.applyEndDate,
      isDuplicatedApply: model.isDuplicatedApply,
      rewardRate: model.rewardRate
    };
    try {
      await stakingApi.create(form);
      setSearchData({...filterData, page: 0})
      setOpenCreateModal(false)
    } catch (error) {
      if (error instanceof ApiException) {
        message(error.message);
      }
    }
  }

  return (
    <>
      <Layout.SidePane width="25vw">
        <Filter onClickClear={handleOnClickClearFilter} onClickSearch={handleOnSearch}>
          <FilterInput label="등록일시" component={
            <DateRangePicker startValue={filterData.startDate}
                             endValue={filterData.endDate}
                             startName="startDate"
                             endName="endDate" onChange={onChangeFormHandler}
            />
          }/>
          <FilterInput label="제목" component={<TextField name="text" placeholder="제목 검색"
                                                        value={filterData.text}
                                                        onChange={onChangeFormHandler}/>}/>
        </Filter>
      </Layout.SidePane>
      <Layout.Main>
        <GridTable columns={columns} rows={rows} pageInfo={pageInfo} onChangePage={handleOnChangePage}
                   header={<>
                     <Breadcrumbs separator={<KeyboardArrowRight/>} aria-label="breadcrumbs">
                       <Typography level="h5"> 스테이킹 관리 </Typography>
                     </Breadcrumbs>
                     <Box sx={{display: 'flex', gap: 2}}>
                       <Button onClick={() => setOpenCreateModal(true)}>등록</Button>
                     </Box>
                   </>
                   }
        />
      </Layout.Main>
      <Modal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
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
          <ModalClose/>
          <Typography
            id="basic-modal-dialog-title"
            component="h2"
            level="inherit"
            mb={3}
          >
            스테이킹 등록
          </Typography>
          <StakingCreate handleSubmitted={handleCreateSubmitted}/>
        </ModalDialog>
      </Modal>
    </>
  );
};
export default StakingPage;