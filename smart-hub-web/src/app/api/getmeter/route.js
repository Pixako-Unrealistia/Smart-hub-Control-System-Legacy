import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import Meter from '../../../../models/meter';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const ownerId = searchParams.get('ownerId');

        await connectMongoDB();

        const meters = await Meter.find({ owner: ownerId });

        return NextResponse.json({ meters }, { status: 200 });
    } catch (error) {
        console.error('Error fetching meters:', error);
        return NextResponse.json({ message: "An error occurred while fetching meters." }, { status: 500 });
    }
}
