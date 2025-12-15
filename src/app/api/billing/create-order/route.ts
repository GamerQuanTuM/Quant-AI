import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";
import { protect } from "@/middleware/protect";

let razorpayInstance: Razorpay | null = null;

const getRazorpay = () => {
    if (!razorpayInstance) {
        razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });
    }
    return razorpayInstance;
};

const createOrder = async (req: Request, userId: string) => {
    try {
        const body = await req.json();
        const { credits } = body;

        if (!credits || credits <= 0) {
            return NextResponse.json({ error: "Invalid credits amount" }, { status: 400 });
        }

        const pricingTiers: Record<number, number> = {
            500: 499,
            2500: 1999,
            7000: 4999
        };

        const amountInINR = pricingTiers[credits] || credits;
        const amountInPaise = amountInINR * 100;

        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: `receipt_${Date.now()}_${userId.slice(-5)}`,
        };

        const order = await getRazorpay().orders.create(options);

        await prisma.transaction.create({
            data: {
                userId,
                amount: credits,
                price: amountInINR,
                currency: "INR",
                status: "PENDING",
                razorpayOrderId: order.id,
            }
        });

        return NextResponse.json({
            orderId: order.id,
            amount: amountInINR,
            currency: "INR",
            keyId: process.env.RAZORPAY_KEY_ID
        }, { status: 200 });

    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}

export const POST = protect(createOrder);
