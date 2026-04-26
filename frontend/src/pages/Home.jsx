import { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const Home = () => {
    const [salons, setSalons] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSalons = async () => {
        try {
            const res = await api.get(`/salons?limit=3&sort=newest`);
            setSalons(res.data.salons);
        } catch (error) {
            console.error(error);
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

    return (
        <div className="pb-20">
            {/* Hero Section */}
            <section className="pt-20 pb-32 flex flex-col items-center justify-center text-center px-6">
                <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tight mb-6 fade-in-up">
                    Find Your Perfect <br /> Barber
                </h1>
                <p className="text-xl text-gray-600 mb-10 max-w-2xl fade-in-up">
                    Discover and book the best local professionals on the leading booking platform.
                </p>
                <div className="fade-in-up">
                    <Link to="/signup" className="btn-primary text-lg px-10 py-4">Get Started</Link>
                </div>
                <p className="mt-6 text-sm text-gray-500 fade-in-up">Book in seconds. No waiting in line.</p>
            </section>

            {/* Feature Section 1 */}
            <section className="bg-secondary/30 py-24">
                <div className="container-custom grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <div className="bg-white p-8 rounded-2xl shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            {/* Placeholder for feature image */}
                            <div className="bg-gray-100 rounded-xl h-64 w-full flex items-center justify-center text-gray-400">
                                Booking Interface Preview
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

                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {salons.map((salon) => (
                            <div key={salon._id} className="card-minimal group cursor-pointer">
                                <div className="h-64 overflow-hidden rounded-xl mb-6 relative">
                                    <img
                                        src={salon.images[0] || "https://via.placeholder.com/600x400"}
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
        </div>
    );
};

export default Home;
