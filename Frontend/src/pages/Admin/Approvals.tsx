import { ReactElement, useEffect, useRef, useState } from 'react';
import userProps, { approvalProps } from '../../types/userProps';
import axiosInstance from '../../helper/axiosInstance';
import ResumeDialog from '../../components/Dialog/ResumeDialog';
import { flushSync } from 'react-dom';
import { useAppDispatch } from '../../store/hooks';
import { setPage } from '../../store/globalSlice';
import { toast, ToastContainer } from 'react-toastify';
import PaginationComponent from '../../components/pagination/PaginationComponent';
import { produce } from 'immer';

export interface ExtendedApprovalProps extends Omit<approvalProps, 'userId'> {
  userId: userProps;
}

export default function Approvals(): ReactElement {
  const [approvals, setApprovals] = useState<Array<ExtendedApprovalProps>>([]);
  //this is the active approval
  const [approval, setApproval] = useState<ExtendedApprovalProps>();
  const [open, setOpen] = useState<boolean>(false);
  const [currentpage, setCurrentpage] = useState<number>(1);
  const [pagecount, setPagecount] = useState<number>(0);
  const dispatch = useAppDispatch();
  const resumeDialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    dispatch(setPage('users'));
    async function dataWrapper() {
      try {
        const response = (
          await axiosInstance.get(
            `/admin/reviewer/approvals?page=${currentpage}`
          )
        ).data;
        if (response.message === 'success') {
          setApprovals(response.approvals);
          setPagecount(response.pageLength);
        }
      } catch (error) {
        console.log(error);
      }
    }
    dataWrapper();
  }, [dispatch, currentpage]);
  const resumeHandler = (approval: ExtendedApprovalProps) => {
    setApproval(approval);
    flushSync(() => {
      setOpen(true);
    });
    resumeDialogRef.current?.showModal();
  };
  const closeHandler = () => {
    resumeDialogRef.current?.close();
    setOpen(false);
  };
  const approveHandler = async (approvalId: string) => {
    console.log(approvalId);
    try {
      const response = (
        await axiosInstance.put(`/admin/reviewer/approve/${approvalId}`)

      ).data;
      console.log(response);
      if (response.message === 'success') {
        toast.success('success');
        setApprovals(produce((draft)=>{
          draft.forEach((d)=>{
            if(d._id===approvalId){
              d.approvalStatus=!d.approvalStatus
            }
          })
        }))
        // setTimeout(() => window.location.reload(), 1000);
      } else {
        toast(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const pageHandler = (count: number) => {
    const page = Math.ceil(count / 10) + 1;
    const array = [];
    for (let i = 0; i < page; i++) {
      array.push(i + 1);
    }
    return array;
  };
  const previouspageHandler = () => {
    const prev = currentpage - 1;
    if (prev <= 0) {
      setCurrentpage(1);
      return;
    }
    setCurrentpage(prev);
  };
  const nextpageHandler = () => {
    const next = currentpage + 1;
    if (next > Math.ceil(pagecount / 10) + 1) {
      setCurrentpage(Math.ceil(pagecount / 10) + 1);
      return;
    }
    setCurrentpage(next);
  };
  return (
    <div className="flex flex-col items-center justify-start px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Approval Requests</h1>
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-4 text-left font-semibold text-gray-700">
                  Email
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">
                  Domain
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">
                  Experience (years)
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {approvals.map((approval, index) => (
                <tr
                  key={approval._id}
                  className={`border-t ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <td className="py-4 px-4">{approval.userId.email}</td>
                  <td className="py-4 px-4">{approval.domain}</td>
                  <td className="py-4 px-4">{approval.experience}</td>
                  <td className="py-4 px-4 flex space-x-2">
                    <button
                      onClick={() => resumeHandler(approval)}
                      className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition"
                    >
                      Resume
                    </button>
                    <button
                      onClick={() => approveHandler(approval._id)}
                      className={`${
                        approval.approvalStatus ? 'bg-red-500' : 'bg-green-500'
                      } text-white py-1 px-3 rounded hover:bg-green-700 transition`}
                    >
                      {approval.approvalStatus ? 'Unapprove' : 'Approve'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationComponent
          previouspageHandler={previouspageHandler}
          nextpageHandler={nextpageHandler}
          pageHandler={pageHandler}
          pagecount={pagecount}
          currentpage={currentpage}
        />
      </div>
      {open && (
        <ResumeDialog
          approval={approval}
          dialogRef={resumeDialogRef}
          closeHandler={closeHandler}
        />
      )}
      <ToastContainer
        style={{
          backgroundColor: 'gray',
          color: 'white',
          borderRadius: '10px',
        }}
      />
    </div>
  );
}
