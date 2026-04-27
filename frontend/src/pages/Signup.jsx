import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const signedUpUser = await signup(name, email, password, role);
            navigate(signedUpUser.role === 'barber' ? '/barber-dashboard' : '/');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <main className="min-h-screen bg-bg-light px-4 py-14">
            <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl md:grid-cols-[0.95fr_1.05fr]">
                <section className="bg-gray-950 p-8 text-white md:p-10">
                    <p className="text-sm font-bold uppercase tracking-widest text-blue-200">Join NAAI</p>
                    <h1 className="mt-4 text-4xl font-black text-white">Book faster or manage your own salon.</h1>
                    <p className="mt-4 text-blue-100">Create a customer account to book slots, or choose barber to list your salon and manage appointments.</p>
                </section>
                <section className="p-8 md:p-10">
                <h2 className="text-3xl font-bold mb-6 text-gray-950">Create account</h2>
                {error && <p className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" className="premium-input mt-1"
                            value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700">I am a...</label>
                        <select className="premium-input mt-1" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="user">Customer</option>
                            <option value="barber">Barber</option>
                        </select>
                    </div>
                    <button type="submit" className="premium-btn w-full mt-6">Create Account</button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-500">
                    Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
                </div>
                </section>
            </div>
        </main>
    );
};

export default Signup;
