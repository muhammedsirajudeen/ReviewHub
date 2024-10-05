import { ReactElement, useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setPage } from '../../store/globalSlice';
import DashboardTopbar from '../../components/DashboardTopbar';

export default function Notification(): ReactElement {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPage('notification'));
  }, [dispatch]);
  return (
    <>
      <DashboardTopbar />
      <h1 className="ml-36 text-3xl mt-10">NOTIFICATIONS</h1>
    </>
  );
}
