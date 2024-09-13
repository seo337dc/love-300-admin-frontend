import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  AspectRatio,
  Box,
  Modal,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@mui/joy";
import TextField from "@mui/joy/TextField";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Switch from "@mui/joy/Switch";

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
  console.log("initModel", initModel?.storeImages);
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

  const [showImg, setShowImg] = useState<boolean>(false);
  const [storeType, setStoreType] = useState(initModel?.approveStatus || 0);
  const [approve, setApprove] = useState(0);
  const [selectedImg, setSelectedImg] = useState<string>(""); // 선택된 이미지 상태

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
    <Box
      sx={{
        maxWidth: "100%", // 반응형으로, 화면이 작아지면 너비를 100%로 맞춤
        height: "auto", // 내용에 따라 높이 자동 조정
        margin: "0 auto", // 화면 중앙 정렬
        p: 2, // 내부 패딩
      }}
    >
      <Typography
        component="label"
        endDecorator={
          <Switch
            sx={{ ml: 1 }}
            checked={showImg}
            onChange={() => setShowImg(!showImg)}
          />
        }
      >
        {showImg ? "가맹점 이미지" : "가맹점 정보"}
      </Typography>

      {!showImg && (
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
      )}

      {showImg && (
        <>
          <Tabs
            aria-label="Basic tabs"
            defaultValue={0}
            sx={{ marginTop: "10px" }}
          >
            <TabList>
              <Tab>정보 이미지</Tab>
              <Tab>메뉴 이미지</Tab>
              <Tab>사업자등록증 이미지</Tab>
            </TabList>
            <TabPanel value={0}>
              <Grid container spacing={2} columns={16}>
                {initModel?.storeImages &&
                  initModel.storeImages
                    .filter((img) => img.type === "INFO")
                    .map((img, index) => (
                      <Grid xs={4} key={index}>
                        <Box
                          sx={{
                            width: "100%",
                            height: "auto", // 이미지 크기에 맞춰 높이 자동 조정
                            p: 1,
                            display: "flex", // 이미지를 가운데 정렬
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <AspectRatio ratio="16/9" sx={{ width: "100%" }}>
                            <img
                              onClick={() => setSelectedImg(img.url)}
                              src={img.url}
                              srcSet={`${img.url} 2x`}
                              alt={`이미지 ${index}`}
                              style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "100%",
                              }} // 이미지가 비율에 맞게 꽉 차도록 설정
                            />
                          </AspectRatio>

                          {img.isPrimary && <Typography>대표이미지</Typography>}
                        </Box>
                      </Grid>
                    ))}
              </Grid>
            </TabPanel>
            <TabPanel value={1}>
              <Grid
                container
                sx={{
                  width: "100%",
                }}
              >
                {initModel?.storeImages &&
                  initModel.storeImages
                    .filter((img) => img.type === "MENU")
                    .map((img, index) => (
                      <Grid xs={8} key={index}>
                        <Box
                          sx={{
                            width: "100%",
                            height: "500px", // 이미지 크기에 맞춰 높이 자동 조정
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <AspectRatio ratio="16/16" sx={{ width: "100%" }}>
                            <img
                              onClick={() => setSelectedImg(img.url)}
                              src={img.url}
                              srcSet={`${img.url} 2x`}
                              alt={`이미지 ${index}`}
                              style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "100%",
                              }} // 이미지가 비율에 맞게 꽉 차도록 설정
                            />
                          </AspectRatio>

                          {img.isPrimary && <Typography>대표이미지</Typography>}
                        </Box>
                      </Grid>
                    ))}
              </Grid>
            </TabPanel>
            <TabPanel value={2}>
              <Grid
                container
                sx={{
                  width: "100%",
                }}
              >
                {initModel?.storeImages &&
                  initModel.storeImages
                    .filter((img) => img.type === "BUSINESS")
                    .map((img, index) => (
                      <Grid xs={8} key={index}>
                        <Box
                          sx={{
                            width: "100%",
                            height: "500px", // 이미지 크기에 맞춰 높이 자동 조정
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <AspectRatio ratio="16/16" sx={{ width: "100%" }}>
                            <img
                              onClick={() => setSelectedImg(img.url)}
                              src={img.url}
                              srcSet={`${img.url} 2x`}
                              alt={`이미지 ${index}`}
                              style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "100%",
                              }} // 이미지가 비율에 맞게 꽉 차도록 설정
                            />
                          </AspectRatio>

                          {img.isPrimary && <Typography>대표이미지</Typography>}
                        </Box>
                      </Grid>
                    ))}
              </Grid>
            </TabPanel>
          </Tabs>

          <Modal
            open={!!selectedImg}
            onClose={() => setSelectedImg("")}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                maxWidth: "90%",
                maxHeight: "90%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white", // 모달의 배경색 설정
              }}
            >
              {selectedImg && (
                <img
                  src={selectedImg}
                  alt="확대 이미지"
                  style={{
                    // width: '100%',
                    height: "auto",
                    maxHeight: "500px",
                    objectFit: "contain",
                  }} // 이미지가 화면에 맞게 표시되도록 설정
                />
              )}
            </Box>
          </Modal>
        </>
      )}

      <Stack spacing={2.5}>
        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
        >
          저장
        </Button>
      </Stack>
    </Box>
  );
};

export default StoreUpdate;
