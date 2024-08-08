"use client"

import React from 'react';
import Link from 'next/link';
import NextLogo from '../../../public/next.svg';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

function Navbar({ session, isSidebarVisible, toggleSidebar }) {
  return (
    <nav className={`flex justify-between items-center shadow-md p-5 bg-white ${!isSidebarVisible ? 'fixed top-0 left-0 w-full z-50' : ''}`}>
        <div className="flex items-center">
            {session && !isSidebarVisible && (
                <button onClick={toggleSidebar} className="bg-gray-700 p-2 rounded-md mr-4 text-white">
                    Open
                </button>
            )}
            <Link href="/">
                <Image src={NextLogo} width={100} height={100} alt='nextjs logo' />
            </Link>
        </div>
        <ul className='flex space-x-4'>
            {!session ? (
                <>
                    <li><Link href="/login">Login</Link></li>
                    <li><Link href="/register">Register</Link></li>
                </>
            ) : (
                <>
                    <li className='flex'>
                        <button onClick={() => signOut()} className='bg-red-500 text-white border py-2 px-3 rounded-md text-lg my-2'>
                            Logout
                        </button>
                    </li>
                </>
            )}
        </ul>
    </nav>
  )
}

export default Navbar;
