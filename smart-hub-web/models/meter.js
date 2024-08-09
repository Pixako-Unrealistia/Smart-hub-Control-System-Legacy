import mongoose, { Schema } from "mongoose";

const meterSchema = new Schema(
    {
        meterId: {
            type: String,
            required: true,
            unique: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
);

const Meter = mongoose.models.Meter || mongoose.model("Meter", meterSchema);
export default Meter;
