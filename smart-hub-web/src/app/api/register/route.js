import { NextResponse } from 'next/server'
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';
import bcrypt from 'bcrypt';

export async function POST(req) {
    try {
        const {name, email, password} = await req.json();
        const hashedPassword = await bcrypt.hash(password, 10);

        await connectMongoDB();
        await User.create({name, email, password: hashedPassword});

        // console.log("Name: ", name);
        // console.log("Email: ", email);
        // console.log("Password: ", password);

        return NextResponse.json({ message: "User registered successfully."}, { status: 201 });
    } catch(error) {
        return NextResponse.json({ message: "An error ovvured while registrating the user."}, { status: 500 });
    }  
}