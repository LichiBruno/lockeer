import * as React from "react";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <h2>Confirm Deletion</h2>
      <p>Are you sure you want to delete this account?</p>
      <button onClick={onConfirm}>Yes, delete</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default DeleteAccountModal;
