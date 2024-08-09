import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import Meter from '../../../../models/meter';
import User from '../../../../models/user';

export async function POST(req) {
    try {
        const { meterId, ownerId } = await req.json();

        await connectMongoDB();

        // Ensure the owner exists
        const owner = await User.findById(ownerId);
        if (!owner) {
            return NextResponse.json({ message: "Owner not found." }, { status: 404 });
        }

        // Find and delete the meter
        const meter = await Meter.findOneAndDelete({ meterId, owner: owner._id });

        if (!meter) {
            return NextResponse.json({ message: "Meter not found." }, { status: 404 });
        }

        return NextResponse.json({ message: "Meter deleted successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error deleting meter:", error);
        return NextResponse.json({ message: "An error occurred while deleting the meter." }, { status: 500 });
    }
}
