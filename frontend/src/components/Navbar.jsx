import { Link, useLocation } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // Add shadow on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-3' : 'bg-transparent py-5'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="text-3xl font-black tracking-tighter text-gray-900 flex gap-1 items-center">
                    <span className="text-primary">NAAI</span>
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    <Link to="/" className="text-gray-600 hover:text-primary font-medium transition-colors">Find Salons</Link>
                    <Link to="/" className="text-gray-600 hover:text-primary font-medium transition-colors">For Barbers</Link>
                    <Link to="/" className="text-gray-600 hover:text-primary font-medium transition-colors">About Us</Link>
                </div>

                <div className="flex items-center space-x-6">
                    {user ? (
                        <>
                            <span className="hidden md:block text-gray-900 font-medium">Hi, {user.name}</span>
                            {user.role === 'barber' && <Link to="/barber-dashboard" className="text-gray-600 hover:text-primary font-medium">Dashboard</Link>}
                            {user.role === 'admin' && <Link to="/admin-dashboard" className="text-gray-600 hover:text-primary font-medium">Admin</Link>}
                            {user.role === 'user' && <Link to="/dashboard" className="text-gray-600 hover:text-primary font-medium">My Bookings</Link>}
                            <button onClick={logout} className="text-gray-600 hover:text-red-500 font-medium transition-colors">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-900 font-medium hover:text-primary transition-colors">Log In</Link>
                            <Link to="/signup" className="btn-primary py-2 px-6 text-sm font-bold shadow-none hover:shadow-lg">Get Started</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
