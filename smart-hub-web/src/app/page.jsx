"use client"
import Image from "next/image";
import Navbar from "./components/Navbar";
import { useSession } from "next-auth/react";


export default function Home() {
  const { data: session } = useSession();
  return (
    <main>
      <Navbar session={session}/>
      <div className='container mx-auto'>
        <h3>
          Welcome to home page
        </h3>
        <hr className='my-3'/>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>
    </main>
  );
}
