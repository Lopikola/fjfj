"use client";

import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  CreditCard, 
  MapPin, 
  QrCode, 
  Search, 
  Plus, 
  Edit3, 
  CheckCircle, 
  XCircle, 
  Clock,
  Star,
  DollarSign,
  UserCheck,
  Settings,
  Eye,
  Filter
} from 'lucide-react';

const VenueManagementSystem = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Events State - now mutable
  const [events, setEvents] = useState([
    {
      id: 1,
      name: 'Friday Night Fever',
      date: '2025-06-30',
      capacity: 300,
      ticketPrice: 25,
      vipTablePrice: 500,
      checkedIn: 127,
      revenue: 8450
    },
    {
      id: 2,
      name: 'Saturday Bash',
      date: '2025-07-01',
      capacity: 400,
      ticketPrice: 30,
      vipTablePrice: 750,
      checkedIn: 0,
      revenue: 0
    }
  ]);

  // Tables State - now mutable
  const [tables, setTables] = useState([
    { id: 1, name: 'VIP 1', capacity: 8, status: 'booked', minSpend: 500, currentSpend: 0, guest: 'Sarah Johnson' },
    { id: 2, name: 'VIP 2', capacity: 6, status: 'available', minSpend: 400, currentSpend: 0, guest: null },
    { id: 3, name: 'VIP 3', capacity: 10, status: 'checked-in', minSpend: 750, currentSpend: 320, guest: 'Mike Chen' },
    { id: 4, name: 'Stage Side', capacity: 12, status: 'booked', minSpend: 1000, currentSpend: 0, guest: 'Alex Rivera' },
    { id: 5, name: 'Booth 1', capacity: 4, status: 'available', minSpend: 300, currentSpend: 0, guest: null },
    { id: 6, name: 'Booth 2', capacity: 4, status: 'no-show', minSpend: 300, currentSpend: 0, guest: 'Emma Davis' }
  ]);

  // Guests State - now mutable
  const [guests, setGuests] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@email.com',
      phone: '+1-555-0123',
      tags: ['VIP', 'Birthday'],
      totalVisits: 12,
      totalSpend: 3200,
      lastVisit: '2025-06-15',
      notes: 'Prefers champagne, celebrates birthday in July',
      checkedIn: false,
      checkInTime: null
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike@email.com',
      phone: '+1-555-0124',
      tags: ['Regular', 'Promoter Guest'],
      totalVisits: 8,
      totalSpend: 1800,
      lastVisit: '2025-06-22',
      notes: 'Usually brings large groups',
      checkedIn: false,
      checkInTime: null
    },
    {
      id: 3,
      name: 'Alex Rivera',
      email: 'alex@email.com',
      phone: '+1-555-0125',
      tags: ['VIP', 'High Roller'],
      totalVisits: 15,
      totalSpend: 8500,
      lastVisit: '2025-06-20',
      notes: 'Spends big on bottles, tip staff well',
      checkedIn: false,
      checkInTime: null
    }
  ]);

  // Form States for Modals
  const [showEventForm, setShowEventForm] = useState(false);
  const [showTableForm, setShowTableForm] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [checkInSearch, setCheckInSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(events[0]);

  // CRUD Functions for Events
  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: Math.max(...events.map(e => e.id)) + 1,
      checkedIn: 0,
      revenue: 0
    };
    setEvents([...events, newEvent]);
    setShowEventForm(false);
  };

  const updateEvent = (id, eventData) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, ...eventData } : event
    ));
    setEditingItem(null);
    setShowEventForm(false);
  };

  // CRUD Functions for Tables
  const addTable = (tableData) => {
    const newTable = {
      ...tableData,
      id: Math.max(...tables.map(t => t.id)) + 1,
      status: 'available',
      currentSpend: 0,
      guest: null
    };
    setTables([...tables, newTable]);
    setShowTableForm(false);
  };

  const updateTable = (id, tableData) => {
    setTables(tables.map(table => 
      table.id === id ? { ...table, ...tableData } : table
    ));
    setEditingItem(null);
    setShowTableForm(false);
  };

  const checkInTable = (tableId) => {
    setTables(tables.map(table => 
      table.id === tableId 
        ? { ...table, status: 'checked-in' }
        : table
    ));
  };

  // CRUD Functions for Guests
  const addGuest = (guestData) => {
    const newGuest = {
      ...guestData,
      id: Math.max(...guests.map(g => g.id)) + 1,
      totalVisits: 0,
      totalSpend: 0,
      lastVisit: new Date().toISOString().split('T')[0],
      checkedIn: false,
      checkInTime: null
    };
    setGuests([...guests, newGuest]);
    setShowGuestForm(false);
  };

  const updateGuest = (id, guestData) => {
    setGuests(guests.map(guest => 
      guest.id === id ? { ...guest, ...guestData } : guest
    ));
    setEditingItem(null);
    setShowGuestForm(false);
  };

  const handleCheckIn = (guestId) => {
    const updatedGuests = guests.map(guest => 
      guest.id === guestId 
        ? { 
            ...guest, 
            checkedIn: true, 
            checkInTime: new Date().toLocaleTimeString(),
            totalVisits: guest.totalVisits + 1,
            lastVisit: new Date().toISOString().split('T')[0]
          }
        : guest
    );
    setGuests(updatedGuests);
    
    // Update event check-in count
    setEvents(events.map(event => 
      event.id === selectedEvent.id 
        ? { ...event, checkedIn: event.checkedIn + 1 }
        : event
    ));
  };

  // QR Code Scanner Simulation
  const simulateQRScan = () => {
    const randomGuest = guests[Math.floor(Math.random() * guests.length)];
    if (!randomGuest.checkedIn) {
      handleCheckIn(randomGuest.id);
      alert(`QR Scan: ${randomGuest.name} checked in successfully!`);
    } else {
      alert(`${randomGuest.name} is already checked in.`);
    }
  };

  const filteredGuests = guests.filter(guest => 
    guest.name.toLowerCase().includes(checkInSearch.toLowerCase()) ||
    guest.email.toLowerCase().includes(checkInSearch.toLowerCase()) ||
    guest.phone.includes(checkInSearch)
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'bg-green-900 text-green-300 border border-green-700';
      case 'booked': return 'bg-yellow-900 text-yellow-300 border border-yellow-700';
      case 'checked-in': return 'bg-purple-900 text-purple-300 border border-purple-700';
      case 'no-show': return 'bg-red-900 text-red-300 border border-red-700';
      default: return 'bg-gray-800 text-gray-300 border border-gray-600';
    }
  };

  const getTagColor = (tag) => {
    switch(tag.toLowerCase()) {
      case 'vip': return 'bg-purple-900 text-purple-300 border border-purple-700';
      case 'birthday': return 'bg-pink-900 text-pink-300 border border-pink-700';
      case 'regular': return 'bg-blue-900 text-blue-300 border border-blue-700';
      case 'promoter guest': return 'bg-orange-900 text-orange-300 border border-orange-700';
      case 'high roller': return 'bg-yellow-900 text-yellow-300 border border-yellow-700';
      default: return 'bg-gray-800 text-gray-300 border border-gray-600';
    }
  };

  // Modal Components
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gradient-to-br from-gray-900 to-black border border-purple-800 rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <XCircle size={20} />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  const EventForm = ({ event, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(event || {
      name: '',
      date: '',
      capacity: '',
      ticketPrice: '',
      vipTablePrice: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Event Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
          required
        />
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
          required
        />
        <input
          type="number"
          placeholder="Capacity"
          value={formData.capacity}
          onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
          required
        />
        <input
          type="number"
          placeholder="GA Ticket Price"
          value={formData.ticketPrice}
          onChange={(e) => setFormData({...formData, ticketPrice: parseInt(e.target.value)})}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
          required
        />
        <input
          type="number"
          placeholder="VIP Table Price"
          value={formData.vipTablePrice}
          onChange={(e) => setFormData({...formData, vipTablePrice: parseInt(e.target.value)})}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
          required
        />
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-800 border border-gray-600 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-yellow-500 font-semibold"
          >
            {event ? 'Update' : 'Create'} Event
          </button>
        </div>
      </form>
    );
  };

  const TableForm = ({ table, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(table || {
      name: '',
      capacity: '',
      minSpend: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Table Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
          required
        />
        <input
          type="number"
          placeholder="Capacity"
          value={formData.capacity}
          onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
          required
        />
        <input
          type="number"
          placeholder="Minimum Spend"
          value={formData.minSpend}
          onChange={(e) => setFormData({...formData, minSpend: parseInt(e.target.value)})}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
          required
        />
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-800 border border-gray-600 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-yellow-500 font-semibold"
          >
            {table ? 'Update' : 'Add'} Table
          </button>
        </div>
      </form>
    );
  };

  const GuestForm = ({ guest, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(guest || {
      name: '',
      email: '',
      phone: '',
      tags: [],
      notes: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    const toggleTag = (tag) => {
      const newTags = formData.tags.includes(tag)
        ? formData.tags.filter(t => t !== tag)
        : [...formData.tags, tag];
      setFormData({...formData, tags: newTags});
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Guest Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
          required
        />
        <div className="space-y-2">
          <p className="text-sm text-gray-300">Tags:</p>
          <div className="flex flex-wrap gap-2">
            {['VIP', 'Regular', 'Birthday', 'High Roller', 'Promoter Guest'].map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-2 py-1 text-xs rounded ${
                  formData.tags.includes(tag)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <textarea
          placeholder="Notes"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
          rows={3}
        />
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-800 border border-gray-600 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-yellow-500 font-semibold"
          >
            {guest ? 'Update' : 'Add'} Guest
          </button>
        </div>
      </form>
    );
  };

  const TabButton = ({ id, children, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        activeTab === id 
          ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-semibold' 
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      <Icon size={18} />
      <span>{children}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black p-2 rounded-lg">
                <Users size={24} />
              </div>
              <h1 className="text-2xl font-bold text-white">VenueManager Pro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-300">
                Current Event: <span className="font-semibold text-yellow-400">{selectedEvent.name}</span>
              </div>
              <Settings className="text-gray-400 cursor-pointer hover:text-yellow-400" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          <TabButton id="dashboard" icon={Calendar}>Dashboard</TabButton>
          <TabButton id="tables" icon={MapPin}>Tables</TabButton>
          <TabButton id="events" icon={Calendar}>Events</TabButton>
          <TabButton id="guests" icon={Users}>Guests</TabButton>
          <TabButton id="checkin" icon={QrCode}>Check-In</TabButton>
          <TabButton id="payments" icon={CreditCard}>Payments</TabButton>
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-purple-800 p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">Tonight's Revenue</p>
                    <p className="text-2xl font-bold text-yellow-400">${selectedEvent.revenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="text-yellow-400" size={24} />
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black border border-purple-800 p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">Checked In</p>
                    <p className="text-2xl font-bold text-purple-400">{selectedEvent.checkedIn}</p>
                  </div>
                  <UserCheck className="text-purple-400" size={24} />
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black border border-purple-800 p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">VIP Tables</p>
                    <p className="text-2xl font-bold text-yellow-400">{tables.filter(t => t.status === 'booked' || t.status === 'checked-in').length}</p>
                  </div>
                  <Star className="text-yellow-400" size={24} />
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black border border-purple-800 p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">Capacity</p>
                    <p className="text-2xl font-bold text-purple-400">{Math.round((selectedEvent.checkedIn / selectedEvent.capacity) * 100)}%</p>
                  </div>
                  <Users className="text-purple-400" size={24} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-purple-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-white">Recent Check-ins</h3>
                <div className="space-y-3">
                  {guests.slice(0, 5).map(guest => (
                    <div key={guest.id} className="flex items-center justify-between p-3 bg-gray-800 border border-gray-700 rounded">
                      <div>
                        <p className="font-medium text-white">{guest.name}</p>
                        <p className="text-sm text-gray-300">{guest.checkInTime || 'Not checked in'}</p>
                      </div>
                      <div className="flex space-x-1">
                        {guest.tags.map(tag => (
                          <span key={tag} className={`px-2 py-1 text-xs rounded ${getTagColor(tag)}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-purple-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-white">Table Status Overview</h3>
                <div className="space-y-3">
                  {tables.map(table => (
                    <div key={table.id} className="flex items-center justify-between p-3 bg-gray-800 border border-gray-700 rounded">
                      <div>
                        <p className="font-medium text-white">{table.name}</p>
                        <p className="text-sm text-gray-300">{table.guest || 'Available'}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded ${getStatusColor(table.status)}`}>
                          {table.status}
                        </span>
                        <span className="text-sm text-gray-300">${table.currentSpend}/${table.minSpend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tables Management */}
        {activeTab === 'tables' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Table Management</h2>
              <button 
                onClick={() => setShowTableForm(true)}
                className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-yellow-600 hover:to-yellow-500 font-semibold"
              >
                <Plus size={18} />
                <span>Add Table</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tables.map(table => (
                <div key={table.id} className="bg-gradient-to-br from-gray-900 to-black border border-purple-800 p-6 rounded-lg shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-white">{table.name}</h3>
                      <p className="text-sm text-gray-300">Capacity: {table.capacity}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${getStatusColor(table.status)}`}>
                      {table.status}
                    </span>
                  </div>
                  
                  {table.guest && (
                    <div className="mb-4">
                      <p className="font-medium text-white">{table.guest}</p>
                      <p className="text-sm text-gray-300">Min Spend: <span className="text-yellow-400">${table.minSpend}</span></p>
                      <p className="text-sm text-gray-300">Current: <span className="text-purple-400">${table.currentSpend}</span></p>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setEditingItem(table);
                        setShowTableForm(true);
                      }}
                      className="flex-1 bg-gray-800 border border-gray-600 text-gray-200 px-3 py-2 rounded text-sm hover:bg-gray-700 hover:border-gray-500"
                    >
                      <Edit3 size={14} className="inline mr-1" />
                      Edit
                    </button>
                    {table.status === 'booked' && (
                      <button 
                        onClick={() => checkInTable(table.id)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-2 rounded text-sm hover:from-purple-700 hover:to-purple-800"
                      >
                        <CheckCircle size={14} className="inline mr-1" />
                        Check In
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

                {/* Events */}
                {activeTab === 'events' && (
                  <div>
                    {/* Events tab content goes here */}
                  </div>
                )}
              </div>
            </div>
          );
        };
        
        export default VenueManagementSystem;