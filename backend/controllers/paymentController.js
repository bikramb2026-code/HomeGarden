import Razorpay from "razorpay";
import crypto from "crypto";

// Check if keys are available
const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

let razorpay = null;
if (key_id && key_secret) {
  razorpay = new Razorpay({
    key_id: key_id,
    key_secret: key_secret,
  });
  console.log("✅ Razorpay initialized successfully");
} else {
  console.warn("⚠️ Razorpay not initialized (COD only mode)");
}

// POST /api/payment/create-order
export const createOrder = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        error: "Online payment is temporarily unavailable. Please use Cash on Delivery."
      });
    }

    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: "Valid amount is required",
      });
    }

    console.log("Creating Razorpay order for amount:", amount);

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log("✅ Razorpay order created:", order.id);

    res.json({
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error("❌ Razorpay order creation error:", error);
    res.status(500).json({
      error: error.message || "Failed to create payment order",
    });
  }
};

// POST /api/payment/verify
export const verifyPayment = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        error: "Online payment verification unavailable. Please use Cash on Delivery."
      });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = req.body;

    // Validate required fields
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderData
    ) {
      return res.status(400).json({
        error: "Missing required payment information",
      });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        error: "Invalid payment signature",
      });
    }

    console.log("✅ Payment verified for order:", razorpay_order_id);

    // Return success with payment details - order will be saved by order controller
    res.json({
      success: true,
      paymentDetails: {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      }
    });
  } catch (error) {
    console.error("❌ Payment verification error:", error);
    res.status(500).json({
      error: error.message || "Payment verification failed",
    });
  }
};