import React, { forwardRef } from "react";

const ModalDialog = forwardRef(({ children }, ref) => {
  return (
    <dialog data-modal className="modal" ref={ref}>
      {children}
    </dialog>
  );
});

ModalDialog.displayName = "ModalDialog";

export default ModalDialog;
