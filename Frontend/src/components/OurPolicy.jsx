import React from 'react';
import { RefreshCcw, RotateCcw, Headset } from 'lucide-react'; // Lucide icons

const policies = [
  {
    title: "Exchange Policy",
    description: "Easy product exchange within 7 days of delivery.",
    icon: <RefreshCcw className="w-8 h-8 text-blue-600" />,
  },
  {
    title: "10 Days Return",
    description: "Return your product within 10 days, no questions asked.",
   },
  {
    title: "Customer Support",
    description: "24/7 support via chat, email, and phone.",
    icon: <Headset className="w-8 h-8 text-purple-600" />,
  },
];

const OurPolicy = () => {
  return (
    <div className="bg-white rounded-2xl p-6 max-w-5xl mx-auto mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        {policies.map((policy, index) => (
          <div key={index} className="flex flex-col items-center">
            {policy.icon}
            <h3 className="mt-2 text-lg font-semibold">{policy.title}</h3>
            <p className="text-sm text-gray-600">{policy.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurPolicy;
