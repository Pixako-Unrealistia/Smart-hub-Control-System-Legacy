// src/components/MeterReport.js

"use client";

export default function MeterReport({ count }) {
    return (
        <div className="p-4 bg-gray-200 rounded shadow-md mt-5">
            <h3 className="text-2xl">Meter Report</h3>
            <p className="text-xl mt-2">You have {count} meter{count !== 1 && 's'}.</p>
        </div>
    );
}
