import * as React from "react";
import TextField from "@mui/joy/TextField";
import Button from "@mui/joy/Button";
import { useForm } from "react-hook-form";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { ApiException } from "api/client";
import { useContext, useEffect } from "react";
import { MessageState } from "context/MessageContext";
import { useNavigate } from "react-router-dom";
import AdminApi from "api/admin";
import { AdminDtoSignInRequest } from "../../models/Admin";
import { setAuthorization } from "../../store/authorization";
const adminApi = AdminApi.getInstance();

class AdminSignInModel implements AdminDtoSignInRequest {
  signId: string;
  password: string;
}

const SignInPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AdminSignInModel>({
    resolver: classValidatorResolver(AdminSignInModel),
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const message = useContext(MessageState);

  useEffect(() => {
    setAuthorization();
  });

  const onSubmit = async (data: AdminSignInModel) => {
    try {
      const { accessToken } = await adminApi.signIn(data);
      setAuthorization(accessToken);
      navigate("/user");
    } catch (error) {
      if (error instanceof ApiException) {
        message(error.message);
      }
    }
  };

  return (
    <>
      <TextField
        type="email"
        placeholder="아이디 입력"
        label="아이디"
        {...register("signId")}
        error={!!errors.signId}
        helperText={errors?.signId?.message}
      />
      <TextField
        type="password"
        placeholder="비밀번호 입력"
        label="비밀번호"
        {...register("password")}
        error={!!errors.password}
        helperText={errors?.password?.message}
      />
      <Button
        onClick={handleSubmit(onSubmit)}
        disabled={!isValid}
        sx={{ mt: 2.5 /* margin top */ }}
      >
        로그인
      </Button>
    </>
  );
};
export default SignInPage;
