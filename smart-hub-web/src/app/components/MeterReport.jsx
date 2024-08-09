import React from 'react';

const MeterReport = ({ meters, onDeleteMeter }) => {
  return (
    <div className="mt-5">
      <h3 className="text-3xl">Meter Report</h3>
      <div className='mt-5 grid grid-cols-1 md:grid-cols-3 gap-4'>
      {meters.map((meter) => (
        <div key={meter.meterId} className="relative p-4 border rounded shadow-md mt-5">
          <h4 className="text-xl">Meter ID: {meter.meterId}</h4>
          <button
            onClick={() => onDeleteMeter(meter.meterId)}
            className=" top-2 right-2 bg-red-500 text-white p-2 rounded"
          >
            Delete
          </button>
        </div>
      ))}
      </div>
    </div>
  );
};

export default MeterReport;
