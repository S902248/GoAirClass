import Axios from './Axios';

/**
 * Initiate a bus booking payment.
 * In production this should create a Razorpay order on the backend.
 * @param {Object} payload - { amount, busId, seats, boardingPoint, droppingPoint }
 * @returns {Object} - { orderId, amount, currency, ... }
 */
export const createPaymentOrder = async (payload) => {
    try {
        const response = await Axios.post('/payments/create-order', payload);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

/**
 * Verify payment after Razorpay callback.
 * @param {Object} payload - { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export const verifyPayment = async (payload) => {
    try {
        const response = await Axios.post('/payments/verify', payload);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};


/**
 * Load Razorpay SDK dynamically (no backend needed).
 * @returns {Promise<boolean>}
 */
export const loadRazorpayScript = () =>
    new Promise((resolve) => {
        if (document.getElementById('razorpay-script')) { resolve(true); return; }
        const script = document.createElement('script');
        script.id = 'razorpay-script';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

/**
 * Open Razorpay Checkout popup.
 * @param {Object} options - Razorpay options
 * @param {Function} onSuccess - Called with { razorpay_payment_id } on success
 * @param {Function} onFailure - Called with error on failure
 * @param {Function} onDismiss - Called when modal is closed without payment
 */
export const openRazorpayCheckout = (options, { onSuccess, onFailure, onDismiss } = {}) => {
    const rzpOptions = {
        ...options,
        handler: (response) => {
            if (onSuccess) onSuccess(response);
        },
        modal: {
            ondismiss: () => {
                if (onDismiss) onDismiss();
            },
        },
    };
    const rzp = new window.Razorpay(rzpOptions);
    rzp.on('payment.failed', (response) => {
        if (onFailure) onFailure(response.error);
    });
    rzp.open();
};
