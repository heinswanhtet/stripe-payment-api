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

const success = async (req, res) => {
    res.send('success payment')
}

const cancel = async (req, res) => {
    res.send('cancelled payment')
}

module.exports = {
    stripePayment,
    success,
    cancel
}