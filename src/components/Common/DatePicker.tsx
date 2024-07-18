import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {Dayjs} from "dayjs";
import { TextField } from '@mui/material';
import * as React from "react";
interface DatePickerProps {
  name: string;
  initValue?: string | null;
  format?: string;
  onChange: Function;
  disable?: boolean;
  width?: string;
  minDate?: Dayjs;
  open?: boolean | undefined;
  onClose?: Function;
  onOpen?: Function;
}

const DatePicker = ({initValue = null, format = "YYYY-MM-DD", name, onChange, disable, minDate, open, onClose, onOpen}: DatePickerProps) => {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (initValue === "") setValue(null)
  }, [initValue])

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
    if (newValue?.isValid()) {
      const e: ChangeEvent = {
        target: {
          name: name,
          value: newValue?.format(format)
        }
      } as unknown as ChangeEvent
      onChange(e)
    }
  };

  const handleOnClose = () => {
    if (!!onClose) onClose()
  };

  const handleOnOpen = () => {
    if (!!onOpen) onOpen()
  };
  return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div
          id={name}
        >
          <DesktopDatePicker
              inputFormat={format}
              value={value}
              onChange={handleChange}
              renderInput={(params) => <TextField {...params} size="small" name={name} sx={{ width: '100%' }}/> }
              disabled={disable}
              minDate={minDate}
              open={open}
              onClose={handleOnClose}
              onOpen={handleOnOpen}
          />
        </div>
      </LocalizationProvider>

    );
};
export default DatePicker;

