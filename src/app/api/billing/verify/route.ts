import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { protect } from "@/middleware/protect";

const verifyPayment = async (req: Request, userId: string) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            const transaction = await prisma.transaction.findFirst({
                where: { razorpayOrderId: razorpay_order_id }
            });

            if (!transaction) {
                return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
            }

            if (transaction.status === "COMPLETED") {
                return NextResponse.json({ message: "Payment already verified" }, { status: 200 });
            }

            await prisma.transaction.update({
                where: { id: transaction.id },
                data: {
                    status: "COMPLETED",
                    razorpayPaymentId: razorpay_payment_id,
                },
            });

            await prisma.user.update({
                where: { id: userId },
                data: {
                    credits: {
                        increment: transaction.amount
                    }
                }
            });

            return NextResponse.json({ success: true }, { status: 200 });
        } else {
            await prisma.transaction.updateMany({
                where: {
                    razorpayOrderId: razorpay_order_id,
                },
                data: {
                    status: "FAILED",
                },
            });
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json({ error: "Verification failed" }, { status: 500 });
    }
}

export const POST = protect(verifyPayment);
