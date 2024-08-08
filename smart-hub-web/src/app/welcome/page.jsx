"use client";
import React from 'react'
import Navbar from '../components/Navbar';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

function WelcomePage() {

    const { data: session } = useSession();
    console.log(session)

    if (!session) {
        redirect('/login')
    }


  return (
    <div>
        <Navbar session={session}/>
        <div className='container mx-auto6'>
            <h3 className='text-3xl my-3'>
               Welcome User  {session?.user?.name}
            </h3>
            <p>
                Email: {session?.user?.email}
            </p>
            <hr className='my-3' />
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>

    </div>
  )
}

export default WelcomePage