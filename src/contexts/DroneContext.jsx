import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from './ToastContext';

const DroneContext = createContext();

const initialOperators = [
  {
    id: 'op1',
    name: 'SkyFarmer Drones',
    location: 'Pune Regional',
    rating: 4.8,
    services: ['Crop Spraying', 'Field Mapping'],
    pricePerAcre: 500,
    availableUnits: 3,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'op2',
    name: 'AgriScan Solutions',
    location: 'Nashik North',
    rating: 4.5,
    services: ['Soil Health Analysis', 'Thermal Imaging'],
    pricePerAcre: 750,
    availableUnits: 2,
    image: 'https://images.unsplash.com/photo-1527977966376-1c841de9d21a?auto=format&fit=crop&q=80&w=400'
  }
];

const makeFlightLogFromBooking = (booking) => ({
  id: `flight_${Date.now()}_${booking.id}`,
  bookingId: booking.id,
  operatorId: booking.operatorId,
  farmerName: booking.farmerName,
  service: booking.service,
  acres: booking.acres,
  completedAt: new Date().toISOString(),
  durationMin: Math.round(15 + Number(booking.acres || 1) * 8)
});

export const DroneProvider = ({ children }) => {
  const { showSuccess, showError } = useToast();
  const [operators, setOperators] = useLocalStorage('app_drone_operators', initialOperators);
  const [bookings, setBookings] = useLocalStorage('app_drone_bookings', []);
  const [flightLogs, setFlightLogs] = useLocalStorage('app_drone_flight_logs', []);
  const [availabilitySlots, setAvailabilitySlots] = useLocalStorage('app_drone_availability', []);

  const bookDrone = (bookingData) => {
    try {
      const newBooking = {
        id: `book_${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        ...bookingData
      };
      setBookings((prev) => [...prev, newBooking]);
      showSuccess('Drone service booked successfully! Waiting for operator approval.');
      return newBooking;
    } catch (err) {
      showError('Failed to book drone service.');
      console.error(err);
    }
  };

  const updateBookingStatus = (bookingId, status) => {
    let completedBooking = null;
    setBookings((prev) => {
      const booking = prev.find((b) => b.id === bookingId);
      if (!booking) return prev;
      if (status === 'completed' && booking.status !== 'completed') {
        completedBooking = { ...booking, status };
      }
      return prev.map((b) => (b.id === bookingId ? { ...b, status } : b));
    });
    if (completedBooking) {
      setFlightLogs((fl) => {
        if (fl.some((log) => log.bookingId === bookingId)) return fl;
        return [...fl, makeFlightLogFromBooking(completedBooking)];
      });
    }
    showSuccess(`Booking status updated to ${status}`);
  };

  const addAvailabilitySlot = (operatorId, date) => {
    const d = String(date).slice(0, 10);
    setAvailabilitySlots((prev) => {
      if (prev.some((s) => s.operatorId === operatorId && s.date === d)) return prev;
      return [...prev, { id: `av_${operatorId}_${d}`, operatorId, date: d }];
    });
    showSuccess('Availability updated');
  };

  const removeAvailabilitySlot = (slotId) => {
    setAvailabilitySlots((prev) => prev.filter((s) => s.id !== slotId));
    showSuccess('Slot removed');
  };

  const getAvailabilityForOperator = (operatorId) =>
    availabilitySlots.filter((s) => s.operatorId === operatorId).sort((a, b) => a.date.localeCompare(b.date));

  const getOperatorBookings = (operatorId) => bookings.filter((b) => b.operatorId === operatorId);

  const getFarmerBookings = (farmerId) => bookings.filter((b) => b.farmerId === farmerId);

  const getFlightLogsForOperator = (operatorId) =>
    flightLogs.filter((log) => log.operatorId === operatorId).sort((a, b) => b.completedAt.localeCompare(a.completedAt));

  const updateOperator = (operatorId, patch) => {
    setOperators((prev) => prev.map((o) => (o.id === operatorId ? { ...o, ...patch } : o)));
    showSuccess('Operator updated');
  };

  return (
    <DroneContext.Provider
      value={{
        operators,
        setOperators,
        bookings,
        flightLogs,
        availabilitySlots,
        bookDrone,
        updateBookingStatus,
        getOperatorBookings,
        getFarmerBookings,
        getFlightLogsForOperator,
        addAvailabilitySlot,
        removeAvailabilitySlot,
        getAvailabilityForOperator,
        updateOperator
      }}
    >
      {children}
    </DroneContext.Provider>
  );
};

export const useDrone = () => {
  const context = useContext(DroneContext);
  if (!context) {
    throw new Error('useDrone must be used within a DroneProvider');
  }
  return context;
};
