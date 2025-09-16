// import React from 'react';
// import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

// const Footer = () => {
//   return (
//     <footer className="bg-white text-black py-8 mt-10">
//       <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
        
//         {/* Logo & Description */}
//         <div className=''>
//           <h1 className="text-2xl font-bold text-black">ShopMate</h1>
//           <p className="mt-2 text-sm w-full md:w-2/3">Your favorite place to shop everything you love. Lorem ipsum dolor sit amet consectetur adipisicing elit. At, vero.</p>
//         </div>

//         {/* Navigation Links */}
//         <div>
//           <p className="text-xl font-semibold text-black mb-2">ShopMate</p>
//           <ul className='flex flex-col gap-1'>
//             <li>Home</li>
//             <li>About us</li>
//             <li>Privacy Policy</li>
//             {/* <li></li> */}
//           </ul>
//         </div>

//         {/* Social Media */}
//         <div>
//           <h2 className="text-lg font-semibold text-white mb-2">Follow Us</h2>
//           <div className="flex space-x-4">
//             <a href="#" className="hover:text-white"><FaFacebook size={20} /></a>
//             <a href="#" className="hover:text-white"><FaInstagram size={20} /></a>
//             <a href="#" className="hover:text-white"><FaTwitter size={20} /></a>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Footer */}
//       <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm">
//         © {new Date().getFullYear()} ShopMate. All rights reserved.
//       </div>
//     </footer>
//   );
// };

// export default Footer;


import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className=" text-gray-800 py-10 mt-12">
      <div className="flex flex-col mx-auto px-6 w-full sm:grid grid-cols-3 gap-12 text-sm">
        
        {/* Logo & Description */}
        <div >
          <h1 className="w-32 text-3xl font-extrabold text-gray-900">ShopMate</h1>
          <p className="w-full md:w-2/3 mt-3 text-sm leading-relaxed text-gray-600">
            Discover the latest trends, enjoy fast delivery, and shop your favorite items — all in one place.
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
          </p>
        </div>

        {/* Spacer for increased gap */}
        {/* <div className="w-0" /> */}

        {/* Navigation Links */}
        <div>
          <p className="text-lg font-semibold text-gray-900 mb-5">Quick Links</p>
          <ul className="flex flex-col gap-1">
            <li><a href="/shop" className="hover:text-blue-600 transition-colors">🛒 Shop</a></li>
            <li><a href="/about" className="hover:text-blue-600 transition-colors">ℹ️ About</a></li>
            <li><a href="/contact" className="hover:text-blue-600 transition-colors">📞 Contact</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className='align-center'>
          <p className="text-xl font-semibold text-gray-900 mb-3">Follow Us</p>
          <div className="flex gap-1 space-x-5 text-gray-600">
            <a href="#" className="hover:text-blue-600 transition-colors">
              <FaFacebook size={24} />
            </a>
            <a href="#" className="hover:text-pink-500 transition-colors">
              <FaInstagram size={24} />
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              <FaTwitter size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="mt-10 border-t border-gray-200 pt-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} <span className="text-gray-800 font-medium">ShopMate</span>. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
