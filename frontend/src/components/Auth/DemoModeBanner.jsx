import React, { useState } from 'react';
import Tooltip from '../UI/Tooltip';

const DemoModeBanner = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Tooltip content="Demo mode · Using offline data. Figures may not match live APIs.">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border border-[#E6A900]/35 bg-[#FFFBEB] text-[11px] font-medium text-[#8C6500] hover:bg-[#FEF3C7] transition-colors"
          aria-label="Demo data status"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#E6A900]" />
          DEMO DATA
        </button>
      </Tooltip>
      {open && (
        <p className="absolute right-0 top-full mt-2 w-56 z-40 rounded-xl border border-[#E6E4D7] bg-white px-3 py-2 text-[11px] text-[#6B6B47] shadow-sm sm:hidden">
          Demo mode · Offline data. May not reflect live API responses.
        </p>
      )}
    </div>
  );
};

export default DemoModeBanner;
