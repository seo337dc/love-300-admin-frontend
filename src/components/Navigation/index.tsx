import * as React from "react";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";

import {
  LinkProps as RouterLinkProps,
  useLocation,
  NavLink,
  useNavigate,
} from "react-router-dom";
import IconButton from "@mui/joy/IconButton";
import Sheet from "@mui/joy/Sheet";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import Typography from "@mui/joy/Typography";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LockIcon from "@mui/icons-material/Lock";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import Box from "@mui/joy/Box";
import ListDivider from "@mui/joy/ListDivider";
import { useState } from "react";
import { Collapse } from "@mui/material";

interface ListItemLinkProps {
  icon?: React.ReactElement;
  text: string;
  to: string;
  children?: React.ReactNode;
  isNested?: boolean;
  onClick?: Function;
}

const ListItemLink = (props: ListItemLinkProps) => {
  const { pathname } = useLocation();
  const { icon, text, to } = props;
  const renderLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, "to">>(
        function Link(itemProps, ref) {
          return (
            <NavLink
              to={to}
              ref={ref}
              {...itemProps}
              role={undefined}
              onClick={(e) => {
                if (props.onClick) {
                  e.preventDefault();
                  props.onClick();
                }
              }}
            />
          );
        }
      ),
    [to, props]
  );
  const defaultAttribute = {
    itemButton: {
      variant: undefined,
      color: undefined,
    },
    itemIcon: {
      color: "",
    },
  };
  if (pathname.startsWith(to)) {
    (defaultAttribute.itemButton.variant as any) = "soft";
    (defaultAttribute.itemButton.color as any) = "primary";
    defaultAttribute.itemIcon.color = "primary";
  }
  return (
    <ListItem nested={!!props.isNested}>
      <ListItemButton
        component={renderLink}
        variant={defaultAttribute.itemButton.variant as any}
        color={defaultAttribute.itemButton.color as any}
      >
        {icon ? (
          <ListItemDecorator>
            {{ ...icon, props: { color: defaultAttribute.itemIcon.color } }}
          </ListItemDecorator>
        ) : null}
        <ListItemContent sx={{ fontSize: "medium" }}>{text}</ListItemContent>
      </ListItemButton>
      {props.children ? props.children : null}
    </ListItem>
  );
};

export default function Navigation() {
  return <AdminNavigation />;
}

const AdminNavigation = () => {
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const isOpenMyPageMenu = Boolean(anchorEl);
  const navigate = useNavigate();
  const [openUserMenu, setOpenUserMenu] = useState(true);
  const [openHistoryMenu, setOpenHistoryMenu] = useState(true);
  const [openStakingMenu, setOpenStakingMenu] = useState(true);
  const [openLockupMenu, setOpenLockupMenu] = useState(true);
  const handleOnClickMyPage = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOnCloseMyPage = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <List size="sm" sx={{ "--List-item-radius": "8px" }}>
        <Sheet
          sx={{
            display: "flex",
            alignItems: "center",
            alignContent: "space-between",
            py: 1,
          }}
        >
          <Box sx={{ flex: 2 }}>
            <Typography
              level="body2"
              fontWeight="xl"
              sx={{ mb: 0.5 }}
            ></Typography>
            <Typography level="body1" fontWeight="xl">
              관리자님
            </Typography>
          </Box>
          <IconButton
            id="myPage-button"
            size="sm"
            variant="outlined"
            color="primary"
            aria-controls={isOpenMyPageMenu ? "myPage-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={isOpenMyPageMenu ? "true" : undefined}
            onClick={handleOnClickMyPage}
          >
            <ManageAccountsIcon />
          </IconButton>
          <Menu
            open={isOpenMyPageMenu}
            anchorEl={anchorEl}
            id="myPage-menu"
            aria-labelledby="myPage-button"
            placement="bottom-end"
            onClose={handleOnCloseMyPage}
          >
            <ListItem nested>
              <List>
                <MenuItem
                  onClick={() => {
                    if (!window.confirm("로그아웃 하시겠습니까?")) return false;
                    navigate("/sign-in");
                  }}
                >
                  Logout
                </MenuItem>
              </List>
            </ListItem>
          </Menu>
        </Sheet>
        <ListDivider sx={{ mt: 2 }} />
        <ListItem nested sx={{ p: 0 }}>
          <List
            aria-labelledby="nav-list-browse"
            sx={{
              mt: 2,
              "& .JoyListItemButton-root": { p: "12px" },
            }}
          >
            <ListItemLink
              to={"/user"}
              text={"사용자"}
              icon={<PeopleIcon fontSize="inherit" />}
            />
            <ListItemLink
              to={"/tx"}
              text={"거래"}
              icon={<AttachMoneyIcon fontSize="inherit" />}
            />
            <ListItemLink
              to={"/staking"}
              text={"스테이킹"}
              icon={<AccountBalanceIcon fontSize="inherit" />}
            />
            <ListItemLink
              to={"/lockup"}
              text={"락업"}
              icon={<LockIcon fontSize="inherit" />}
            />
          </List>
        </ListItem>
      </List>
    </>
  );
};
