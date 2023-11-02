import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Joyride, { Step, StoreHelpers, TooltipRenderProps } from "react-joyride";

const Tooltip = ({ index, step, tooltipProps, primaryProps, backProps }: TooltipRenderProps) => {
  const [ignored, setStep] = useContext(HelpContext) ?? [];
  return (
    <Card {...tooltipProps} sx={{ maxWidth: "400px" }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {step.title}
        </Typography>
        <Typography variant="body2">{step.content}</Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        {index > 0 && (
          <Button color="secondary" variant="text" {...backProps}>
            Back
          </Button>
        )}
        <Button color="primary" variant="outlined">
          No more tips 🙅‍♂️
        </Button>
        <Button
          color="primary"
          variant="outlined"
          {...primaryProps}
          onClick={(event) => {
            primaryProps.onClick(event);
            if (setStep) setStep(undefined);
          }}
        >
          Got it 👍
        </Button>
      </CardActions>
    </Card>
  );
};

const HelpContext = React.createContext<ReturnType<typeof useState<Step>> | undefined>(undefined);

export const HelpWrapper = ({ children }: React.PropsWithChildren) => {
  const stepState = useState<Step>();
  const [helpers, setHelpers] = useState<StoreHelpers>();
  console.log("HEYO, STEP CONTEXT IS: " + JSON.stringify(stepState[0]));

  useEffect(() => {
    if (stepState[0]) {
      helpers?.open();
    }
  }, [helpers, stepState]);

  return (
    <HelpContext.Provider value={stepState}>
      <Joyride run steps={stepState[0] ? [stepState[0]] : []} tooltipComponent={Tooltip} getHelpers={setHelpers} />
      {children}
    </HelpContext.Provider>
  );
};

const useHelp = (target: string | HTMLElement, content: React.ReactNode) => {
  const [step, setStep] = useContext(HelpContext) ?? [];

  // This needs to live in a `useEffect` so it doesn't trigger *while* another component is rendering...
  useEffect(() => {
    if (!step && setStep) {
      // No step is set, it's my time to SHINE
      setStep({
        target,
        content:
          content +
          " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        disableBeacon: true,
      });
    }
  }, [content, setStep, step, target]);
};

export default useHelp;
