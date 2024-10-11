import { ReactElement, Ref, useEffect, useRef, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axiosInstance from '../../helper/axiosInstance';
import { domainProps } from '../../types/courseProps';
import { toast, ToastContainer } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { flushSync } from 'react-dom';
import EditDomainDialog from './EditDomainDialog';

export interface FormValues {
  domainName: string;
  innerdomainName: string;
}

export default function DomainDialog({
  dialogRef,
  closeHandler,
}: {
  dialogRef: Ref<HTMLDialogElement>;
  closeHandler: VoidFunction;
}): ReactElement {
  const [domains, setDomains] = useState<Array<domainProps>>([]);
  const [confirm, setConfirm] = useState<boolean>(false);
  const deleteRef = useRef<HTMLDialogElement>(null);
  const [domain, setDomain] = useState<string>();
  const [edit, setEdit] = useState<boolean>(false);
  const editRef = useRef<HTMLDialogElement>(null);
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  // Fetching domains
  useEffect(() => {
    async function dataFetcher() {
      try {
        const response = (await axiosInstance.get('/admin/domain')).data;
        if (response.message === 'success') {
          setDomains(response.domain);
        }
      } catch (error) {
        console.log(error);
      }
    }
    dataFetcher();
  }, []);

  // On submit handler
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await axiosInstance.post('/admin/domain', {
        domain: data.domainName,
      });
      if (response.data.message === 'success') {
        setDomains((prevDomains) => [
          ...prevDomains,
          { domain: data.domainName },
        ]);
        toast.success('addition successful');
        reset(); // Reset the form after successful submission
      }
    } catch (error) {
      console.log(error);
      toast.error('please try again');
    }
  };
  const handleEdit = (domain: string) => {
    console.log(domain);
    flushSync(() => {
      setDomain(domain);
      setEdit(true);
    });
    editRef.current?.showModal();
  };
  const handleDelete = async (domain: string) => {
    // console.log(domain)
    flushSync(() => {
      setConfirm(true);
      setDomain(domain);
    });
    deleteRef.current?.showModal();
  };
  const deleteHandler = async () => {
    try {
      const response = (await axiosInstance.delete(`/admin/domain/${domain}`))
        .data;
      if (response.message === 'success') {
        setDomains((prev) => prev.filter((pr) => pr.domain !== domain));
        toast.success('deleted successfully');
        setConfirm(false);
        deleteRef.current?.close();
      }
    } catch (error) {
      console.log(error);
      toast.error('please try again');
    }
  };

  return (
    <dialog
      style={{ height: '90vh', width: '50vw', padding: '20px' }}
      className="rounded-xl shadow-lg"
      ref={dialogRef}
    >
      <button
        className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-1 h-4 flex items-center justify-center text-xs"
        onClick={closeHandler}
      >
        x
      </button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center space-y-4"
      >
        <div className="w-full">
          <label htmlFor="domainName" className="block text-lg mb-2">
            Domain Name:
          </label>
          <input
            id="domainName"
            {...register('domainName', {
              required: 'Domain name is required',
              pattern: {
                value: /^[a-zA-Z 0-9-]+$/,
                message:
                  'Domain name cannot contain spaces or special characters',
              },
            })}
            className={`border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.domainName ? 'border-red-500' : ''
            }`}
            placeholder="Enter domain name"
          />
          {errors.domainName && (
            <p className="text-red-600 mt-1">{errors.domainName.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out"
        >
          Submit
        </button>
      </form>

      <div className="mt-6 grid grid-cols-1 ">
        {domains.map((domain, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-gray-100 p-4 mt-4 rounded-lg shadow-md"
          >
            <div className="flex items-center space-x-3">
              {/* Placeholder for domain logo */}
              <img
                src={`https://www.google.com/s2/favicons?domain=${domain.domain}`}
                alt="logo"
                className="w-8 h-8 rounded"
              />
              <p className="text-center font-semibold">{domain.domain}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(domain.domain)}
                className="text-blue-500 hover:text-blue-600 flex items-center space-x-1 p-2 rounded-lg transition duration-300 ease-in-out"
              >
                <FaEdit />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(domain.domain)}
                className="text-red-500 hover:text-red-600 flex items-center space-x-1 p-2 rounded-lg transition duration-300 ease-in-out"
              >
                <FaTrash />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer
        style={{
          backgroundColor: 'gray',
          color: 'white',
          borderRadius: '10px',
        }}
      />
      {confirm && (
        <dialog
          ref={deleteRef}
          className="flex flex-col justify-center items-center p-6 rounded-lg shadow-lg bg-white"
        >
          <p className="text-lg mb-4 text-center">
            Are you sure you want to delete{' '}
            <span className="font-semibold">{domain}</span>?
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                deleteRef.current?.close();
                setConfirm(false);
              }}
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded transition duration-200 ease-in-out"
            >
              Cancel
            </button>
            <button
              onClick={deleteHandler}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center space-x-1 transition duration-200 ease-in-out"
            >
              <FaTrash />
              <span>Delete</span>
            </button>
          </div>
        </dialog>
      )}
      {edit && (
        <EditDomainDialog
          setDomains={setDomains}
          domain={domain as string}
          editRef={editRef}
          setEdit={setEdit}
        />
      )}
    </dialog>
  );
}
