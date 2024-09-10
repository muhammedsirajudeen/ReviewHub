import { ReactElement,  } from "react";
import { ToastContainer } from "react-toastify";
// import { useLoaderData, useNavigate } from "react-router";


// import { useAppSelectuser
// import userProps from "../../types/userProps";
// import { ToastContainer } from "react-toastify";
// import { useAppDispatch } from "../../store/hooks";
// import { setPage } from "../../store/globalSlice";

export default function AdminDashboard(): ReactElement {

  // const data = useLoaderData() as userProps;
  // const navigate = useNavigate();
  // const dispatch=useAppDispatch() 
  // useEffect(() => {
  //   if (!data) {
  //     dispatch(setPage("dashboard"))
  //     navigate("/");
  //   }else{
  //     dispatch(setPage("dashboard"))

  //   }
  // }, [navigate,data,dispatch]);


  return (
    <>
    
      <ToastContainer />
    </>
  );
}
