import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderRef = searchParams.get('ref');

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#050505] px-4 text-[#FAFAFA]">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-[#E5C787]/10 p-4">
            <CheckCircle className="h-16 w-16 text-[#E5C787]" />
          </div>
        </div>
        <h1 className="mb-2 text-4xl font-serif font-light tracking-widest text-[#E5C787]">
          THANK YOU
        </h1>
        <p className="mb-8 text-lg text-[#FAFAFA]/70">
          Your order has been placed successfully.
        </p>
        
        <div className="mb-10 rounded-lg border border-[#E5C787]/20 bg-[#E5C787]/5 p-6">
          <p className="text-sm uppercase tracking-tighter text-[#E5C787]/60">Order Reference</p>
          <p className="text-xl font-mono text-[#FAFAFA]">{orderRef || 'GSJ-PROCESSING'}</p>
        </div>

        <button
          onClick={() => navigate('/collections')}
          className="border border-[#E5C787] px-8 py-3 text-sm uppercase tracking-widest text-[#E5C787] transition-all hover:bg-[#E5C787] hover:text-[#050505]"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;