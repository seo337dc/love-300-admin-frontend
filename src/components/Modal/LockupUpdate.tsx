import { Checkbox, FormLabel, Stack } from '@mui/joy';
import * as React from "react";
import TextField from "@mui/joy/TextField";
import Button from "@mui/joy/Button";
import {useForm} from "react-hook-form";
import {classValidatorResolver} from "@hookform/resolvers/class-validator/dist/class-validator";
import { IsNotEmpty, IsNumber, Matches } from 'class-validator';
import FormControl from "@mui/joy/FormControl";
import {useEffect} from "react";
import { ValidMessage, ValidPattern } from '../../types/class-validator/validation-message';
import moment from "moment";
import Typography from "@mui/joy/Typography";

export class LockupUpdateModel {
  id?: number;

  @IsNotEmpty({message: ValidMessage.FORMAT_EMPTY_INPUT('제목')})
  title?: string;

  @IsNotEmpty({message: ValidMessage.FORMAT_EMPTY_INPUT('수량')})
  amount?: number;

  @IsNotEmpty({ message: ValidMessage.FORMAT_EMPTY_INPUT("시작일시") })
  startDate: string;

  @IsNotEmpty({ message: ValidMessage.FORMAT_EMPTY_INPUT("종료일시") })
  endDate: string;

  @IsNotEmpty({message: ValidMessage.FORMAT_EMPTY_INPUT('월 지급비율')})
  releaseRate?: number;
}

export class LockupUpdateProp {
  initModel?: LockupUpdateModel;
  handleSubmitted: Function;
}

const LockupUpdate = ({initModel, handleSubmitted}: LockupUpdateProp) => {
  const { register, handleSubmit, formState: { errors, isValid }, reset, control}
    = useForm<LockupUpdateModel>({
    resolver: classValidatorResolver(LockupUpdateModel),
    mode: 'onBlur',
  });

  const onSubmit = (data: LockupUpdateModel) => {
    handleSubmitted(data);
  }

  const handleOnChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (moment(e.target.value).isSameOrBefore(moment.now())) {
      e.target.value = moment(moment.now()).add(1, 'days').format("yyyy-MM-DD")
    }
  };

  useEffect(() => {
    if (!initModel) initModel = new LockupUpdateModel();
    reset(initModel)
  }, [ initModel ]);

  return (
    <>
      <Stack spacing={2.5} sx={{mb: 3}}>
        <Typography fontSize={15} textColor="error.main">날짜는 오늘 이후만 선택 가능합니다.</Typography>
        <TextField type="text" label="제목" placeholder="제목을 입력해주세요" required fullWidth
                   {...register('title')}
                   error={!!errors.title}
                   helperText={errors?.title?.message}
        />
        <TextField type="number" placeholder="수량을 입력해 주세요" label="수량" required fullWidth
                   {...register('amount')}
                   error={!!errors.amount}
                   helperText={errors?.amount?.message}
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
        <TextField type="number" label="월 지급비율 (% 아닌 소수점 입력)" placeholder="월 지급비율을 입력해주세요." required fullWidth
                   {...register('releaseRate')}
                   error={!!errors.releaseRate}
                   helperText={errors?.releaseRate?.message}
        />
      </Stack>
      <Stack spacing={2.5}>
        <Button type="submit" onClick={handleSubmit(onSubmit)} disabled={!isValid}>저장</Button>
      </Stack>
    </>
  );
}

export default LockupUpdate;
