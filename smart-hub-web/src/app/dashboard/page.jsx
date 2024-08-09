"use client";

import { useState, useEffect } from 'react';
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MeterForm from "../components/MeterForm";
import MeterReport from "../components/MeterReport";
import LoadingScreen from "../components/LoadingScreen";
import MeterReadOut from "../components/MeterReadOut"; // Import the new component
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

    const handleDeleteMeter = async (meterId) => {
        try {
            const response = await fetch('/api/deletemeter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ meterId, ownerId: session.user.id }),
            });
    
            const data = await response.json();
            setMessage(data.message);
    
            if (response.status === 200) {
                setMeters(meters.filter(meter => meter.meterId !== meterId));
            } else {
                console.error(`Failed to delete meter: ${data.message}`);
            }
        } catch (error) {
            console.error("Error deleting meter:", error);
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

                        <MeterReport meters={meters} onDeleteMeter={handleDeleteMeter} />
                        {/* <MeterList meters={meters} /> */}

                        {/* Use the new MeterReadOut component */}
                        <MeterReadOut meters={meters} readings={readings} />
                    </Container>
                </main>
            </div>
        </div>
    );
}
