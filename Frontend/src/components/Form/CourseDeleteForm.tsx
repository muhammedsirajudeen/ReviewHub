import { ReactElement, Ref } from 'react';

export default function CourseDeleteForm({deletedialogRef,closeDeleteHandler}:{deletedialogRef:Ref<HTMLDialogElement>,closeDeleteHandler:VoidFunction}): ReactElement {
    return (
        <dialog
            ref={deletedialogRef}
            className="flex items-center justify-center flex-col w-96 p-2"
        >
            <button
                onClick={closeDeleteHandler}
                className="bg-black text-white"
            >
                x
            </button>
            delete
        </dialog>
    );
}
