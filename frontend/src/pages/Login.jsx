import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const loggedInUser = await login(email, password);
            if (loggedInUser.role === 'barber') {
                navigate('/barber-dashboard');
            } else if (loggedInUser.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate(location.state?.from || '/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <main className="min-h-screen bg-bg-light px-4 py-14">
            <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl md:grid-cols-[0.95fr_1.05fr]">
                <section className="bg-gray-950 p-8 text-white md:p-10">
                    <p className="text-sm font-bold uppercase tracking-widest text-blue-200">Welcome back</p>
                    <h1 className="mt-4 text-4xl font-black text-white">Your next appointment is a few clicks away.</h1>
                    <p className="mt-4 text-blue-100">Sign in to manage bookings, reserve open slots, and keep your grooming routine on track.</p>
                </section>
                <section className="p-8 md:p-10">
                <h2 className="text-3xl font-bold mb-6 text-gray-950">Log in</h2>
                {error && <p className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" className="premium-input mt-1"
                            value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" className="premium-input mt-1"
                            value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="premium-btn w-full">Sign In</button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
                </div>
                </section>
            </div>
        </main>
    );
};

export default Login;
