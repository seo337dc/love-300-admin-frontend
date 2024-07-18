import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import * as React from "react";
import {useState} from "react";
import IconButton from "@mui/joy/IconButton";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import {Collapse} from "@mui/material";
import ListDivider from "@mui/joy/ListDivider";

interface FilterProp {
  children: React.ReactNode
  onClickSearch: Function;
  onClickClear: Function;
}

export const Filter = ({ children, onClickSearch, onClickClear }: FilterProp) => {
  return (
    <>
      <Box
        sx={{
          p: 2,
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography
          fontSize="xs"
          textColor="text.tertiary"
          textTransform="uppercase"
          letterSpacing="md"
          fontWeight="lg"
        >
          Filter by
        </Typography>
        <div>
          <Button size="sm" variant="plain" sx={{ fontSize: 'sm', px: 1, mr: 1 }} onClick={() => onClickSearch()}>
            검색
          </Button>
          <Button size="sm" variant="plain" color='danger' sx={{ fontSize: 'sm', px: 1 }} onClick={() => onClickClear()}>
            초기화
          </Button>
        </div>
      </Box>
      {children}
    </>
  );

}
interface FilterItemProp {
  label: string;
  component: React.ReactElement;
  isDivider?: boolean;
}

export const FilterInput = ({label, component, isDivider = true}: FilterItemProp) => {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography level="body2" textColor="text.primary">
            {label}
          </Typography>
          <IconButton
            size="sm"
            variant="plain"
            color="primary"
            sx={{ '--IconButton-size': '24px' }}
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpRoundedIcon fontSize="small" color="primary" />: <KeyboardArrowDownRoundedIcon fontSize="small" color="primary" />}
          </IconButton>
        </Box>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2 }}>
            {component}
          </Box>
        </Collapse>
      </Box>
      {isDivider ? <ListDivider component="hr" /> : null}
    </>
  );
};
