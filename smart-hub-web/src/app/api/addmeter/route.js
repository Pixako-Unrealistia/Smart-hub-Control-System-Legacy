import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import Meter from '../../../../models/meter';
import User from '../../../../models/user';

export async function POST(req) {
    try {
        const { meterId, ownerId } = await req.json();

        await connectMongoDB();

        const owner = await User.findById(ownerId);

        if (!owner) {
            return NextResponse.json({ message: "Owner not found." }, { status: 404 });
        }

        await Meter.create({ meterId, owner: owner._id });

        return NextResponse.json({ message: "Meter registered." }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "An error occurred while registering the meter." }, { status: 500 });
    }
}
