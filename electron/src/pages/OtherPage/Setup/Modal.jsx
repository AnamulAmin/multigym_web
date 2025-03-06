import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed mx-2 inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full">
        <div className="p-6">
          {children}
          {/* <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              Close
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Modal;
