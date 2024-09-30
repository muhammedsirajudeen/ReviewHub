import { ReactElement, Ref } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../helper/axiosInstance';
import { useAppDispatch } from '../../store/hooks';
import { addWithdrawal } from '../../store/globalSlice';
import { toast } from 'react-toastify';

interface WithdrawalFormInputs {
  amount: string;
}

export default function WithdrawalDialog({
  dialogRef,
  closeHandler,
}: {
  dialogRef: Ref<HTMLDialogElement>;
  closeHandler: VoidFunction;
}): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WithdrawalFormInputs>();
  const dispatch=useAppDispatch()
  const onSubmit =async  (data: WithdrawalFormInputs) => {
    // Handle withdrawal submission here (e.g., API call)
    console.log('Withdrawal amount:', data.amount);
    try {
      const response = (
        await axiosInstance.post('/user/withdrawal', { amount: data.amount })
      ).data;
      if (response.message === 'success') {
        console.log(response)
        dispatch(addWithdrawal(
                    {
            amount:parseInt(data.amount),
            paymentDate:new Date().toString(),
            type:'withdrawal processing',
            status:false

          }

        ))
        toast.success("withdrawal request succeeded")
        closeHandler()
      }
  } catch (error) {
    console.log(error);
    toast.error("Withdrawal Request Exceeded")
    }

    reset(); // Clear the form after submission
  };

  return (
    <dialog className='relative h-96 w-96 rounded-lg p-6 bg-white shadow-lg' ref={dialogRef}>
      <button className='absolute top-2 right-2 text-lg' onClick={closeHandler}>
        ✕
      </button>

      <h1 className='w-full text-center mt-4 text-xl font-semibold text-gray-800'>Withdrawal</h1>

      <form onSubmit={handleSubmit(onSubmit)} className='mt-6 flex flex-col items-center'>
        <label htmlFor='amount' className='text-lg font-medium mb-2'>
          Enter Amount
        </label>
        <input
          id='amount'
          type='number'
          step='any'
          className='border border-gray-300 p-2 rounded-lg w-64 text-center'
          {...register('amount', {
            required: 'Amount is required',
            min: { value: 100, message: 'Amount must be at least 100' },
            validate: {
              noSpaces: (value) =>
                value.trim().length > 0 || 'Amount cannot be empty or only spaces',
            },
          })}
        />
        {errors.amount && (
          <p className='text-red-500 text-sm mt-1'>{errors.amount.message}</p>
        )}

        <button
          type='submit'
          className='mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg'
        >
          Withdraw
        </button>
      </form>
    </dialog>
  );
}
