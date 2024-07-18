import {Box} from "@mui/joy";
import TextField from "@mui/joy/TextField";
import * as React from "react";
import {useForm} from "react-hook-form";
import {classValidatorResolver} from "@hookform/resolvers/class-validator/dist/class-validator";
import {useState} from "react";
import {ValidMessage, ValidPattern} from "../../types/class-validator/validation-message";
import {Match} from "../../types/class-validator/match.decorator";
import Button from "@mui/joy/Button";
import {Matches} from "class-validator";

export class TransactionModal {
  @Matches(ValidPattern.DECIMAL, { message: ValidMessage.INVALID_INPUT })
  amount: number;
  @Match('amount', { message: ValidMessage.NOT_MATCH_AMOUNT })
  amountConfirm: number;
}

const Transaction = ({onNext}: {onNext: Function}) => {
  const { register, handleSubmit, formState: { errors }}
    = useForm<TransactionModal>({
    resolver: classValidatorResolver(TransactionModal)
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: TransactionModal) => {
    setIsLoading(true);
    await onNext(data);
    setIsLoading(false);
  }

  return (
    <>
      <Box role="group" sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        gap: 3,
        mb: 7
      }}>
        <TextField type="number" placeholder="금액을 입력해 주세요" label="금액" required fullWidth
                   {...register('amount')}
                   error={!!errors.amount}
                   helperText={errors?.amount?.message}
        />
        <TextField type="number" placeholder="금액을 다시한번 입력해 주세요" label="금액확인" required fullWidth
                   {...register('amountConfirm')}
                   error={!!errors.amountConfirm}
                   helperText={errors?.amountConfirm?.message}
        />
      </Box>
      <Button loading={isLoading} onClick={handleSubmit(onSubmit)}>확인</Button>
    </>
  )
}
export default Transaction;