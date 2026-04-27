import { useEffect, useState, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import AuthContext from '../context/AuthContext';

const SalonDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [salon, setSalon] = useState(null);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const salonRes = await api.get(`/salons/${id}`);
                setSalon(salonRes.data);

                const slotsRes = await api.get(`/timeslots/${id}`);
                setSlots(slotsRes.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleBook = async (slotId) => {
        if (!user) {
            navigate('/login', { state: { from: `/salon/${id}` } });
            return;
        }
        if (user.role !== 'user') {
            setMessage('Only customer accounts can book salon appointments.');
            return;
        }
        setBookingLoading(true);
        setMessage('');
        try {
            await api.post('/bookings', { salonId: id, slotId });
            setMessage('Booking successful!');
            // Refresh slots to show updated status
            const slotsRes = await api.get(`/timeslots/${id}`);
            setSlots(slotsRes.data);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-600">Loading salon...</div>;
    if (!salon) return <div className="p-10 text-center text-gray-600">Salon not found</div>;

    const now = new Date();
    const openSlots = slots.filter(slot => !slot.isBooked && new Date(slot.startTime) > now);
    const unavailableSlots = slots.filter(slot => slot.isBooked || new Date(slot.startTime) <= now);

    const formatSlotDate = (dateValue) => new Date(dateValue).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
    });

    const formatSlotTime = (dateValue) => new Date(dateValue).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <main className="bg-bg-light pb-16">
            <section className="container-custom py-10">
                <Link to="/search" className="font-semibold text-primary hover:text-primary-dark">Back to search</Link>
                <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                <div>
                    <img
                        src={salon.images?.[0] || "https://via.placeholder.com/600x400"}
                        alt={salon.name}
                        className="mb-6 h-96 w-full rounded-3xl border border-gray-200 object-cover shadow-xl"
                    />
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-bold uppercase tracking-widest text-primary">{salon.city}</p>
                        <h1 className="mt-2 text-4xl font-black text-gray-950 md:text-5xl">{salon.name}</h1>
                        <p className="mt-4 text-lg font-semibold text-gray-700">{salon.address}, {salon.city}</p>
                        <p className="mt-4 leading-7 text-gray-600">{salon.description || 'Professional grooming and styling appointments.'}</p>
                    </div>
                </div>

                <div>
                    <div className="sticky top-28 rounded-3xl border border-gray-200 bg-white p-6 shadow-xl">
                        <h2 className="mb-2 text-2xl font-bold text-gray-950">Book an Appointment</h2>
                        <p className="mb-5 text-gray-600">Choose an open time and we will reserve it for your customer account.</p>
                        {message && (
                            <div className={`mb-4 rounded-xl border p-3 text-center font-medium ${message.includes('successful') ? 'border-green-100 bg-green-50 text-green-700' : 'border-red-100 bg-red-50 text-red-700'
                                }`}>
                                {message}
                            </div>
                        )}

                        <h3 className="mb-3 text-lg font-semibold text-gray-950">Available Time Slots</h3>
                        {openSlots.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {openSlots.map(slot => (
                                <button
                                    key={slot._id}
                                    disabled={bookingLoading}
                                    onClick={() => handleBook(slot._id)}
                                    className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-bold text-gray-800 transition-all duration-200 hover:border-primary hover:bg-primary hover:text-white hover:shadow-md disabled:cursor-wait disabled:opacity-60"
                                >
                                    <span className="block">{formatSlotTime(slot.startTime)}</span>
                                    <span className="mt-1 block text-xs font-semibold opacity-70">{formatSlotDate(slot.startTime)}</span>
                                </button>
                            ))}
                        </div>
                        ) : slots.length > 0 ? (
                            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-amber-800">
                                No bookable slots right now. This salon needs to add a future open slot before customers can book.
                            </div>
                        ) : (
                            <p className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center text-gray-500">No slots have been added for this salon yet.</p>
                        )}

                        {unavailableSlots.length > 0 && (
                            <div className="mt-6 border-t border-gray-100 pt-5">
                                <h4 className="mb-3 text-sm font-bold uppercase tracking-widest text-gray-500">Unavailable slots</h4>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {unavailableSlots.map(slot => {
                                        const label = slot.isBooked ? 'Booked' : 'Past';
                                        return (
                                            <div
                                                key={slot._id}
                                                className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-center text-sm font-bold text-gray-400"
                                            >
                                                <span className="block">{formatSlotTime(slot.startTime)}</span>
                                                <span className="mt-1 block text-xs font-semibold">{label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                </div>
            </section>
        </main>
    );
};

export default SalonDetails;
