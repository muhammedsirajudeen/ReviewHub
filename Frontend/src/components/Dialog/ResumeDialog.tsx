import { ReactElement, Ref } from 'react';
import { ExtendedApprovalProps } from '../../pages/Admin/Approvals';
import url from '../../helper/backendUrl';

export default function ResumeDialog({
  dialogRef,
  closeHandler,
  approval,
}: {
  dialogRef: Ref<HTMLDialogElement>;
  closeHandler: VoidFunction;
  approval: ExtendedApprovalProps | undefined;
}): ReactElement {
  return (
    <dialog
      style={{ height: '80vh', width: '60vw', borderRadius: '8px' }}
      className="flex flex-col items-center justify-center p-4 shadow-lg"
      ref={dialogRef}
    >
      <button
        onClick={closeHandler}
        className="self-end p-2 bg-red-500 text-white rounded-full hover:bg-red-700 transition"
        aria-label="Close"
      >
        &times;
      </button>
      <h1 className="text-lg font-bold mb-2">Comments:</h1>
      <p className="text-gray-700 mb-4">{approval?.comment}</p>

      {approval?.resumeFile ? (
        <iframe
          src={`${url}/pdf/${approval.resumeFile}`}
          width="100%"
          height="100%"
          className="border rounded-lg shadow-md"
          style={{ flex: 1 }}
        >
          This browser does not support PDFs. Please download the PDF to view
          it:
          <a
            href={`${url}/pdf/${approval.resumeFile}`}
            className="text-blue-500 underline"
          >
            Download PDF
          </a>
        </iframe>
      ) : (
        <p className="text-red-500">No resume available.</p>
      )}
    </dialog>
  );
}
