import { Dispatch, ReactElement, RefObject, SetStateAction } from 'react';
import { FormValues } from './DomainDialog';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axiosInstance from '../../helper/axiosInstance';
import { domainProps } from '../../types/courseProps';
import { produce } from 'immer';

export default function EditDomainDialog({
  editRef,
  setEdit,
  domain,
  setDomains,
}: {
  editRef: RefObject<HTMLDialogElement>;
  setEdit: Dispatch<SetStateAction<boolean>>;
  setDomains: Dispatch<SetStateAction<Array<domainProps>>>;
  domain: string;
}): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      innerdomainName: domain,
    },
  });

  const EditHandler = async (domainData: FormValues) => {
    try {
      const response = (
        await axiosInstance.put(`/admin/domain/${domain}`, {
          domain: domainData.innerdomainName,
        })
      ).data;
      if (response.message === 'success') {
        setDomains(
          produce((domainhere) => {
            domainhere.map((d) => {
              if (d.domain === domain) {
                d.domain = domainData.innerdomainName;
              }
            });
          })
        );
        toast.success('edited');
        reset();
        editRef.current?.close();
        setEdit(false);
      }
    } catch (error) {
      console.log(error);
      toast.error('please try again');
    }
  };

  return (
    <dialog
      ref={editRef}
      className="rounded-lg p-8 max-w-md w-full shadow-lg bg-white transition-all transform scale-100"
      style={{
        border: 'none',
        padding: '20px',
      }}
    >
      <div className="flex justify-end">
        <button
          onClick={() => {
            editRef.current?.close();
            setEdit(false);
          }}
          className="text-gray-500 hover:text-gray-800 transition-colors"
        >
          ✕
        </button>
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Edit Domain Name
      </h2>

      <form
        onSubmit={handleSubmit(EditHandler)}
        className="flex flex-col space-y-4"
      >
        <div className="w-full">
          <label
            htmlFor="domainName"
            className="block text-lg font-medium text-gray-600 mb-2"
          >
            Domain Name:
          </label>
          <input
            id="domainName"
            {...register('innerdomainName', {
              required: 'Domain name is required',
              pattern: {
                value: /^[a-zA-Z 0-9-]+$/,
                message:
                  'Domain name cannot contain spaces or special characters',
              },
            })}
            className={`border p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.innerdomainName ? 'border-red-500' : ''
            }`}
            placeholder="Enter domain name"
            autoComplete="off"
          />
          {errors.innerdomainName && (
            <p className="text-red-600 text-sm mt-1">
              {errors.innerdomainName.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-300 ease-in-out shadow-md"
        >
          Save Changes
        </button>
      </form>
    </dialog>
  );
}
