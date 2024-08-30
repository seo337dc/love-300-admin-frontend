import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { Stack } from "@mui/joy";
import TextField from "@mui/joy/TextField";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";

import { classValidatorResolver } from "@hookform/resolvers/class-validator/dist/class-validator";
import { StoreContent, StoreDtoUpdateRequest } from "models/Store";
import Grid from "@mui/joy/Grid";

export class StoreUpdateModel {
  id?: number;
  rejectReason?: string;
  storeType: number;
}

export class StoreUpdateProp {
  initModel?: StoreContent;
  handleSubmitted: Function;
}

const StoreUpdate = ({ initModel, handleSubmitted }: StoreUpdateProp) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    control,
  } = useForm<StoreContent>({
    resolver: classValidatorResolver(StoreUpdateModel),
    mode: "onBlur",
  });

  const [storeType, setStoreType] = useState(initModel?.approveStatus || 0);
  const [approve, setApprove] = useState(0);

  const onSubmit = (data: StoreUpdateModel) => {
    const param: StoreDtoUpdateRequest = {
      id: data.id,
      rejectReason: data.rejectReason || "",
      approveStatus: approve,
    };
    handleSubmitted(param);
  };

  useEffect(() => {
    if (!initModel) initModel = new StoreContent();
    reset(initModel);
    setStoreType(initModel.storeType);
    setApprove(initModel.approveStatus);
  }, [initModel]);

  return (
    <>
      <Grid container spacing={2} columns={16}>
        <Grid xs={8}>
          <Stack spacing={2.5} sx={{ mb: 3 }}>
            <Typography fontSize={12} textColor="error.main">
              거절하실 경우, 거절사유를 작성하세요.
            </Typography>

            <Typography fontSize={15}>상태</Typography>
            <Controller
              name="approveStatus"
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => {
                return (
                  <Select
                    value={approve}
                    onChange={(_, value) => {
                      setApprove(value || 0);
                    }}
                    onBlur={onBlur}
                    ref={ref}
                  >
                    <Option value={0}>요청</Option>
                    <Option value={1}>승인</Option>
                    <Option value={2}>거절</Option>
                  </Select>
                );
              }}
            />

            <TextField
              type="text"
              placeholder="거절사유를 작성하세요."
              label="거절사유"
              required
              fullWidth
              {...register("rejectReason")}
              error={!!errors.rejectReason}
              helperText={errors?.rejectReason?.message}
            />

            <TextField
              disabled
              variant="soft"
              type="text"
              placeholder="title"
              label="가맹점 이름"
              required
              fullWidth
              {...register("title")}
            />

            <TextField
              disabled
              variant="soft"
              type="text"
              placeholder="대표"
              label="대표"
              required
              fullWidth
              {...register("representativeName")}
            />

            <TextField
              disabled
              variant="soft"
              type="text"
              placeholder="전화번호"
              label="전화번호"
              required
              fullWidth
              {...register("representativePhone")}
            />

            <TextField
              disabled
              variant="soft"
              type="text"
              placeholder="사업자번호"
              label="사업자번호"
              required
              fullWidth
              {...register("businessNumber")}
            />
          </Stack>
        </Grid>

        <Grid xs={8}>
          <Typography fontSize={15}>카테고리</Typography>
          <Controller
            name="storeType"
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => {
              return (
                <Select
                  variant="soft"
                  disabled
                  value={storeType}
                  onBlur={onBlur}
                  ref={ref}
                >
                  <Option value={0}>기타</Option>
                  <Option value={1}>카페/디저트</Option>
                  <Option value={2}>음식점/식당</Option>
                  <Option value={3}>미용/뷰티</Option>
                </Select>
              );
            }}
          />

          <Stack spacing={2.5} sx={{ mb: 3 }}>
            <TextField
              disabled
              variant="soft"
              type="text"
              placeholder="도로명"
              label="도로명"
              required
              fullWidth
              {...register("roadAddress")}
            />

            <TextField
              disabled
              variant="soft"
              type="text"
              placeholder="지번주소"
              label="지번주소"
              required
              fullWidth
              {...register("jibunAddress")}
            />

            <TextField
              disabled
              variant="soft"
              type="text"
              placeholder="주소(영어)"
              label="주소(영어)"
              required
              fullWidth
              {...register("englishAddress")}
            />
            <TextField
              disabled
              variant="soft"
              type="text"
              placeholder="상세주소"
              label="상세주소"
              required
              fullWidth
              {...register("detailAddress")}
            />

            <TextField
              disabled
              variant="soft"
              type="text"
              placeholder="영업시간"
              label="영업시간"
              required
              fullWidth
              {...register("businessHours")}
            />

            <TextField
              disabled
              variant="soft"
              type="text"
              placeholder="설명"
              label="설명"
              required
              fullWidth
              {...register("description")}
            />
          </Stack>
        </Grid>
      </Grid>

      <Stack spacing={2.5}>
        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
        >
          저장
        </Button>
      </Stack>
    </>
  );
};

export default StoreUpdate;
