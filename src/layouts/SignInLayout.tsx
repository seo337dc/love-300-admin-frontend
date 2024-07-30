import Typography from "@mui/joy/Typography";
import * as React from "react";
import { Sheet } from "@mui/joy";
import { ReactElement } from "react";
import RootLayout from "./RootLayout";
import Layout from "../components/Layout";

interface SignInLayoutProps {
  header?: ReactElement | null;
  component: ReactElement;
}

const SignInLayout = ({ component, header }: SignInLayoutProps) => {
  return (
    <RootLayout>
      <Layout.Root
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <main>
          <Sheet
            sx={{
              width: 350,
              mx: "auto",
              my: 40,
              py: 3,
              px: 2,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              borderRadius: "sm",
              boxShadow: "md",
            }}
            variant="outlined"
          >
            {header ? (
              header
            ) : (
              <Sheet
                sx={{
                  textAlign: "center",
                  mt: 5,
                  mb: 5,
                }}
              >
                <img
                  src={require("assets/images/admin-login.webp")}
                  width={270}
                />
                <img
                  src={require("assets/images/admin_login_logo_2.png")}
                  width={270}
                />
                <Typography
                  textColor="text.primary"
                  level="h5"
                  component="h1"
                  sx={{ mt: 5 }}
                >
                  <b>관리자</b>
                </Typography>
              </Sheet>
            )}
            <>{component}</>
          </Sheet>
        </main>
      </Layout.Root>
    </RootLayout>
  );
};
export default SignInLayout;
