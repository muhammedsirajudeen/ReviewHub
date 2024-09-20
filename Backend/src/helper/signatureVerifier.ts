import crypto from "crypto"
export default function verifyPayment(orderId:string, razorpayPaymentId:string, razorpaySignature:string, secret:string) {
    // Create the HMAC SHA256 signature
    const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${orderId}|${razorpayPaymentId}`)
        .digest('hex');

    // Compare the generated signature with the Razorpay signature
    if (generatedSignature === razorpaySignature) {
        console.log('Payment is successful');
        return true;
    } else {
        console.log('Payment verification failed');
        return false;
    }
}