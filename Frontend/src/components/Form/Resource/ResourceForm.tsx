import { Fragment, ReactElement, Ref } from 'react';
import { contentProps, sectionProps } from '../../../types/courseProps';
import { useFieldArray, useForm } from 'react-hook-form';
import classNames from 'classnames'; // optional for conditional classes
import axios from 'axios';
import url from '../../../helper/backendUrl';
import { toast, ToastContainer } from 'react-toastify';

type Inputs = {
  sectionName: string;
  content: contentProps[];
};

export default function ResourceForm({
  dialogRef,
  closeHandler,
  section,
  sectionId,
}: {
  dialogRef: Ref<HTMLDialogElement>;
  closeHandler: VoidFunction;
  section: sectionProps | undefined;
  sectionId: string;
}): ReactElement {
  const SpecialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~1-9]/;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      sectionName: section?.sectionName || '',
      content: section?.content || [],
    },
  });

  const { fields } = useFieldArray({
    name: 'content',
    control,
  });

  const onSubmit = async (data: Inputs) => {
    console.log(data);
    const response = (
      await axios.put(`${url}/admin/resource/${sectionId}/${section?._id}`, data, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('token')}`,
        },
      })
    ).data;
    if (response.message === 'success') {
      toast('edited successfully');
      setTimeout(()=>window.location.reload(),1000)
    } else {
      toast(response.message);
    }
  };

  return (
    <>
      <dialog
        style={{ width: '50vw', height: '60vh' }}
        ref={dialogRef}
        className="flex flex-col p-8 bg-white shadow-lg rounded-lg"
      >
        <button
          className="self-end bg-gray-800 text-white p-2 rounded-full"
          onClick={closeHandler}
        >
          x
        </button>
        <form
          className="flex flex-col gap-6 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h2 className="text-xl font-semibold mb-4">Resource Form</h2>
          <label htmlFor="sectionName" className="text-sm font-medium">
            Section Name
          </label>
          <input
            id="sectionName"
            placeholder="Enter the Section Name"
            className={classNames(
              'h-10 border rounded-lg w-full px-4 placeholder-gray-500',
              {
                'border-red-500': errors.sectionName,
              }
            )}
            {...register('sectionName', {
              required: {
                value: true,
                message: 'Please enter the Section Name',
              },
              minLength: {
                value: 5,
                message: 'Please enter at least 5 characters',
              },
              validate: (value: string) => {
                if (value.trim() === '') return 'Please enter the Section Name';
                if (SpecialCharRegex.test(value))
                  return 'Please enter valid characters';
                return true;
              },
            })}
          />
          {errors.sectionName && (
            <span className="text-red-500 text-sm">
              {errors.sectionName.message}
            </span>
          )}
          {fields.map((field, index) => (
            <Fragment key={field.id}>
              <div className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor={`subheading-${field.id}`}
                    className="text-sm font-medium"
                  >
                    Subheading
                  </label>
                  <input
                    id={`subheading-${field.id}`}
                    placeholder="Enter the Subheading"
                    className={classNames(
                      'h-10 border rounded-lg w-full px-4 placeholder-gray-500',
                      {
                        'border-red-500': errors?.content?.[index]?.subheading,
                      }
                    )}
                    {...register(`content.${index}.subheading`, {
                      required: {
                        value: true,
                        message: 'Please enter the Subheading',
                      },
                      minLength: {
                        value: 5,
                        message: 'Please enter at least 5 characters',
                      },
                      validate: (value: string) => {
                        if (value.trim() === '')
                          return 'Please enter the Subheading';
                        return true;
                      },
                    })}
                  />
                  {errors?.content?.[index]?.subheading && (
                    <span className="text-red-500 text-sm">
                      {errors.content[index].subheading.message}
                    </span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor={`article-${field.id}`}
                    className="text-sm font-medium"
                  >
                    Article
                  </label>
                  <textarea
                    id={`article-${field.id}`}
                    placeholder="Enter the Article"
                    className={classNames(
                      'border rounded-lg w-full px-4 py-2 placeholder-gray-500',
                      {
                        'border-red-500': errors?.content?.[index]?.article,
                      }
                    )}
                    {...register(`content.${index}.article`, {
                      required: {
                        value: true,
                        message: 'Please enter the Article',
                      },
                      minLength: {
                        value: 5,
                        message: 'Please enter at least 5 characters',
                      },
                      validate: (value: string) => {
                        if (value.trim() === '')
                          return 'Please enter the Article';
                        return true;
                      },
                    })}
                  />
                  {errors?.content?.[index]?.article && (
                    <span className="text-red-500 text-sm">
                      {errors.content[index].article.message}
                    </span>
                  )}
                </div>
              </div>
            </Fragment>
          ))}
          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </dialog>
      <ToastContainer />
    </>
  );
}
