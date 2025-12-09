import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    //start

    return (
        <nav className="bg-secondary/95 backdrop-blur-md text-white p-4 sticky top-0 z-50 border-b border-gray-800">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-primary font-serif tracking-widest">
                    NAAI
                </Link>
                <div className="space-x-6 flex items-center">
                    <Link to="/" className="text-gray-300 hover:text-primary transition uppercase text-xs tracking-widest font-semibold">Home</Link>
                    {user ? (
                        <>
                            <span className="text-primary font-serif italic mr-4">Hello, {user.name}</span>
                            {user.role === 'barber' && <Link to="/barber-dashboard" className="text-gray-300 hover:text-primary transition uppercase text-xs tracking-widest font-semibold">Dashboard</Link>}
                            {user.role === 'admin' && <Link to="/admin-dashboard" className="text-gray-300 hover:text-primary transition uppercase text-xs tracking-widest font-semibold">Admin</Link>}
                            {user.role === 'user' && <Link to="/dashboard" className="text-gray-300 hover:text-primary transition uppercase text-xs tracking-widest font-semibold">Bookings</Link>}
                            <button onClick={logout} className="border border-red-500 text-red-500 px-4 py-1 rounded-full hover:bg-red-500 hover:text-white transition uppercase text-xs font-bold tracking-wider">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-300 hover:text-primary transition uppercase text-xs tracking-widest font-semibold">Login</Link>
                            <Link to="/signup" className="bg-primary text-black px-5 py-2 rounded-full hover:bg-yellow-500 transition uppercase text-xs font-bold tracking-wider shadow-lg shadow-yellow-900/20">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
