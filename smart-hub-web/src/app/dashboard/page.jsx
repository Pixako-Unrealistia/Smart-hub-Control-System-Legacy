// src/app/Home.js

"use client";

import { useState, useEffect } from 'react';
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import MeterForm from "../components/MeterForm";
import MeterList from "../components/MeterList";
import MeterReport from "../components/MeterReport";
import LoadingScreen from "../components/LoadingScreen";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
    const { data: session, status } = useSession();
    const [meters, setMeters] = useState([]);
    const [message, setMessage] = useState('');
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [readings, setReadings] = useState({});
    const router = useRouter();
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        const fetchMeters = async () => {
            if (session?.user?.id) {
                const response = await fetch(`/api/getmeter?ownerId=${session.user.id}`);
                const data = await response.json();
                setMeters(data.meters);
            }
        };

        if (session?.user?.id) {
            fetchMeters();
        }
    }, [session]);

    const handleAddMeter = async (meterId) => {
        const response = await fetch('/api/addmeter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ meterId, ownerId: session.user.id }),
        });

        const data = await response.json();
        setMessage(data.message);

        // Update the meters list
        if (response.status === 201) {
            setMeters([...meters, { meterId, owner: session.user.id }]);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    useEffect(() => {
        if (meters.length > 0) {
            const interval = setInterval(async () => {
                for (const meter of meters) {
                    try {
                        const response = await fetch(`http://127.0.0.1:8000/meter/${meter.meterId}/read/${counter}`, {
                            method: 'GET',
                            headers: {
                                'accept': 'application/json',
                            },
                        });
                        if (!response.ok) {
                            throw new Error(`Error fetching meter ${meter.meterId}`);
                        }
                        const data = await response.json();
                        setReadings(prevReadings => ({
                            ...prevReadings,
                            [meter.meterId]: data["energy(kWh/hh)"],
                        }));
                    } catch (error) {
                        console.error('Failed to fetch meter data:', error);
                    }
                }
                setCounter(prevCounter => prevCounter + 1);
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [meters, counter]);

    if (status === 'loading') {
        return <LoadingScreen />;
    }

    return (
        <div>
            <Sidebar isVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />
            <div className={`flex flex-col ${isSidebarVisible ? 'ml-64' : 'ml-16'} transition-margin duration-300 ${!isSidebarVisible ? 'pt-20' : ''}`}>
                <Navbar session={session} isSidebarVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />
                <main className="flex-grow text-center p-10">
                    <Container>
                        <h3 className="text-5xl">Welcome, {session?.user?.name}</h3>
                        <p className="text-2xl mt-3">Your email address: {session?.user?.email}</p>
                        <p className="text-2xl mt-3">Your user role: {session?.user?.role}</p>

                        <MeterForm onAddMeter={handleAddMeter} />
                        {message && <p className="mt-3">{message}</p>}

                        <MeterReport count={meters.length} />
                        <MeterList meters={meters} />

                        <div className="mt-5">
                            <h3 className="text-3xl">Meter Readings</h3>
                            {meters.map((meter) => (
                                <div key={meter.meterId} className="p-4 border rounded shadow-md mt-5">
                                    <h4 className="text-xl">Meter ID: {meter.meterId}</h4>
                                    <p className="text-lg">Energy: {readings[meter.meterId] || 'Loading...'}</p>
                                </div>
                            ))}
                        </div>
                    </Container>
                </main>
                <Footer />
            </div>
        </div>
    );
}
