import { useEffect, useState, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';

const BarberDashboard = () => {
    const { user } = useContext(AuthContext);
    const [salon, setSalon] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [newSlotTime, setNewSlotTime] = useState('');
    const [salonData, setSalonData] = useState({ name: '', address: '', city: '', description: '' });
    const [message, setMessage] = useState('');

    const fetchData = async () => {
        try {
            // Re-fetching all salons logic (backend could be optimized but sticking to constraint)
            const res = await api.get('/salons?limit=100'); // Increase limit to find own
            const mySalon = res.data.salons.find(s => s.barberId._id === user._id || s.barberId === user._id);
            setSalon(mySalon);

            if (mySalon) {
                const bookingRes = await api.get(`/bookings/salon/${mySalon._id}`);
                setBookings(bookingRes.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user._id]);

    const handleCreateSalon = async (e) => {
        e.preventDefault();
        try {
            await api.post('/salons', salonData);
            setMessage('Salon created successfully!');
            fetchData();
        } catch (error) {
            setMessage('Error creating salon');
        }
    };

    const handleDeleteSalon = async () => {
        if (!window.confirm("Are you sure? This will delete your salon and all bookings permanently.")) return;
        try {
            await api.delete(`/salons/${salon._id}`);
            setSalon(null);
            setMessage('Salon deleted successfully.');
            // Ideally clear bookings state too 
            setBookings([]);
        } catch (error) {
            setMessage('Failed to delete salon');
        }
    }

    const handleAddSlot = async (e) => {
        e.preventDefault();
        if (!salon || !newSlotTime) return;

        try {
            const date = new Date();
            const [hours, minutes] = newSlotTime.split(':');
            date.setHours(hours, minutes, 0, 0);

            if (date < new Date()) {
                date.setDate(date.getDate() + 1);
            }

            await api.post('/timeslots', {
                salonId: salon._id,
                startTime: date.toISOString()
            });
            setMessage('Slot added!');
            setNewSlotTime('');
        } catch (error) {
            setMessage('Error adding slot');
        }
    };

    if (loading) return <div className="p-10 text-center text-primary">Loading...</div>;

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-primary font-serif">Manage Your Salon</h1>

            {message && <div className="p-4 bg-gray-800 border border-primary text-primary rounded-lg mb-6 shadow-lg shadow-yellow-900/10 animate-pulse">{message}</div>}

            {!salon ? (
                <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-2xl max-w-xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6 text-white font-serif">Establish Your Brand</h2>
                    <form onSubmit={handleCreateSalon} className="space-y-5">
                        <input type="text" placeholder="Salon Name" className="premium-input"
                            value={salonData.name} onChange={e => setSalonData({ ...salonData, name: e.target.value })} required />
                        <input type="text" placeholder="Address" className="premium-input"
                            value={salonData.address} onChange={e => setSalonData({ ...salonData, address: e.target.value })} required />
                        <input type="text" placeholder="City" className="premium-input"
                            value={salonData.city} onChange={e => setSalonData({ ...salonData, city: e.target.value })} required />
                        <textarea placeholder="Description" className="premium-input h-32"
                            value={salonData.description} onChange={e => setSalonData({ ...salonData, description: e.target.value })}></textarea>
                        <button type="submit" className="premium-btn w-full">Create Salon</button>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Salon Management */}
                    <div className="space-y-8">
                        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-lg relative group">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={handleDeleteSalon} className="text-red-500 hover:text-red-400 text-sm uppercase font-bold tracking-widest border border-red-900 px-3 py-1 rounded hover:bg-red-900/20 transition-all">
                                    Delete Salon
                                </button>
                            </div>
                            <h2 className="text-2xl font-bold mb-2 text-white font-serif">{salon.name}</h2>
                            <p className="text-gray-400 mb-4">{salon.address}, {salon.city}</p>
                            <p className="text-gray-500 text-sm mb-6">{salon.description}</p>

                            <div className="border-t border-gray-700 pt-6">
                                <h3 className="font-semibold mb-4 text-primary tracking-wide uppercase text-sm">Add Time Slot (Tomorrow)</h3>
                                <form onSubmit={handleAddSlot} className="flex gap-4">
                                    <input type="time" className="premium-input flex-1"
                                        value={newSlotTime} onChange={e => setNewSlotTime(e.target.value)} required />
                                    <button type="submit" className="premium-btn">Add Slot</button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Bookings */}
                    <div>
                        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-lg">
                            <h2 className="text-xl font-bold mb-6 text-white font-serif border-b border-gray-700 pb-4">Upcoming Appointments</h2>
                            {bookings.length === 0 ? <p className="text-gray-500 italic">No appointments scheduled yet.</p> : (
                                <ul className="space-y-4">
                                    {bookings.map(b => (
                                        <li key={b._id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold text-gray-200">{b.userId ? b.userId.name : 'Guest User'}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{b.userId?.email}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-primary font-bold">
                                                        {new Date(b.slotId.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(b.slotId.startTime).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BarberDashboard;
