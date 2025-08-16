
import React, { useState } from 'react';
import { usePOS } from '../contexts/POSContext';
import { Payment, PaymentMethod } from '../types';
import { CardIcon, CashIcon, CheckCircleIcon } from './icons/Icons';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, totalAmount }) => {
  const { createOrder } = usePOS();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleProcessPayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      const payment: Payment = { method: paymentMethod, amount: totalAmount };
      const order = createOrder([payment]);
      if (order) {
        setIsProcessing(false);
        setIsSuccess(true);
        // Automatically close after a delay
        setTimeout(() => {
            handleClose();
        }, 2000);
      } else {
        // Handle error
        setIsProcessing(false);
        alert("Failed to create order. Please check console for details.");
      }
    }, 1000);
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md">
        {isSuccess ? (
          <div className="text-center flex flex-col items-center">
            <CheckCircleIcon className="w-24 h-24 text-green-400 mb-4"/>
            <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
            <p className="text-gray-300">Order has been completed.</p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-white mb-2 text-center">Checkout</h2>
            <p className="text-center text-5xl font-mono font-bold text-brand-secondary mb-8">${totalAmount.toFixed(2)}</p>
            
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-300 mb-3">Select Payment Method</h3>
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => setPaymentMethod(PaymentMethod.CASH)}
                        className={`p-4 rounded-lg border-2 transition-colors flex flex-col items-center space-y-2 ${paymentMethod === PaymentMethod.CASH ? 'bg-brand-primary border-brand-primary' : 'bg-gray-700 border-gray-600 hover:border-brand-primary'}`}
                    >
                        <CashIcon className="w-8 h-8"/>
                        <span>Cash</span>
                    </button>
                    <button
                        onClick={() => setPaymentMethod(PaymentMethod.CARD)}
                        className={`p-4 rounded-lg border-2 transition-colors flex flex-col items-center space-y-2 ${paymentMethod === PaymentMethod.CARD ? 'bg-brand-primary border-brand-primary' : 'bg-gray-700 border-gray-600 hover:border-brand-primary'}`}
                    >
                        <CardIcon className="w-8 h-8"/>
                        <span>Card</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-500 transition-colors disabled:bg-gray-600"
              >
                {isProcessing ? 'Processing...' : `Confirm Payment`}
              </button>
              <button
                onClick={handleClose}
                disabled={isProcessing}
                className="w-full bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
