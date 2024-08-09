"use client"

import React from 'react';
import Link from 'next/link';
import NextLogo from '../../../public/next.svg';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import dockImg from '../../../public/docker.svg';
import menuImg from '../../../public/menu.svg';

function Navbar({ session, isSidebarVisible, toggleSidebar }) {
  return (
    <nav className={`flex justify-between items-center shadow-md p-5 bg-white ${!isSidebarVisible ? 'fixed top-0 left-0 w-full z-50' : ''}`}>
        <div className="flex items-center">
            {session && !isSidebarVisible && (
                <button onClick={toggleSidebar} className=" p-2 rounded-md mr-4 text-white">
                    <Image src={menuImg} alt="Menu" width={30} height={30} />
                </button>
            )}
            <Link href="/">
                <Image src={dockImg} alt="Smart Hub Logo" width={60} height={60} />
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
