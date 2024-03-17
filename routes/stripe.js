const express = require('express')
const router = express.Router()

const { stripePayment, success, cancel, webhook } = require('../controllers/stripe')

router.route('/').post(stripePayment)
router.route('/success').get(success)
router.route('/cancel').get(cancel)
router.route('/webhook').post(express.raw({ type: 'application/json' }), webhook)

module.exports = router