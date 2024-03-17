const stripe = require('stripe')(process.env.STRIPE_KEY)
const { StatusCodes } = require('http-status-codes')
const items = require('../items')

const stripePayment = async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        line_items: items.map(item => {
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        images: ['https://picsum.photos/200']
                    },
                    unit_amount: item.price
                },
                quantity: item.quantity
            }
        }),
        mode: 'payment',
        success_url: `${process.env.DOMAIN}/stripe/success`,
        cancel_url: `${process.env.DOMAIN}/stripe/cancel`
    })

    res.status(StatusCodes.SEE_OTHER).json({ redirect_link: session.url })
}

const endpointSecret = process.env.WEBHOOK_SECRET
const webhook = (request, response) => {
    let event = request.body;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
        // Get the signature sent by Stripe
        const signature = request.headers['stripe-signature'];
        try {
            event = stripe.webhooks.constructEvent(
                request.body,
                signature,
                endpointSecret
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`, err.message);
            return response.sendStatus(400);
        }
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
            // Then define and call a method to handle the successful payment intent.
            // handlePaymentIntentSucceeded(paymentIntent);
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            // Then define and call a method to handle the successful attachment of a PaymentMethod.
            // handlePaymentMethodAttached(paymentMethod);
            break;
        default:
            // Unexpected event type
            console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
}

const success = async (req, res) => {
    res.send('success payment')
}

const cancel = async (req, res) => {
    res.send('cancelled payment')
}

module.exports = {
    stripePayment,
    success,
    cancel,
    webhook
}