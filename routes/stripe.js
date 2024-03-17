const express = require('express')
const router = express.Router()

const { stripePayment, success, cancel } = require('../controllers/stripe')

router.route('/').post(stripePayment)
router.route('/success').get(success)
router.route('/cancel').get(cancel)

module.exports = router