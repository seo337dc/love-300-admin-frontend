import { useColorScheme } from "@mui/joy/styles";
import Layout from "components/Layout";
import Navigation from "components/Navigation";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/joy/Typography";
import * as React from "react";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import { Outlet } from "react-router-dom";
import RootLayout from "layouts/RootLayout";
import { Collapse } from "@mui/material";

const ColorSchemeToggle = () => {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <IconButton size="sm" variant="outlined" color="primary" />;
  }
  return (
    <IconButton
      id="toggle-mode"
      size="sm"
      variant="outlined"
      color="primary"
      onClick={() => {
        if (mode === "light") {
          setMode("dark");
        } else {
          setMode("light");
        }
      }}
    >
      {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
};
interface DefaultLayoutProps {
  children?: React.ReactNode;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [sidePaneOpen, setSidePaneOpen] = React.useState<boolean>(true);

  return (
    <RootLayout>
      <Layout.Root
        sx={{
          gridTemplateColumns: {
            xs: "1fr",
            sm: "minmax(64px, 20px) minmax(450px, 1fr)",
            md: "auto minmax(500px, 1fr)",
          },
          ...(drawerOpen && {
            height: "100vh",
            overflow: "hidden",
          }),
        }}
      >
        <Layout.Header>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <IconButton
              variant="outlined"
              size="sm"
              onClick={() => setSidePaneOpen((prevState) => !prevState)}
              sx={{ display: { sm: "inline-flex" } }}
            >
              <MenuIcon />
            </IconButton>
            <img
              src={require("assets/images/admin_GNB_logo_2.png")}
              width={150}
              style={{ marginTop: "5px" }}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5 }}>
            <ColorSchemeToggle />
          </Box>
        </Layout.Header>
        <Box
          sx={{
            width: "max-content",
            borderRight: "1px solid",
            bgcolor: "background.componentBg",
            borderColor: "neutral.outlinedBorder",
          }}
        >
          <Collapse orientation="horizontal" in={sidePaneOpen}>
            <Box sx={{ minWidth: 200, ml: 2, mr: 2 }}>
              <Layout.SideNav>
                <Navigation />
              </Layout.SideNav>
            </Box>
          </Collapse>
        </Box>
        <Box
          sx={{
            display: "flex",
          }}
        >
          {children || <Outlet />}
        </Box>
      </Layout.Root>
    </RootLayout>
  );
};
export default DefaultLayout;
