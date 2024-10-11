import { ReactElement, Ref } from 'react';
import paymentProps from '../../types/paymentProps';
import url from '../../helper/backendUrl';

export default function PaymentDetailsDialog({
  dialogRef,
  closeHandler,
  payment,
}: {
  dialogRef: Ref<HTMLDialogElement>;
  closeHandler: VoidFunction;
  payment: paymentProps | undefined;
}): ReactElement {
  return (
    <dialog
      style={{ height: '40vh', width: '40vw' }}
      className="h-auto w-auto shadow-2xl rounded-lg p-8 flex flex-col justify-between items-center bg-white relative"
      ref={dialogRef}
    >
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-red-500 hover:text-red-700 focus:outline-none"
        onClick={closeHandler}
        title="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Payment Amount */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">{`Payment: $${
        payment?.amount || 'N/A'
      }`}</h2>

      {/* User Profile Image */}
      <img
        src={
          payment?.userId?.profileImage?.includes('http')
            ? payment?.userId.profileImage
            : payment?.userId.profileImage
            ? `${url}/profile/${payment?.userId.profileImage}`
            : '/user.png'
        }
        alt="User profile"
        className="h-24 w-24 rounded-full border-4 border-gray-300 object-cover transition-transform hover:scale-110 mb-4"
      />

      {/* User Email */}
      <p className="text-lg text-gray-600 mb-2">
        {payment?.userId.email || 'Email not available'}
      </p>

      {/* Payment Status */}
      <button
        className={`px-6 py-2 rounded-lg text-white font-medium mb-4 ${
          payment?.status
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        {payment?.status ? 'Success' : 'Failed'}
      </button>

      {/* Payment Type */}
      <p className="text-sm text-gray-500">{`Type: ${
        payment?.type || 'N/A'
      }`}</p>

      {/* Payment Date */}
      <p className="text-sm text-gray-500 mt-2">{`Date: ${
        new Date(payment?.paymentDate ?? '').toLocaleDateString() || 'N/A'
      }`}</p>
    </dialog>
  );
}
