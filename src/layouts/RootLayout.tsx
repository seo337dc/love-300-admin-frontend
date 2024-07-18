import * as React from "react";
import teamTheme from "../theme";
import {Theme} from "@mui/joy/styles";
import { CssVarsProvider } from '@mui/joy/styles';
import {GlobalStyles} from "@mui/system";
import {MessageContextProvider} from "context/MessageContext";

const RootLayout = ({ children }: {children: React.ReactNode}) => {
  return (
    <CssVarsProvider disableTransitionOnChange theme={teamTheme}>
      <MessageContextProvider>
        <GlobalStyles<Theme>
          styles={(theme) => ({
            body: {
              margin: 0,
              fontFamily: theme.vars.fontFamily.body,
            },
          })}
        />
        {children}
      </MessageContextProvider>
    </CssVarsProvider>
  )
}

export default RootLayout
