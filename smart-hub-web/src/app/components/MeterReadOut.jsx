import React from 'react';

export default function MeterReadOut({ meters, readings }) {
    return (
        <div className="mt-5">
            <h3 className="text-3xl">Meter Readings</h3>
            {meters.map((meter) => (
                <div key={meter.meterId} className="p-4 border rounded shadow-md mt-5">
                    <h4 className="text-xl">Meter ID: {meter.meterId}</h4>
                    <p className="text-lg">Energy: {readings[meter.meterId] || 'N/A'} kWh/hh</p>
                </div>
            ))}
        </div>
    );
}
