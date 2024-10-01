import { ReactElement, Ref } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../helper/axiosInstance';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addWithdrawal, setPaymentMethod } from '../../store/globalSlice';
import { toast } from 'react-toastify';
import { paymentMethodprops } from '../../types/userProps';

interface WithdrawalFormInputs {
  amount: string;
  bankAccount: string;
  ifsc: string;
  holderName: string;
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
    setValue,
    formState: { errors },
    reset,
  } = useForm<WithdrawalFormInputs>();
  const dispatch = useAppDispatch();
  const user=useAppSelector((state)=>state.global.user)
  console.log(user)
  const onSubmit = async (data: WithdrawalFormInputs) => {
    console.log('Withdrawal details:', data);
    try {
      const response = (
        await axiosInstance.post('/user/withdrawal', {
          amount: data.amount,
          bankaccount: data.bankAccount,
          ifsc: data.ifsc,
          holdername: data.holderName,
        })
      ).data;

      if (response.message === 'success') {
        dispatch(addWithdrawal({
          amount: parseInt(data.amount),
          paymentDate: new Date().toString(),
          type: 'withdrawal processing',
          status: false,
        }));
        toast.success("Withdrawal request succeeded");
        dispatch(setPaymentMethod(
          {
            bankaccount:data.bankAccount,
            ifsc:data.ifsc,
            holdername:data.holderName
          }
        ))
        reset(); // Clear the form after submission
        closeHandler();
      }
    } catch (error) {
      console.log(error);
      toast.error("Withdrawal request exceeded");
    }

  };
  const handlePaymentMethod=(paymentMethod:paymentMethodprops)=>{
    console.log(paymentMethod)
    setValue("bankAccount",paymentMethod.bankaccount)
    setValue("holderName",paymentMethod.holdername)
    setValue("ifsc",paymentMethod.ifsc)
  }
  return (
    <dialog style={{ height: "60vh", width: "40vw" }} className='relative h-96 w-96 rounded-lg p-6 bg-white shadow-lg' ref={dialogRef}>
      <h1 className='w-full text-center mt-4 text-xl font-semibold text-gray-800'>Withdrawal</h1>
      <button className='absolute top-2 right-2 text-lg' onClick={closeHandler}>
        ✕
      </button>
      {
        
        user &&  user.paymentMethod.map((paymentMethod)=>{
          return(
            <div
            className='flex items-start mt-10 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200 p-4 w-full cursor-pointer'
            onClick={() => handlePaymentMethod(paymentMethod)}
          >
            <input
              type='radio'
              name='paymentMethod'
              className='mr-3 h-5 w-5 accent-blue-500'
              onChange={() => handlePaymentMethod(paymentMethod)}
            />
            <div className='flex flex-col'>
              <div className='text-lg font-semibold text-gray-800'>{paymentMethod.holdername}</div>
              <div className='text-sm text-gray-600'>{paymentMethod.ifsc}</div>
              <div className='text-sm text-gray-600'>{paymentMethod.bankaccount}</div>
            </div>
          </div>
          )
        })
      }

      <form onSubmit={handleSubmit(onSubmit)} className='mt-6 flex flex-col items-center'>
        <label htmlFor='amount' className='text-lg font-medium mb-2'>
          Enter Amount
        </label>
        <input
          id='amount'
          type='number'
          step='any'
          placeholder='enter amount'
          className='border border-gray-300 p-2 rounded-lg text-center w-1/4'
          {...register('amount', {
            required: 'Amount is required',
            min: { value: 100, message: 'Amount must be at least 100' },
            validate: {
              noSpaces: (value) => value.trim().length > 0 || 'Amount cannot be empty or only spaces',
            },
          })}
        />
        {errors.amount && <p className='text-red-500 text-sm mt-1'>{errors.amount.message}</p>}

        <label htmlFor='bankAccount' className='text-lg font-medium mb-2 mt-4'>
          Bank Account Number
        </label>
        <input
          id='bankAccount'
          type='number'
          className='border border-gray-300 p-2 rounded-lg w-3/4 text-center'
          placeholder='enter the bank account'
          {...register('bankAccount', {
            required: 'Bank account number is required',
            pattern: { value: /^[0-9]+$/, message: 'Account number must be numeric' },
          })}
        />
        {errors.bankAccount && <p className='text-red-500 text-sm mt-1'>{errors.bankAccount.message}</p>}

        <label htmlFor='ifsc' className='text-lg font-medium mb-2 mt-4'>
          IFSC Code
        </label>
        <input
          id='ifsc'
          type='text'
          placeholder='enter the ifsc code'
          className='border border-gray-300 p-2 rounded-lg w-3/4 text-center'
          {...register('ifsc', {
            required: 'IFSC code is required',
            pattern: { value: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: 'Invalid IFSC code format' },
          })}
        />
        {errors.ifsc && <p className='text-red-500 text-sm mt-1'>{errors.ifsc.message}</p>}

        <label htmlFor='holderName' className='text-lg font-medium mb-2 mt-4'>
          Account Holder Name
        </label>
        <input
          id='holderName'
          type='text'
          placeholder='enter the account holders name'
          className='border border-gray-300 p-2 rounded-lg w-3/4 text-center'
          {...register('holderName', {
            required: 'Holder name is required',
            minLength: { value: 3, message: 'Name must be at least 3 characters long' },
            validate: (name: string) => {
              if (name.trim() === '') return 'Name cannot be empty';
              const hasSpecialChars = /[^A-Za-z0-9 ]/.test(name);
              if (hasSpecialChars) return 'Name cannot contain special characters';
              return true;
            }
          })}
        />
        {errors.holderName && <p className='text-red-500 text-sm mt-1'>{errors.holderName.message}</p>}

        <button
          type='submit'
          className='mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg'
        >
          Withdraw
        </button>
      </form>
    </dialog>
  );
}
