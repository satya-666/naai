import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';

const emptyListing = {
    name: '',
    address: '',
    city: '',
    description: '',
    image: '',
    businessKind: 'salon',
    serviceMode: 'shop',
    serviceCategory: 'Haircut and grooming',
};

const businessKindLabels = {
    salon: 'Salon',
    shop: 'Shop',
    independent: 'Independent barber',
};

const serviceModeLabels = {
    shop: 'At my shop',
    'door-to-door': 'Door to door',
    both: 'Shop and door to door',
};

const ListingForm = ({ salonData, setSalonData, uploading, uploadFileHandler, isEditing, onCancel, onSubmit, submitLabel }) => (
    <form onSubmit={onSubmit} className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1">
                <span className="text-sm font-semibold text-gray-700">Business name</span>
                <input type="text" placeholder="Your salon or business name" className="premium-input"
                    value={salonData.name} onChange={(e) => setSalonData({ ...salonData, name: e.target.value })} required />
            </label>
            <label className="space-y-1">
                <span className="text-sm font-semibold text-gray-700">Service category</span>
                <input type="text" placeholder="Haircut, grooming, spa..." className="premium-input"
                    value={salonData.serviceCategory} onChange={(e) => setSalonData({ ...salonData, serviceCategory: e.target.value })} required />
            </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1">
                <span className="text-sm font-semibold text-gray-700">Business kind</span>
                <select className="premium-input" value={salonData.businessKind} onChange={(e) => setSalonData({ ...salonData, businessKind: e.target.value })}>
                    <option value="salon">Salon</option>
                    <option value="shop">Shop</option>
                    <option value="independent">Independent barber</option>
                </select>
            </label>
            <label className="space-y-1">
                <span className="text-sm font-semibold text-gray-700">Service mode</span>
                <select className="premium-input" value={salonData.serviceMode} onChange={(e) => setSalonData({ ...salonData, serviceMode: e.target.value })}>
                    <option value="shop">At my shop</option>
                    <option value="door-to-door">Door to door</option>
                    <option value="both">Shop and door to door</option>
                </select>
            </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1">
                <span className="text-sm font-semibold text-gray-700">Address or base area</span>
                <input type="text" placeholder="Shop address or service area" className="premium-input"
                    value={salonData.address} onChange={(e) => setSalonData({ ...salonData, address: e.target.value })} required />
            </label>
            <label className="space-y-1">
                <span className="text-sm font-semibold text-gray-700">City</span>
                <input type="text" placeholder="City" className="premium-input"
                    value={salonData.city} onChange={(e) => setSalonData({ ...salonData, city: e.target.value })} required />
            </label>
        </div>

        <label className="space-y-1">
            <span className="text-sm font-semibold text-gray-700">Image</span>
            <div className="flex gap-2">
                <input type="text" placeholder="Image URL" className="premium-input flex-1"
                    value={salonData.image} onChange={(e) => setSalonData({ ...salonData, image: e.target.value })} />
                <div className="relative">
                    <input type="file" onChange={uploadFileHandler} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                    <button type="button" className="premium-btn h-full whitespace-nowrap px-4 shadow-none">
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            </div>
        </label>

        <label className="space-y-1">
            <span className="text-sm font-semibold text-gray-700">Description</span>
            <textarea placeholder="Tell customers what you offer" className="premium-input h-28"
                value={salonData.description} onChange={(e) => setSalonData({ ...salonData, description: e.target.value })} />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
            <button type="submit" className="premium-btn flex-1">{submitLabel}</button>
            {isEditing && (
                <button type="button" onClick={onCancel} className="rounded-full border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50">
                    Cancel
                </button>
            )}
        </div>
    </form>
);

const BookingList = ({ title, emptyText, items, formatDateTime }) => (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-950">{title}</h2>
        {items.length === 0 ? (
            <p className="mt-4 text-gray-500">{emptyText}</p>
        ) : (
            <ul className="mt-5 space-y-3">
                {items.map((booking) => (
                    <li key={booking._id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="font-bold text-gray-950">{booking.userId?.name || 'Customer'}</p>
                                <p className="text-sm text-gray-500">{booking.userId?.email || 'No email available'}</p>
                            </div>
                            <div className="text-sm font-bold text-primary">
                                {booking.slotId ? formatDateTime(booking.slotId.startTime) : 'No slot'}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        )}
    </section>
);

const BarberDashboard = () => {
    const { user } = useContext(AuthContext);
    const [salon, setSalon] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newSlotTime, setNewSlotTime] = useState('');
    const [newSlotDate, setNewSlotDate] = useState(new Date().toISOString().split('T')[0]);
    const [salonData, setSalonData] = useState(emptyListing);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    const buildPayload = () => {
        const payload = { ...salonData };
        payload.images = payload.image ? [payload.image] : ['/default-salon.jpg'];
        delete payload.image;
        return payload;
    };

    const fetchData = useCallback(async () => {
        try {
            const res = await api.get('/salons?limit=500');
            const mySalon = (res.data.salons || []).find((item) => item.barberId?._id === user._id || item.barberId === user._id);
            setSalon(mySalon || null);

            if (mySalon) {
                const [bookingRes, slotsRes] = await Promise.all([
                    api.get(`/bookings/salon/${mySalon._id}`),
                    api.get(`/timeslots/${mySalon._id}`),
                ]);
                setBookings(bookingRes.data || []);
                setSlots(slotsRes.data || []);
            } else {
                setBookings([]);
                setSlots([]);
            }
        } catch (error) {
            console.error(error);
            setMessage('Unable to load your barber workspace.');
        } finally {
            setLoading(false);
        }
    }, [user._id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSalonData((current) => ({ ...current, image: `http://localhost:5001${data}` }));
        } catch (error) {
            console.error(error);
            setMessage('File upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleCreateSalon = async (e) => {
        e.preventDefault();
        try {
            await api.post('/salons', buildPayload());
            setMessage('Business listing created. Add your first future slot.');
            await fetchData();
        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.message || 'Error creating business listing');
        }
    };

    const handleUpdateSalon = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put(`/salons/${salon._id}`, buildPayload());
            setSalon(res.data);
            setMessage('Business listing updated.');
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.message || 'Error updating business listing');
        }
    };

    const startEditing = () => {
        setSalonData({
            name: salon.name || '',
            address: salon.address || '',
            city: salon.city || '',
            description: salon.description || '',
            image: salon.images?.[0] || '',
            businessKind: salon.businessKind || 'salon',
            serviceMode: salon.serviceMode || 'shop',
            serviceCategory: salon.serviceCategory || 'Haircut and grooming',
        });
        setIsEditing(true);
    };

    const handleDeleteSalon = async () => {
        if (!window.confirm('Delete this business listing and its bookings?')) return;
        try {
            await api.delete(`/salons/${salon._id}`);
            setSalon(null);
            setBookings([]);
            setSlots([]);
            setSalonData(emptyListing);
            setMessage('Business listing deleted.');
        } catch (error) {
            console.error(error);
            setMessage('Failed to delete business listing');
        }
    };

    const handleAddSlot = async (e) => {
        e.preventDefault();
        if (!salon || !newSlotTime || !newSlotDate) return;

        try {
            const date = new Date(`${newSlotDate}T${newSlotTime}`);
            await api.post('/timeslots', {
                salonId: salon._id,
                startTime: date.toISOString(),
            });
            setMessage('Slot added.');
            setNewSlotTime('');
            const slotsRes = await api.get(`/timeslots/${salon._id}`);
            setSlots(slotsRes.data || []);
        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.message || 'Error adding slot');
        }
    };

    const handleDeleteSlot = async (slotId) => {
        if (!window.confirm('Delete this open slot?')) return;
        try {
            await api.delete(`/timeslots/${slotId}`);
            setSlots((current) => current.filter((slot) => slot._id !== slotId));
            setMessage('Slot deleted.');
        } catch (error) {
            console.error(error);
            setMessage('Error deleting slot');
        }
    };

    const now = useMemo(() => new Date(), []);
    const futureBookings = useMemo(
        () => bookings.filter((booking) => booking.slotId && new Date(booking.slotId.startTime) >= now),
        [bookings, now]
    );
    const pastBookings = useMemo(
        () => bookings.filter((booking) => booking.slotId && new Date(booking.slotId.startTime) < now),
        [bookings, now]
    );
    const openFutureSlots = slots.filter((slot) => !slot.isBooked && new Date(slot.startTime) >= now);
    const unavailableSlots = slots.filter((slot) => slot.isBooked || new Date(slot.startTime) < now);

    const formatDateTime = (dateValue) => new Date(dateValue).toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    if (loading) return <div className="p-10 text-center text-gray-600">Loading barber workspace...</div>;

    return (
        <main className="min-h-screen bg-bg-light">
            <div className="container-custom py-8">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-primary">Barber workspace</p>
                        <h1 className="mt-2 text-4xl font-black text-gray-950">Run your business</h1>
                        <p className="mt-3 max-w-2xl text-gray-600">List your salon, shop, or door-to-door service, add future slots, and track all bookings from one place.</p>
                    </div>
                    {salon && <button onClick={startEditing} className="btn-secondary w-fit">Edit listing</button>}
                </div>

                {message && <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 font-medium text-primary">{message}</div>}

                {!salon ? (
                    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl md:p-8">
                        <h2 className="mb-2 text-2xl font-bold text-gray-950">Create your business listing</h2>
                        <p className="mb-6 text-gray-600">Choose whether you operate from a shop, visit customers door to door, or do both.</p>
                        <ListingForm
                            salonData={salonData}
                            setSalonData={setSalonData}
                            uploading={uploading}
                            uploadFileHandler={uploadFileHandler}
                            isEditing={isEditing}
                            onCancel={() => setIsEditing(false)}
                            onSubmit={handleCreateSalon}
                            submitLabel="Create listing"
                        />
                    </section>
                ) : (
                    <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
                        <div className="space-y-8">
                            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                                {isEditing ? (
                                    <>
                                        <h2 className="mb-2 text-2xl font-bold text-gray-950">Edit business listing</h2>
                                        <p className="mb-6 text-gray-600">Update how customers discover your service.</p>
                                        <ListingForm
                                            salonData={salonData}
                                            setSalonData={setSalonData}
                                            uploading={uploading}
                                            uploadFileHandler={uploadFileHandler}
                                            isEditing={isEditing}
                                            onCancel={() => setIsEditing(false)}
                                            onSubmit={handleUpdateSalon}
                                            submitLabel="Save listing"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <img src={salon.images?.[0] || '/default-salon.jpg'} alt={salon.name} className="mb-5 h-52 w-full rounded-2xl border border-gray-200 object-cover" />
                                        <div className="flex flex-wrap gap-2">
                                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">{businessKindLabels[salon.businessKind] || 'Salon'}</span>
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gray-600">{serviceModeLabels[salon.serviceMode] || 'At my shop'}</span>
                                        </div>
                                        <h2 className="mt-4 text-3xl font-black text-gray-950">{salon.name}</h2>
                                        <p className="mt-2 font-semibold text-gray-700">{salon.serviceCategory || 'Haircut and grooming'}</p>
                                        <p className="mt-2 text-gray-600">{salon.address}, {salon.city}</p>
                                        <p className="mt-4 text-gray-600">{salon.description || 'No description added yet.'}</p>
                                        <button onClick={handleDeleteSalon} className="mt-6 text-sm font-bold text-red-600 hover:text-red-700">Delete listing</button>
                                    </>
                                )}
                            </section>

                            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-950">Add future slots</h2>
                                <p className="mt-2 text-gray-600">Customers can only book future open slots.</p>
                                <form onSubmit={handleAddSlot} className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                                    <input type="date" className="premium-input" min={today} value={newSlotDate} onChange={(e) => setNewSlotDate(e.target.value)} required />
                                    <input type="time" className="premium-input" value={newSlotTime} onChange={(e) => setNewSlotTime(e.target.value)} required />
                                    <button type="submit" className="premium-btn whitespace-nowrap">Add Slot</button>
                                </form>
                            </section>

                            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h2 className="text-xl font-bold text-gray-950">Open future slots</h2>
                                {openFutureSlots.length === 0 ? (
                                    <p className="mt-4 text-gray-500">No bookable future slots yet.</p>
                                ) : (
                                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                        {openFutureSlots.map((slot) => (
                                            <div key={slot._id} className="flex items-center justify-between rounded-2xl border border-green-100 bg-green-50 p-3">
                                                <span className="font-bold text-green-700">{formatDateTime(slot.startTime)}</span>
                                                <button onClick={() => handleDeleteSlot(slot._id)} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-red-600 shadow-sm">Delete</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h2 className="text-xl font-bold text-gray-950">Booked and past slots</h2>
                                {unavailableSlots.length === 0 ? (
                                    <p className="mt-4 text-gray-500">No booked or past slots yet.</p>
                                ) : (
                                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                        {unavailableSlots.map((slot) => (
                                            <div key={slot._id} className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                                                <p className="font-bold text-gray-700">{formatDateTime(slot.startTime)}</p>
                                                <p className="text-sm text-gray-500">{slot.isBooked ? 'Booked' : 'Past open slot'}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </div>

                        <div className="space-y-8">
                            <BookingList title="Future bookings" emptyText="No future customer bookings yet." items={futureBookings} formatDateTime={formatDateTime} />
                            <BookingList title="Past bookings" emptyText="No past bookings yet." items={pastBookings} formatDateTime={formatDateTime} />
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default BarberDashboard;
