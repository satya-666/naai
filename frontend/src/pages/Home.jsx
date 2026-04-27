import { useContext, useEffect, useState } from 'react';
import api from '../api';
import { Link, Navigate } from 'react-router-dom';
import gsap from 'gsap';
import AuthContext from '../context/AuthContext';

const Home = () => {
    const { user } = useContext(AuthContext);
    const [salons, setSalons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchSalons = async () => {
        try {
            const res = await api.get(`/salons?limit=3&sort=newest`);
            setSalons(res.data.salons || []);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to load featured salons.');
            setSalons([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalons();
    }, []);

    useEffect(() => {
        if (!loading) {
            gsap.fromTo(".fade-in-up",
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, stagger: 0.2, duration: 0.8, ease: "power2.out" }
            );
        }
    }, [loading]);

    if (user?.role === 'barber') {
        return <Navigate to="/barber-dashboard" replace />;
    }

    if (user?.role === 'admin') {
        return <Navigate to="/admin-dashboard" replace />;
    }

    return (
        <main className="pb-16">
            <section className="container-custom grid min-h-[720px] items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="text-center lg:text-left">
                    <p className="fade-in-up mb-5 text-sm font-bold uppercase tracking-widest text-primary">Salon booking made simple</p>
                    <h1 className="fade-in-up text-5xl font-black tracking-tight text-gray-950 sm:text-6xl lg:text-7xl">
                    Find Your Perfect Barber
                </h1>
                    <p className="fade-in-up mx-auto mt-6 max-w-2xl text-xl leading-8 text-gray-600 lg:mx-0">
                    Discover and book the best local professionals on the leading booking platform.
                </p>
                    <div className="fade-in-up mt-10 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                        <Link to="/search" className="btn-primary text-lg px-10 py-4">Find a slot</Link>
                        <Link to="/signup" className="btn-secondary text-lg px-10 py-4">Join as barber</Link>
                    </div>
                    <p className="fade-in-up mt-6 text-sm text-gray-500">Book in seconds. No waiting in line.</p>
                </div>
                <div className="fade-in-up rounded-[2rem] border border-gray-200 bg-white p-4 shadow-2xl shadow-blue-100/70">
                    <div className="overflow-hidden rounded-[1.5rem] bg-gray-950 text-left text-white">
                        <div className="h-64 bg-[linear-gradient(135deg,#111827_0%,#2563eb_55%,#38bdf8_100%)] p-6">
                            <div className="rounded-2xl bg-white/15 p-5 backdrop-blur">
                                <p className="text-sm text-blue-100">Today, 5:30 PM</p>
                                <h2 className="mt-2 text-3xl font-black">Clean fade appointment</h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 p-5">
                            <div className="rounded-xl bg-white/10 p-3">
                                <p className="text-xs text-blue-100">Salons</p>
                                <p className="text-2xl font-bold">24</p>
                            </div>
                            <div className="rounded-xl bg-white/10 p-3">
                                <p className="text-xs text-blue-100">Slots</p>
                                <p className="text-2xl font-bold">84</p>
                            </div>
                            <div className="rounded-xl bg-white/10 p-3">
                                <p className="text-xs text-blue-100">Wait</p>
                                <p className="text-2xl font-bold">0m</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="why-naai" className="bg-secondary/40 py-24">
                <div className="container-custom grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
                            <div className="space-y-4 rounded-xl bg-gray-50 p-5">
                                {['Choose a salon', 'Pick a live slot', 'Get confirmation'].map((step, index) => (
                                    <div key={step} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-primary">Step {index + 1}</p>
                                            <p className="font-semibold text-gray-950">{step}</p>
                                        </div>
                                        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">Ready</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="order-1 md:order-2">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Experience Premium Service</h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Intuitive search and booking tools. Effortlessly find salons, check availability, and book appointments in seconds.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-gray-700 font-medium">
                                <span className="text-primary text-xl">→</span> Instant Booking Confirmation
                            </li>
                            <li className="flex items-center gap-3 text-gray-700 font-medium">
                                <span className="text-primary text-xl">→</span> Real-time Availability
                            </li>
                            <li className="flex items-center gap-3 text-gray-700 font-medium">
                                <span className="text-primary text-xl">→</span> Verified Reviews
                            </li>
                        </ul>
                        <Link to="/signup" className="btn-secondary">Details</Link>
                    </div>
                </div>
            </section>

            {/* Salons / Templates Section */}
            <section className="py-24 container-custom">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Choose a professional</h2>
                    <p className="text-lg text-gray-600">Top rated salons and stylists ready for you.</p>
                </div>

                {error && (
                    <div className="mb-8 rounded-2xl border border-red-100 bg-red-50 p-5 text-center text-red-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
                    </div>
                ) : salons.length === 0 && !error ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                        <h3 className="text-2xl font-bold text-gray-950">No featured salons yet</h3>
                        <p className="mt-2 text-gray-600">Once barbers create salons, they will appear here.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {salons.map((salon) => (
                            <div key={salon._id} className="card-minimal group cursor-pointer">
                                <div className="h-64 overflow-hidden rounded-xl mb-6 relative">
                                    <img
                                        src={salon.images?.[0] || "https://via.placeholder.com/600x400"}
                                        alt={salon.name}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {salon.city}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{salon.name}</h3>
                                <p className="text-gray-500 line-clamp-2 mb-6">{salon.description}</p>
                                <Link to={`/salon/${salon._id}`} className="text-primary font-bold hover:underline underline-offset-4 flex items-center gap-2">
                                    View Details <span>→</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-12">
                    <Link to="/search" className="btn-secondary">View All Professionals</Link>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary py-24 text-center text-white">
                <div className="container-custom">
                    <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to get started?</h2>
                    <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">Join thousands of others who have already booked their next appointment with ease.</p>
                    <Link to="/signup" className="bg-white text-primary font-bold py-4 px-10 rounded-full hover:bg-gray-100 transition-colors shadow-xl">Start Booking Now</Link>
                </div>
            </section>
        </main>
    );
};

export default Home;
