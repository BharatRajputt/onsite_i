"use client"
import React, { useState } from 'react';
import { ChevronDown, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAddUserMutation, useVerifyOtpMutation, useSigInUserMutation } from '../store/api'
import { useRouter } from "next/navigation";

const Login = () => {
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [currentStep, setCurrentStep] = useState('form'); // 'form' or 'otp'
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const router = useRouter();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const [signupUser] = useAddUserMutation()
  const [verifyOtp] = useVerifyOtpMutation()
  const [signinUser] = useSigInUserMutation()

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

  // Token management functions
  const storeToken = (token) => {
    localStorage.setItem('authToken', token);
    // You can also store in cookies for better security
    // document.cookie = `authToken=${token}; path=/; secure; httpOnly`;
  };

  const getToken = () => {
    return localStorage.getItem('authToken');
  };

  const removeToken = () => {
    localStorage.removeItem('authToken');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleFormSubmit = async () => {
    try {
      if (mode === 'signup') {
        // Signup flow - requires OTP verification
        if (formData.name && formData.email && formData.password && formData.phone) {
          try {
            const fd = new FormData();
            for (let key in formData) {
              fd.append(key, formData[key]);
            }

            const res = await signupUser(fd).unwrap();
            console.log("Signup Success:", res);
            setCurrentStep('otp'); // Move to OTP step for signup
          } catch (err) {
            console.error("Signup Error:", err);
            // Handle signup error (show error message to user)
          }
        }
      } else {
        // Signin flow - direct login without OTP
        if (formData.email && formData.password) {
          try {
            const signinData = {
              email: formData.email,
              password: formData.password
            };

            const res = await signinUser(signinData).unwrap();
            console.log("Signin Success:", res);

            // Check if login was successful and token is received
            if (res.success && res.token) {
              // Store the token
              storeToken(res.token);
              
              // Optional: Store user data if needed
              if (res.user) {
                localStorage.setItem('userData', JSON.stringify(res.user));
              }

              // Redirect to dashboard
              router.push("/dashboard");
            } else {
              // Handle case where success is false
              console.error("Login failed:", res.message || "Unknown error");
              // Show error message to user
            }

          } catch (err) {
            console.error("Signin Error:", err);
            // Handle signin error (show error message to user)
            // You might want to show specific error messages based on error type
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleOtpSubmit = async () => {
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      try {
        // OTP verification only for signup
        const res = await verifyOtp({
          otp: otpCode,
          phone: formData.phone // Only phone needed for signup OTP
        }).unwrap();
        
        console.log("OTP Verified:", res);

        // Store token after successful OTP verification
        if (res.success && res.token) {
          storeToken(res.token);
          
          // Optional: Store user data if needed
          if (res.user) {
            localStorage.setItem('userData', JSON.stringify(res.user));
          }
        }

        router.push("/dashboard");

      } catch (err) {
        console.error("OTP Verify Error:", err);
        // Handle OTP verification error
      }
    }
  };

  const isFormValid = () => {
    if (mode === 'signup') {
      return formData.name && formData.email && formData.password && formData.phone.length >= 10;
    } else {
      return formData.email && formData.password;
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

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
                  <h3 className="font-semibold text-lg text-gray-600">{testimonials[currentSlide].company}</h3>
                  <p className="text-sm text-gray-500 opacity-80">{testimonials[currentSlide].location}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed opacity-90 italic ">
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
                      index === currentSlide ? 'bg-yellow-300' : 'bg-white bg-opacity-40'
                    }`}
                  />
                ))}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={prevSlide}
                  className="w-8 h-8 bg-yellow-400 hover:bg-gray-400 bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
                >
                  <span className="text-sm text-white">‹</span>
                </button>
                <button
                  onClick={nextSlide}
                  className="w-8 h-8 bg-yellow-400 hover:bg-gray-400 bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
                >
                  <span className="text-sm text-white">›</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login/Signup Form */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center relative">
        {/* Close Button */}
        <button className="absolute top-6 right-6 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
          <span className="text-gray-600 text-xl">×</span>
        </button>

        <div className="w-full max-w-md px-8">
          {currentStep === 'form' ? (
            <>
              {/* Header with Toggle */}
              <div className="text-center mb-8">
                {/* Mode Toggle */}
                <div className="inline-flex bg-gray-200 rounded-lg p-1 mb-6">
                  <button
                    onClick={() => setMode('signin')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      mode === 'signin' 
                        ? 'bg-white text-purple-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setMode('signup')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      mode === 'signup' 
                        ? 'bg-white text-purple-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-gray-600">
                  {mode === 'signup' 
                    ? 'Fill in your details to create an account' 
                    : 'Enter your credentials to sign in'
                  }
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Name Field (Signup only) */}
                {mode === 'signup' && (
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                    />
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  />
                </div>

                {/* Phone Field (Signup only) */}
                {mode === 'signup' && (
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
                        placeholder="Mobile Number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Password Field */}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleFormSubmit}
                  disabled={!isFormValid()}
                  className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                    isFormValid()
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>{mode === 'signup' ? 'Sign Up' : 'Sign In'}</span>
                  <ArrowRight size={18} />
                </button>

                {/* Forgot Password (Sign In only) */}
                {mode === 'signin' && (
                  <div className="text-center">
                    <a href="#" className="text-sm text-purple-600 hover:underline">
                      Forgot Password?
                    </a>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* OTP Verification Step (Only for Signup) */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify OTP</h2>
                <p className="text-gray-600 mb-2">
                  Enter the 6-digit code sent to
                </p>
                <p className="text-purple-600 font-medium">
                  {formData.phone}
                </p>
              </div>

              {/* OTP Input */}
              <div className="space-y-6">
                <div className="flex justify-center space-x-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !digit && index > 0) {
                          const prevInput = document.getElementById(`otp-${index - 1}`);
                          if (prevInput) prevInput.focus();
                        }
                      }}
                      className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <button
                  onClick={handleOtpSubmit}
                  disabled={!isOtpComplete}
                  className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                    isOtpComplete
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>Verify OTP</span>
                  <ArrowRight size={18} />
                </button>

                {/* Resend OTP */}
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-500">Didn't receive the code?</p>
                  <button 
                    onClick={() => console.log('Resend OTP')}
                    className="text-sm text-purple-600 hover:underline font-medium"
                  >
                    Resend OTP
                  </button>
                </div>

                {/* Back Button */}
                <button
                  onClick={() => setCurrentStep('form')}
                  className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Back to Sign Up
                </button>
              </div>
            </>
          )}

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