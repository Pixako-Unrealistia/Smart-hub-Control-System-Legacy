"use client";

import { useState } from 'react';

export default function MeterForm({ onAddMeter }) {
    const [meterId, setMeterId] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onAddMeter(meterId);
        setMeterId('');
    };

    return (
        <form onSubmit={handleSubmit} className="mt-5">
            <input
                type="text"
                placeholder="Meter ID"
                value={meterId}
                onChange={(e) => setMeterId(e.target.value)}
                className="p-2 border rounded"
            />
            <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">
                Add Meter
            </button>
        </form>
    );
}
