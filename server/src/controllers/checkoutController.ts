import { Request, Response } from "express";
import Stripe from "stripe";
import stripe from "../scripts/stripe.js";
import pool from "../database/database.js";

export async function createCheckoutSession(req: Request, res: Response) {
    try {
        const origin = `${req.protocol}://${req.get("host")}`;

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [
                { price: process.env.STRIPE_PRICE_ID as string, quantity: 1 },
            ],
            success_url: `${origin}/plans?checkout=success`,
            cancel_url: `${origin}/plans?checkout=cancelled`,
            client_reference_id: String(req.session.userId),
            metadata: { userId: String(req.session.userId) },
        });

        if (!session.url) {
            return res.status(500).json({ success: false, message: "Could not start checkout." });
        }

        return res.status(200).json({ success: true, data: { url: session.url } });
    } catch (error) {
        console.error("Create checkout session error:", error);
        return res.status(500).json({ success: false, message: "Server Error, please try again later..." });
    }
}

export async function stripeWebhook(req: Request, res: Response) {
    const signature = req.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature as string,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
    } catch (error) {
        console.error("Webhook signature verification failed:", error);
        return res.status(400).send(`Webhook Error: ${(error as Error).message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId) {
            try {
                await pool.query(`UPDATE users SET plan = 'pro' WHERE id = $1`, [userId]);
            } catch (error) {
                console.error("Failed to upgrade user after payment:", error);
                return res.status(500).send("Database update failed");
            }
        }
    }

    return res.status(200).json({ received: true });
}