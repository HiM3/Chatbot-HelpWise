import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import { toast } from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      localStorage.setItem('token', response.data.token);
      toast.success('Login successful!');
      navigate('/chat');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="h-screen flex justify-center items-center font-[Segoe_UI,Tahoma,Geneva,Verdana,sans-serif] transition-colors duration-300 dark:bg-[#1c1e26] dark:text-[#f4f4f4] bg-[#f4f8fb] text-[#0d1b2a]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center transition-colors duration-300 dark:bg-[#2d334a] dark:text-[#f4f4f4] dark:shadow-xl">
        <h2 className="mb-6 text-3xl font-semibold text-[#333] transition-colors duration-300 dark:text-[#f4f4f4]">Login</h2>
        <form onSubmit={handleSubmit} className="text-left">
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 font-semibold text-[#555] transition-colors duration-300 dark:text-[#d0d3d8]">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2.5 border border-[#ccc] rounded-md text-base bg-[#f8f8f8] text-[#333] transition-colors duration-300 focus:outline-none focus:border-[#4e7cff] focus:shadow-[0_0_0_3px_rgba(78,124,255,0.2)] dark:bg-[#3b3f51] dark:border-[#555] dark:text-[#f4f4f4]"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 font-semibold text-[#555] transition-colors duration-300 dark:text-[#d0d3d8]">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2.5 border border-[#ccc] rounded-md text-base bg-[#f8f8f8] text-[#333] transition-colors duration-300 focus:outline-none focus:border-[#4e7cff] focus:shadow-[0_0_0_3px_rgba(78,124,255,0.2)] dark:bg-[#3b3f51] dark:border-[#555] dark:text-[#f4f4f4]"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 mt-5 text-lg font-semibold bg-[#4e7cff] text-white rounded-md shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:bg-[#6a4ef4] dark:shadow-md dark:hover:bg-[#553bb8] dark:hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Don't have an account? <Link to="/signup" className="text-[#4e7cff] hover:underline">Sign Up</Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;