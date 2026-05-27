import Order from '../models/Order.js';

// Create new order (supports online payment and COD)
export const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      address,
      landmark,
      city,
      pincode,
      items,
      plantsTotal,
      deliveryCharge,
      totalAmount,
      paymentType, // 'full', 'advance', or 'cod'
      advancePaid,
      remainingAmount,
      distance,
      deliveryTime,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    } = req.body;

    // Validate required fields
    if (!customerName || !phone || !address || !city || !pincode) {
      return res.status(400).json({
        success: false,
        error: "Missing required customer information"
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No items in order"
      });
    }

    // Validate payment type
    if (!['advance', 'full', 'cod'].includes(paymentType)) {
      return res.status(400).json({
        success: false,
        error: "Invalid payment type"
      });
    }

    // Create order object
    const orderData = {
      customerName,
      phone,
      address,
      landmark: landmark || '',
      city,
      pincode,
      items,
      plantsTotal,
      deliveryCharge,
      totalAmount,
      paymentType,
      advancePaid: advancePaid || 0,
      remainingAmount: remainingAmount || totalAmount,
      distance: distance || null,
      deliveryTime: deliveryTime || null,
      orderStatus: 'confirmed',
    };

    // Handle payment-specific fields
    if (paymentType === 'cod') {
      orderData.paymentStatus = 'pending';
      orderData.razorpayOrderId = null;
      orderData.razorpayPaymentId = null;
      orderData.razorpaySignature = null;
    } else {
      // Online payment validation
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return res.status(400).json({
          success: false,
          error: "Missing payment information for online payment"
        });
      }
      orderData.paymentStatus = 'paid';
      orderData.razorpayOrderId = razorpayOrderId;
      orderData.razorpayPaymentId = razorpayPaymentId;
      orderData.razorpaySignature = razorpaySignature;
    }

    const newOrder = new Order(orderData);
    await newOrder.save();

    console.log(`✅ ${paymentType.toUpperCase()} Order saved:`, newOrder._id);

    res.status(201).json({
      success: true,
      order: {
        _id: newOrder._id,
        totalAmount: newOrder.totalAmount,
        paymentType: newOrder.paymentType,
        paymentStatus: newOrder.paymentStatus,
        orderStatus: newOrder.orderStatus
      }
    });

  } catch (error) {
    console.error("❌ Order creation error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create order"
    });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found"
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch order"
    });
  }
};

// Get orders by phone number
export const getOrdersByPhone = async (req, res) => {
  try {
    const orders = await Order.find({ phone: req.params.phone })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch orders"
    });
  }
};

// Update order status (for admin panel)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found"
      });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    // If order is delivered and payment was COD, mark as paid
    if (orderStatus === 'delivered' && order.paymentType === 'cod') {
      order.paymentStatus = 'paid';
    }

    await order.save();

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update order status"
    });
  }
};