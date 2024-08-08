// "use client"

// import Image from "next/image";
// import Container from "../components/Container";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import NextLogo from '../../../public/next.svg'
// import { useSession } from "next-auth/react";
// import { redirect } from "next/navigation";

// export default function Home() {

//     const { data: session } = useSession();
//     if (!session) redirect("/login");
//     console.log(session)

//   return (
//     <main>
//       <Container>
//         <Navbar session={session} />
//           <div className="flex-grow text-center p-10">
//             <h3 className="text-5xl">Welcome, {session?.user?.name}</h3>
//             <p className="text-2xl mt-3">Your email address: {session?.user?.email}</p>
//             <p className="text-2xl mt-3">Your user role: {session?.user?.role}</p>
//           </div>
//         <Footer />
//       </Container>
//     </main>
    
//   );
// }


"use client"

import { useState, useEffect } from 'react';
import Image from "next/image";
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NextLogo from '../../../public/next.svg'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
    const { data: session, status } = useSession();
    const [meterId, setMeterId] = useState('');
    const [message, setMessage] = useState('');
    const [meters, setMeters] = useState([]);
    const router = useRouter();

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

    const handleAddMeter = async (e) => {
        e.preventDefault();

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

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <main>
            <Container>
                <Navbar session={session} />
                <div className="flex-grow text-center p-10">
                    <h3 className="text-5xl">Welcome, {session?.user?.name}</h3>
                    <p className="text-2xl mt-3">Your email address: {session?.user?.email}</p>
                    <p className="text-2xl mt-3">Your user role: {session?.user?.role}</p>
                    
                    <form onSubmit={handleAddMeter} className="mt-5">
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
                    {message && <p className="mt-3">{message}</p>}
                    
                    <div className="mt-5">
                        <h3 className="text-3xl">Your Meters</h3>
                        {meters.length === 0 ? (
                            <p className="text-xl">You have no meters.</p>
                        ) : (
                            <ul>
                                {meters.map((meter) => (
                                    <li key={meter.meterId} className="text-xl mt-2">
                                        {meter.meterId}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <Footer />
            </Container>
        </main>
    );
}
