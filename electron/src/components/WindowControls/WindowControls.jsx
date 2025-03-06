import React, { useEffect, useState } from 'react';

const WindowControls = () => {
  const [windowState, setWindowState] = useState('normal');

  useEffect(() => {
    // Listen for window state changes from main process
    window.api.receive('window-state-change', (state) => {
      setWindowState(state);
    });
  }, []);

  const handleMinimize = () => {
    window.api.send('toMain', { action: 'minimize' });
  };

  const handleMaximize = () => {
    window.api.send('toMain', { action: 'maximize' });
  };

  const handleClose = () => {
    window.api.send('toMain', { action: 'close' });
  };

  return (
    <div className="flex items-center justify-end p-2 bg-gray-800 text-white">
      <button
        onClick={handleMinimize}
        className="px-4 py-2 hover:bg-gray-700 rounded"
      >
        ─
      </button>
      <button
        onClick={handleMaximize}
        className="px-4 py-2 hover:bg-gray-700 rounded"
      >
        {windowState === 'maximized' ? '❐' : '□'}
      </button>
      <button
        onClick={handleClose}
        className="px-4 py-2 hover:bg-red-600 rounded"
      >
        ✕
      </button>
    </div>
  );
};

export default WindowControls;
