import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import Meter from '../../../../models/meter';
import User from '../../../../models/user';

export async function POST(req) {
    try {
        const { meterId, ownerId } = await req.json();

        // Connect to MongoDB
        await connectMongoDB();

        // Check if the owner exists
        const owner = await User.findById(ownerId);
        if (!owner) {
            return NextResponse.json({ message: "Owner not found." }, { status: 404 });
        }

        // Check if the meter already exists for the user
        const existingMeter = await Meter.findOne({ meterId, owner: owner._id });
        if (existingMeter) {
            return NextResponse.json({ message: "Meter already exists for this owner." }, { status: 400 });
        }

        // Create and save the new meter
        const newMeter = new Meter({ meterId, owner: owner._id });
        await newMeter.save();

        return NextResponse.json({ message: "Meter added successfully." }, { status: 201 });
    } catch (error) {
        console.error("Error adding meter:", error);
        return NextResponse.json({ message: "An error occurred while adding the meter." }, { status: 500 });
    }
}
