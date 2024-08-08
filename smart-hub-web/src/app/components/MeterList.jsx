// src/components/MeterList.js

"use client";

export default function MeterList({ meters }) {
    return (
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            {meters.length === 0 ? (
                <p className="text-xl">You have no meters.</p>
            ) : (
                meters.map((meter) => (
                    <div key={meter.meterId} className="p-4 border rounded shadow-md">
                        <h3 className="text-xl">Meter ID: {meter.meterId}</h3>
                    </div>
                ))
            )}
        </div>
    );
}
