import { assets } from "../../assets/assets";
import React from "react";
import Title from "../../components/Title";
const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Top Section: Image Left, Text Right */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Left: Image */}
        <div>
          <img
            src={assets.about_img} // Replace with your image
            alt="About Us"
            className="rounded-xl w-full h-auto object-cover max-h-[400px]"
          />
        </div>

        {/* Right: About Text */}
        <div>
          <h1 className="text-3xl font-bold mb-4">Our Story</h1>
          <p className="text-gray-700 text-base leading-relaxed mb-4">
            At UrbanThread, we believe fashion should be both expressive and accessible. From everyday streetwear to elegant evening styles,
            we curate clothing that empowers you to own your look — every day.
          </p>
          <h2 className="text-xl font-semibold mb-1">Our Mission</h2>
          <p className="text-gray-600 text-sm">
            Our mission is to blend trend-forward design with comfort and quality. We're committed to providing a seamless shopping experience that
            helps our customers feel confident, stylish, and uniquely themselves.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="mt-16">
        <div className="text-3xl font-bold mb-6">
          <Title text1="Why" text2="Choose Us?"  />
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div className="border p-5 rounded-lg">
            <h3 className="font-bold text-base mb-2">Premium Quality</h3>
            <p className="text-gray-600">
              Every piece we sell goes through multiple quality checks to ensure it meets our high standards of durability and finish.
            </p>
          </div>

          <div className="border p-5 rounded-lg">
            <h3 className="font-bold text-base mb-2">Fast & Reliable Delivery</h3>
            <p className="text-gray-600">
              With our nationwide delivery network, your style picks reach your doorstep quickly and safely.
            </p>
          </div>

          <div className="border p-5 rounded-lg">
            <h3 className="font-bold text-base mb-2">Support That Cares</h3>
            <p className="text-gray-600">
              Our support team is always here to help you — whether it's tracking an order, resolving an issue, or just helping you pick the right fit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
