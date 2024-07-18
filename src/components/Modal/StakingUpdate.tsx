import { Checkbox, FormLabel, Stack } from '@mui/joy';
import * as React from 'react';
import TextField from '@mui/joy/TextField';
import Button from '@mui/joy/Button';
import { useForm } from 'react-hook-form';
import { classValidatorResolver } from '@hookform/resolvers/class-validator/dist/class-validator';
import { IsNotEmpty, IsNumber, Matches } from 'class-validator';
import FormControl from '@mui/joy/FormControl';
import { useEffect } from 'react';
import { ValidMessage, ValidPattern } from '../../types/class-validator/validation-message';
import moment from 'moment';
import Typography from "@mui/joy/Typography";

export class StakingUpdateModel {
  @IsNotEmpty({message: ValidMessage.FORMAT_EMPTY_INPUT('제목')})
  title?: string;

  @IsNotEmpty({message: ValidMessage.FORMAT_EMPTY_INPUT('시작일시')})
  startDate?: string;

  @IsNotEmpty({message: ValidMessage.FORMAT_EMPTY_INPUT('종료일시')})
  endDate?: string;

  @IsNotEmpty({message: ValidMessage.FORMAT_EMPTY_INPUT('신청시작일시')})
  applyStartDate?: string;

  @IsNotEmpty({message: ValidMessage.FORMAT_EMPTY_INPUT('신청종료일시')})
  applyEndDate?: string;

  @IsNotEmpty({message: ValidMessage.FORMAT_EMPTY_INPUT('중복신청가능여부')})
  isDuplicatedApply?: boolean;

  @IsNotEmpty({message: ValidMessage.FORMAT_EMPTY_INPUT('월 이자율')})
  rewardRate?: number;
}

export class StakingUpdateProp {
  initModel?: StakingUpdateModel;
  handleSubmitted: Function;
}

const StakingUpdate = ({initModel, handleSubmitted}: StakingUpdateProp) => {
  const {register, handleSubmit, formState: {errors, isValid}, reset, control}
    = useForm<StakingUpdateModel>({
    resolver: classValidatorResolver(StakingUpdateModel),
    mode: 'onBlur'
  });

  const onSubmit = (data: StakingUpdateModel) => {
    handleSubmitted(data);
  }

  const handleOnChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (moment(e.target.value).isSameOrBefore(moment.now())) {
      e.target.value = moment(moment.now()).add(1, 'days').format("yyyy-MM-DD")
    }
  };

  useEffect(() => {
    if (!initModel) initModel = new StakingUpdateModel();
    reset(initModel)
  }, [initModel]);

  return (
    <>
      <Stack spacing={2.5} sx={{mb: 3}}>
        <Typography fontSize={15} textColor="error.main">
          날짜는 오늘 이후만 선택 가능합니다.
          <br />
          신청시작/종료일시는 시작/종료일시에 포함되어야 합니다.
        </Typography>
        <TextField type="text" label="제목" placeholder="제목을 입력해주세요" required fullWidth
                   {...register('title')}
                   error={!!errors.title}
                   helperText={errors?.title?.message}
        />
        <TextField type="date" label="시작일시" required fullWidth
                   {...register('startDate')}
                   defaultValue={initModel?.startDate}
                   error={!!errors.startDate}
                   helperText={errors?.startDate?.message}
                   onChange={handleOnChangeDate}
        />
        <TextField type="date" label="종료일시" required fullWidth
                   {...register('endDate')}
                   error={!!errors.endDate}
                   helperText={errors?.endDate?.message}
                   onChange={handleOnChangeDate}
        />
        <TextField type="date" label="신청시작일시" required fullWidth
                   {...register('applyStartDate')}
                   error={!!errors.applyStartDate}
                   helperText={errors?.applyStartDate?.message}
                   onChange={handleOnChangeDate}
        />
        <TextField type="date" label="신청종료일시" required fullWidth
                   {...register('applyEndDate')}
                   error={!!errors.applyEndDate}
                   helperText={errors?.applyEndDate?.message}
                   onChange={handleOnChangeDate}
        />
        <TextField type="number" label="월 이자율 (% 아닌 소수점 입력)" placeholder="월 이자율을 입력해주세요." required fullWidth
                   {...register('rewardRate')}
                   error={!!errors.rewardRate}
                   helperText={errors?.rewardRate?.message}
        />
        <FormControl required={true}>
          <FormLabel>중복신청가능여부</FormLabel>
          <Checkbox {...register('isDuplicatedApply')} defaultChecked={initModel?.isDuplicatedApply} />
        </FormControl>
      </Stack>
      <Stack spacing={2.5}>
        <Button type="submit" onClick={handleSubmit(onSubmit)} disabled={!isValid}>저장</Button>
      </Stack>
    </>
  );
}

export default StakingUpdate;
