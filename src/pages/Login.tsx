import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginWithEmail, loginWithGoogle, loginWithGithub } from '../firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaGoogle, FaGithub } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) navigate('/');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      toast.success('Logged in with Google');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleGithub = async () => {
    try {
      await loginWithGithub();
      toast.success('Logged in with GitHub');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark p-4">
      <div className="glass p-8 rounded-2xl w-full max-w-md border border-white/10">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text mb-6">
          DVARY GAMES
        </h1>
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-white/5 rounded-lg border border-white/10 focus:border-purple-500 outline-none transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-white/5 rounded-lg border border-white/10 focus:border-purple-500 outline-none transition"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:scale-105 transition"
          >
            Sign In
          </button>
        </form>
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-white/50">OR</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>
        <div className="space-y-3">
          <button
            onClick={handleGoogle}
            className="w-full py-3 bg-white/10 rounded-lg flex items-center justify-center gap-2 hover:bg-white/20 transition"
          >
            <FaGoogle /> Continue with Google
          </button>
          <button
            onClick={handleGithub}
            className="w-full py-3 bg-white/10 rounded-lg flex items-center justify-center gap-2 hover:bg-white/20 transition"
          >
            <FaGithub /> Continue with GitHub
          </button>
        </div>
        <p className="text-center mt-6 text-white/50">
          Don't have an account? <Link to="/register" className="text-purple-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
