import React, {createContext, useCallback, useMemo, useState} from "react";
import WarningIcon from "@mui/icons-material/Warning";
import IconButton from "@mui/joy/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/joy/Typography";
import Alert from "@mui/joy/Alert";
import { Snackbar } from "@mui/material";

export const MessageState = createContext<any | undefined>(undefined);
type color = "danger" | "primary" | "neutral" | "info" | "success" | "warning"

export function MessageContextProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<{message ?: string; render ?: boolean, type ?: color}[]>([]);
  const intialOptions = useMemo(() => ({
    type: 'danger',
    cancleable : true
  }),[]);

  const messaging = useCallback((text : string, type: color) => {
    setMessages(prev => [...prev, { message : text, render: true, type: type ?? 'danger' }])
  },[intialOptions])

  const removeMessage = (index: number) => {
    setMessages((prevState) => {
      prevState[index].render = false;
      return [...prevState];
    });
  }

  return (
    <MessageState.Provider value={messaging}>
      {children}
      {messages.map((v, index) => (
        <Snackbar open={v.render}
                  autoHideDuration={v.type != "danger" ? 5000 : 9999999}
                  key={index}
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                  sx={{zIndex: 10000}}
                  onClose={(event: React.SyntheticEvent | Event, reason?: string) => {
                    if (reason === 'clickaway') return
                      removeMessage(index);
                  }}
        >
          <Alert
            key={index}
            startDecorator={<WarningIcon sx={{ mx: 0.5 }} />}
            variant="soft"
            color={v.type}
            endDecorator={
              <React.Fragment>
                <IconButton variant="soft" size="sm" color={v.type} sx={{ ml: 1}} onClick={() => removeMessage(index)}>
                  <CloseIcon />
                </IconButton>
              </React.Fragment>
            }
          >
            <Typography color={v.type} fontWeight="md">
              { v.message }
            </Typography>
          </Alert>
        </Snackbar>
      ))}
    </MessageState.Provider>
  );
}
