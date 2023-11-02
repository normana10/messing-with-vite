import { useCallback, useState } from "react";

const useToggle = (startingValue?: boolean) => {
  const [toggled, setToggled] = useState(startingValue ?? false);
  const toggle = useCallback(() => {
    setToggled(!toggled);
  }, [toggled]);
  return [toggled, toggle] as const;
};

export default useToggle;
