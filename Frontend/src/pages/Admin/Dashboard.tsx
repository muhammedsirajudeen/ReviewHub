import { ReactElement, useEffect,  } from "react";
import { ToastContainer } from "react-toastify";
import { useAppDispatch } from "../../store/hooks";
import { setPage } from "../../store/globalSlice";

export default function AdminDashboard(): ReactElement {
  const dispatch=useAppDispatch()
  useEffect(()=>{
    dispatch(setPage("dashboard"))
  },[dispatch])



  return (
    <>
    
      <ToastContainer />
    </>
  );
}
