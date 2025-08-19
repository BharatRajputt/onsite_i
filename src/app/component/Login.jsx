"use client"
import React, { useState } from 'react';
import { ChevronDown, ArrowRight, Smartphone } from 'lucide-react';

const Login= () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      company: "AFC India",
      location: "India",
      text: "Subcontracting tracking and their expense become very easy for me. Instead of calling and taking updates, I get direct updates on the app and it saved me a lot of time and confusion.",
      logo: "🏗️"
    },
    {
      company: "BuildTech Solutions",
      location: "Mumbai",
      text: "Project management has never been easier. Real-time updates and seamless collaboration with all stakeholders has transformed our workflow completely.",
      logo: "🏢"
    },
    {
      company: "Metro Construction",
      location: "Delhi",
      text: "The financial tracking features are outstanding. We can monitor expenses, payments, and budgets all in one place. Highly recommended for construction businesses.",
      logo: "🚇"
    }
  ];

  const handleNext = () => {
    if (phoneNumber.length >= 10) {
      // Handle login logic here
      console.log('Login with phone:', phoneNumber);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Purple Section */}
      <div className="flex-1 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-white rounded-full"></div>
          <div className="absolute bottom-32 left-40 w-28 h-28 border border-white rounded-full"></div>
        </div>

        <div className="relative z-10 p-12 h-full flex flex-col">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              #1 Construction
              <br />
              Application For
              <br />
              <span className="text-yellow-300">Quotation.</span>
            </h1>
          </div>

          {/* Company Logos */}
          <div className="flex items-center space-x-8 mb-12 opacity-80">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-lg">🏗️</span>
              </div>
              <span className="text-sm">BHARAT</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-lg">🏢</span>
              </div>
              <span className="text-sm">L&T</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-lg">🔨</span>
              </div>
              <span className="text-sm">TATA</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-lg">⚡</span>
              </div>
              <span className="text-sm">ADANI</span>
            </div>
          </div>

          {/* Testimonial Section */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 mb-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">{testimonials[currentSlide].logo}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{testimonials[currentSlide].company}</h3>
                  <p className="text-sm opacity-80">{testimonials[currentSlide].location}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed opacity-90 italic">
                "{testimonials[currentSlide].text}"
              </p>
            </div>

            {/* Testimonial Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-40'
                    }`}
                  />
                ))}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={prevSlide}
                  className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
                >
                  <span className="text-sm">‹</span>
                </button>
                <button
                  onClick={nextSlide}
                  className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
                >
                  <span className="text-sm">›</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center relative">
        {/* Close Button */}
        <button className="absolute top-6 right-6 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
          <span className="text-gray-600 text-xl">×</span>
        </button>

        <div className="w-full max-w-md px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login & Sign Up</h2>
            <p className="text-gray-600">Enter your country code and mobile number</p>
          </div>

          {/* Phone Illustration */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-48 bg-gradient-to-b from-blue-500 to-purple-600 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-black bg-opacity-20 rounded-full"></div>
                <div className="absolute top-12 left-4 right-4 h-20 bg-white bg-opacity-90 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">908.....</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">👋</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Country Code and Phone Input */}
            <div className="flex space-x-3">
              <div className="relative">
                <button className="flex items-center space-x-2 px-3 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                  <img src="https://flagcdn.com/16x12/in.png" alt="IN" className="w-4 h-3" />
                  <span className="text-sm font-medium">+91</span>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>
              </div>
              <div className="flex-1">
                <input
                  type="tel"
                  placeholder="Mobile"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={phoneNumber.length < 10}
              className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                phoneNumber.length >= 10
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>Next</span>
              <ArrowRight size={18} />
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">Or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Login with App Button */}
            <button className="w-full py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 text-gray-700">
              <Smartphone size={18} className="text-purple-600" />
              <span>Login with App</span>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our{' '}
              <a href="#" className="text-purple-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;