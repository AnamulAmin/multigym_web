import React from 'react';
import { FaCross } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';

const Mmodal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white relative rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full">
        <div className="p-6">
          <div className=" flex justify-end">
          <button
              onClick={onClose}
              className=" transition absolute top-4 right-4  duration-300 "
            >
              <IoCloseOutline className='text-xl text-gray-400' />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Mmodal;
