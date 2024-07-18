import {ChangeEvent, useEffect, useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import * as React from "react";
import DatePicker from "components/Common/DatePicker";
import moment from "moment";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";

class DateRangeData {
    date: string;
    isDisable: boolean = false;
    isOpen: boolean | undefined = false;
    constructor(_isDisable = false) {
        this.isDisable = _isDisable
    }
}

interface DateRangePickerProps {
    startName?: string;
    endName?: string;
    format?: string;
    onChange: Function,
    startValue?: string;
    endValue?: string;
}

const DateRangePicker = ({startName = "", endName = "", onChange, format = "YYYY-MM-DD", startValue, endValue }: DateRangePickerProps) => {
    const [startDateRangeData, setStartDateRangeData] = useState<DateRangeData>(new DateRangeData());
    const [endDateRangeData, setEndDateRangeData] = useState<DateRangeData>(new DateRangeData());
    useEffect(() => {
        if (startValue === '') {
            setStartDateRangeData(prevState => {
                return {...prevState, date: startValue}
            });
            setEndDateRangeData(prevState => {
                return {...prevState, date: startValue}
            });
        }

    }, [startValue]);

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDateRangeData({ date: e.target.value, isDisable: false, isOpen: true });
        onChange(e);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDateRangeData(prevState => {
            return {...prevState, date: e.target.value, isOpen: false}
        })
        onChange(e);
    };

    return (
      <Box sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center'
      }}>
          <DatePicker initValue={startDateRangeData.date}
                      name={startName}
                      format={format}
                      onChange={handleStartDateChange}
                      disable={startDateRangeData.isDisable}
          />
          <Box mx={1}>
              <Typography level="body3" fontWeight="md">~</Typography>
          </Box>
          <DatePicker initValue={endDateRangeData.date}
                      name={endName}
                      format={format}
                      onChange={handleEndDateChange}
                      disable={endDateRangeData.isDisable}
                      minDate={dayjs(startDateRangeData.date)}
          />
      </Box>
    );
};
export default DateRangePicker;

