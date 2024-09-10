import { ReactElement, useEffect } from "react";
import { useAppDispatch } from "../../store/hooks";
import { setPage } from "../../store/globalSlice";

export default function Dashboard(): ReactElement {
  const dispatch = useAppDispatch();
  console.log("component rendered")
  useEffect(() => {
    dispatch(setPage("dashboard"));
  }, [dispatch]);
  return (
    <>
    
    </>
  );
}
