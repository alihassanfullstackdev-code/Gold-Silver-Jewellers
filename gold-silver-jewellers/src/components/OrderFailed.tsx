import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const OrderFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#050505] px-4 text-[#FAFAFA]">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-500/10 p-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
        </div>
        <h1 className="mb-2 text-4xl font-serif font-light tracking-widest text-red-500">
          PAYMENT FAILED
        </h1>
        <p className="mb-10 text-lg text-[#FAFAFA]/70">
          We couldn't process your payment. Please try again.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => navigate('/cart')}
            className="bg-[#E5C787] px-8 py-3 text-sm uppercase tracking-widest text-[#050505] transition-all hover:bg-[#FAFAFA]"
          >
            Go Back to Cart
          </button>
          <button
            onClick={() => navigate('/contact')}
            className="border border-[#FAFAFA]/20 px-8 py-3 text-sm uppercase tracking-widest text-[#FAFAFA] transition-all hover:bg-[#FAFAFA]/10"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderFailed;