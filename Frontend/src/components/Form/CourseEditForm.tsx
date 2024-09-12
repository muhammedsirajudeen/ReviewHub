import { ReactElement, Ref } from 'react';

export default function CourseEditForm({editdialogRef,closeEditHandler}:{editdialogRef:Ref<HTMLDialogElement>,closeEditHandler:VoidFunction}): ReactElement {
    return (
        <dialog
            ref={editdialogRef}
            className="flex items-center justify-center flex-col w-96 p-2"
        >
            <button onClick={closeEditHandler} className="bg-black text-white">
                x
            </button>
            edit
        </dialog>
    );
}
