import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import PaymentPage from "../../components/PaymentPage";
import "./BookingManagement.css";

const BookingManagement = () => {
  const initialFormData = {
    userEmail: "",
    firstName: "",
    lastName: "",
    roomId: "",
    adults: 2,
    children: 0,
    checkIn: "",
    checkOut: "",
  };

  const [bookings, setBookings] = useState([]);
  const [editingStatus, setEditingStatus] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState(new Set());
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilterStatus, setSelectedFilterStatus] = useState("");
  const [appliedFilterStatus, setAppliedFilterStatus] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearchEmail, setAppliedSearchEmail] = useState("");

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedRoom(null);
    setTotalPrice(0);
    setFormErrors({});
    setTouchedFields(new Set());
    setSubmitAttempted(false);
    setPaymentError("");
    setBookingError("");
  };

  const handleBlur = (fieldName) => {
    setTouchedFields((prev) => new Set(prev).add(fieldName));
  };

  const shouldShowError = (field) => submitAttempted || touchedFields.has(field);

  useEffect(() => {
    fetchBookings();
    fetchUsers();
    fetchRooms();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/bookings/all");
      setBookings(response.data.data);
    } catch (error) {
      console.error("Error fetching bookings", error);
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await api.get("/rooms");
      setRooms(response.data.data.filter((room) => room.available));
    } catch (error) {
      console.error("Error fetching rooms", error);
    }
  };

  const handleStatusEdit = async (id, newStatus) => {
    try {
      await api.put(`/bookings/admin/${id}`, { status: newStatus });
      setBookings(
        bookings.map((booking) =>
          booking._id === id ? { ...booking, status: newStatus } : booking
        )
      );
      setEditingStatus(null);
    } catch (error) {
      console.error("Error updating status", error);
      setError("Failed to update booking status. Please try again.");
    }
  };

  const handleDeleteBooking = (id) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/bookings/admin/${pendingDeleteId}`);
      setBookings(bookings.filter((booking) => booking._id !== pendingDeleteId));
    } catch (error) {
      console.error("Failed to delete booking", error);
      setError("Failed to delete booking. Please try again.");
    } finally {
      setPendingDeleteId(null);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "roomId") {
      const room = rooms.find((room) => room._id === value);
      setSelectedRoom(room);
    }
  };

  const validateForm = useCallback(() => {
    const errors = {};
    const trimmedEmail = formData.userEmail.trim().toLowerCase();
    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const adults = parseInt(formData.adults, 10);
    const children = parseInt(formData.children, 10);
    const totalGuests = adults + children;

    if (!trimmedEmail) {
      errors.userEmail = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.userEmail = "Enter a valid email address.";
    } else if (!users.some((user) => user.email === trimmedEmail)) {
      errors.userEmail = "Email must belong to an existing user.";
    }

    if (!firstName) {
      errors.firstName = "First name is required.";
    }

    if (!lastName) {
      errors.lastName = "Last name is required.";
    }

    if (!formData.roomId) {
      errors.roomId = "Room selection is required.";
    }

    if (!selectedRoom) {
      errors.selectedRoom = "Please select a valid available room.";
    }

    if (Number.isNaN(adults) || adults < 1 || adults > 5) {
      errors.adults = "Select between 1 and 5 adults.";
    }

    if (Number.isNaN(children) || children < 0 || children > 4) {
      errors.children = "Select between 0 and 4 children.";
    }

    if (selectedRoom && totalGuests > selectedRoom.capacity) {
      errors.capacity = `Selected room capacity is ${selectedRoom.capacity}. Reduce adults or children.`;
    }

    if (!formData.checkIn) {
      errors.checkIn = "Check-in date is required.";
    }

    if (!formData.checkOut) {
      errors.checkOut = "Check-out date is required.";
    }

    if (formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      const diffDays = Math.ceil(
        (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
      );

      if (checkOutDate <= checkInDate) {
        errors.checkOut = "Check-out must be after check-in.";
      } else if (diffDays < 2) {
        errors.checkOut = "Check-out must be at least 2 days after check-in.";
      }
    }

    return errors;
  }, [formData, selectedRoom, users]);

  useEffect(() => {
    if (formData.checkIn && formData.checkOut && selectedRoom) {
      const checkIn = new Date(formData.checkIn);
      const checkOut = new Date(formData.checkOut);
      const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      setTotalPrice(days * selectedRoom.price);
    } else {
      setTotalPrice(0);
    }
  }, [formData.checkIn, formData.checkOut, selectedRoom]);

  useEffect(() => {
    setFormErrors(validateForm());
  }, [formData, selectedRoom, users, validateForm]);

  const isFormValid = () => {
    const errors = validateForm();
    return Object.keys(errors).length === 0;
  };

  const handleConfirmPay = () => {
    setSubmitAttempted(true);
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setShowPayment(true);
    }
  };

  const handlePaymentResult = async ({ paymentMethod, success }) => {
    setShowPayment(false);

    if (!success) {
      setPaymentError("Payment failed. Please try again.");
      return;
    }

    setPaymentError("");
    setBookingError("");

    try {
      const bookingData = {
        roomId: formData.roomId,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        adults: parseInt(formData.adults, 10) || 1,
        children: parseInt(formData.children, 10) || 0,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.userEmail.trim().toLowerCase(),
        paymentMethod,
        totalPrice,
      };

      await api.post("/bookings/admin/create", bookingData);
      setSuccessMessage("Booking created successfully.");
      setShowForm(false);
      resetForm();
      fetchBookings();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "Failed to create booking.";
      if (status === 404) {
        setBookingError(message);
      } else {
        setBookingError(message);
      }
    }
  };

  const getAdults = (booking) => {
    return Number(booking.adults ?? booking.adultsCount ?? 0);
  };

  const getChildren = (booking) => {
    return Number(booking.children ?? booking.childrenCount ?? 0);
  };

  const displayedBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const bookingEmail = booking.email?.toLowerCase() || "";
      const bookingStatus = booking.status?.toLowerCase() || "";

      const matchesEmail =
        !appliedSearchEmail ||
        bookingEmail.includes(appliedSearchEmail.toLowerCase());

      const matchesStatus =
        !appliedFilterStatus ||
        bookingStatus === appliedFilterStatus.toLowerCase();

      return matchesEmail && matchesStatus;
    });
  }, [bookings, appliedSearchEmail, appliedFilterStatus]);

  const handleApplyFiltering = () => {
    if (selectedFilterStatus) {
      setAppliedFilterStatus(selectedFilterStatus);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setAppliedSearchEmail(searchInput.trim());
  };

  const handleResetTable = () => {
    setAppliedFilterStatus("");
    setSelectedFilterStatus("");
    setAppliedSearchEmail("");
    setSearchInput("");
    setShowFilter(false);
  };

  const minCheckIn = new Date();
  minCheckIn.setDate(minCheckIn.getDate() + 2);
  const minCheckInStr = minCheckIn.toISOString().split("T")[0];

  const minCheckOut = formData.checkIn ? new Date(formData.checkIn) : new Date();
  minCheckOut.setDate(minCheckOut.getDate() + 2);
  const minCheckOutStr = minCheckOut.toISOString().split("T")[0];

  const maxCheckOut = formData.checkIn ? new Date(formData.checkIn) : new Date();
  maxCheckOut.setDate(maxCheckOut.getDate() + 6);
  const maxCheckOutStr = maxCheckOut.toISOString().split("T")[0];

  return (
    <div className="admin-page">
      <div className="admin-content-with-sidebar">
        <div className="booking-table-wrapper">
          <div className="booking-card">
          <h1>Booking Management</h1>
          <p className="booking-subtitle">View, filter, and manage guest bookings.</p>

          {loading && <p>Loading bookings...</p>}
          {error && <p className="error">{error}</p>}

          {!loading && !error && (
            <>
              <div className="booking-toolbar">
                <form className="booking-search-form" onSubmit={handleSearchSubmit}>
                  <span className="search-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search by email"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </form>

                <div className="actions-top">
                  <button
                    className="add-booking-btn"
                    onClick={() => setShowForm(true)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Add New Booking
                  </button>

                  <button
                    className="filter-btn"
                    onClick={() => setShowFilter((prev) => !prev)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
                    </svg>
                    Filter
                  </button>

                  <button className="reset-table-btn" onClick={handleResetTable}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/>
                    </svg>
                    Reset
                  </button>

                  {showFilter && (
                    <div className="filter-panel">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedFilterStatus === "confirmed"}
                          onChange={(e) =>
                            setSelectedFilterStatus(
                              e.target.checked ? "confirmed" : ""
                            )
                          }
                        />
                        Confirmed
                      </label>

                      <label>
                        <input
                          type="checkbox"
                          checked={selectedFilterStatus === "cancelled"}
                          onChange={(e) =>
                            setSelectedFilterStatus(
                              e.target.checked ? "cancelled" : ""
                            )
                          }
                        />
                        Cancelled
                      </label>

                      <button
                        type="button"
                        className="apply-filter-btn"
                        onClick={handleApplyFiltering}
                      >
                        Apply Filtering
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="table-center-container">
                <table>
                  <thead>
                    <tr>
                      <th>Guest Name</th>
                      <th>Email</th>
                      <th>Room Type</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Adults</th>
                      <th>Children</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {displayedBookings.map((booking) => {
                      const adults = getAdults(booking);
                      const children = getChildren(booking);
                      const totalGuests = adults + children;

                      return (
                        <tr key={booking._id}>
                          <td>
                            {booking.firstName} {booking.lastName}
                          </td>
                          <td>{booking.email}</td>
                          <td>{booking.room?.title || "Unknown room"}</td>
                          <td>{new Date(booking.checkIn).toLocaleDateString("en-GB").replace(/\//g, "/")}</td>
                          <td>{new Date(booking.checkOut).toLocaleDateString("en-GB").replace(/\//g, "/")}</td>
                          <td>{adults}</td>
                          <td>{children}</td>
                          <td>{totalGuests}</td>
                          <td>
                            {editingStatus === booking._id ? (
                              <select
                                value={booking.status}
                                onChange={(e) =>
                                  handleStatusEdit(booking._id, e.target.value)
                                }
                              >
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            ) : (
                              <span
                                className={`status-badge status-${booking.status}`}
                              >
                                {booking.status}
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="action-cell">
                              <button
                                className="edit-btn"
                                onClick={() =>
                                  setEditingStatus(
                                    editingStatus === booking._id
                                      ? null
                                      : booking._id
                                  )
                                }
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                                Edit
                              </button>

                              {booking.status === "cancelled" && (
                                <button
                                  className="delete-btn"
                                  onClick={() => handleDeleteBooking(booking._id)}
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                  </svg>
                                  Delete
                                </button>
                              )}

                              {booking.status !== "cancelled" && (
                                <span className="no-action">-</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p className="booking-footer">
                Showing {displayedBookings.length} of {bookings.length} bookings
              </p>
            </>
          )}
          </div>
        </div>

        {showForm && (
          <div className="booking-form-modal">
            <div className="booking-form">

              {/* Header */}
              <div className="form-header">
                <div>
                  <h2>Add New Booking</h2>
                  <p className="form-subtitle">Create a new guest booking.</p>
                </div>
                <button
                  className="form-close-btn"
                  onClick={() => { resetForm(); setShowPayment(false); setShowForm(false); }}
                  aria-label="Close"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* Form grid */}
              <div className="form-grid">

                {/* First Name + Last Name */}
                <div className="form-group">
                  <label className="form-label"><span className="required-star">*</span>First Name</label>
                  <input
                    className="form-input"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    onBlur={(e) => handleBlur(e.target.name)}
                    placeholder="First name"
                  />
                  {shouldShowError('firstName') && formErrors.firstName && <span className="form-field-error">{formErrors.firstName}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label"><span className="required-star">*</span>Last Name</label>
                  <input
                    className="form-input"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    onBlur={(e) => handleBlur(e.target.name)}
                    placeholder="Last name"
                  />
                  {shouldShowError('lastName') && formErrors.lastName && <span className="form-field-error">{formErrors.lastName}</span>}
                </div>

                {/* Email — full width */}
                <div className="form-group form-full">
                  <label className="form-label"><span className="required-star">*</span>Email</label>
                  <input
                    className="form-input"
                    type="email"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleFormChange}
                    onBlur={(e) => handleBlur(e.target.name)}
                    placeholder="guest@email.com"
                  />
                  {shouldShowError('userEmail') && formErrors.userEmail && <span className="form-field-error">{formErrors.userEmail}</span>}
                </div>

                {/* Room Type — full width */}
                <div className="form-group form-full">
                  <label className="form-label"><span className="required-star">*</span>Room Type</label>
                  <select
                    className="form-input form-select"
                    name="roomId"
                    value={formData.roomId}
                    onChange={handleFormChange}
                    onBlur={(e) => handleBlur(e.target.name)}
                  >
                    <option value="">Select a room</option>
                    {rooms.map((room) => (
                      <option key={room._id} value={room._id}>{room.title}</option>
                    ))}
                  </select>
                  {shouldShowError('roomId') && formErrors.roomId && <span className="form-field-error">{formErrors.roomId}</span>}
                  {shouldShowError('roomId') && formErrors.selectedRoom && <span className="form-field-error">{formErrors.selectedRoom}</span>}
                </div>

                {/* Room details card */}
                {selectedRoom && (
                  <div className="room-details form-full">
                    <div className="room-details-grid">
                      <span><strong>Room:</strong> {selectedRoom.title}</span>
                      <span><strong>Price:</strong> ${selectedRoom.price}/night</span>
                      <span><strong>Capacity:</strong> {selectedRoom.capacity} guests</span>
                      <span><strong>Bed:</strong> {selectedRoom.bed}</span>
                    </div>
                  </div>
                )}

                {/* Check-in + Check-out */}
                <div className="form-group">
                  <label className="form-label"><span className="required-star">*</span>Check-In</label>
                  <input
                    className="form-input"
                    type="date"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleFormChange}
                    onBlur={(e) => handleBlur(e.target.name)}
                    min={minCheckInStr}
                  />
                  {shouldShowError('checkIn') && formErrors.checkIn && <span className="form-field-error">{formErrors.checkIn}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label"><span className="required-star">*</span>Check-Out</label>
                  <input
                    className="form-input"
                    type="date"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleFormChange}
                    onBlur={(e) => handleBlur(e.target.name)}
                    min={minCheckOutStr}
                  />
                  {shouldShowError('checkOut') && formErrors.checkOut && <span className="form-field-error">{formErrors.checkOut}</span>}
                </div>

                {/* Adults + Children */}
                <div className="form-group">
                  <label className="form-label"><span className="required-star">*</span>Adults</label>
                  <select
                    className="form-input form-select"
                    name="adults"
                    value={formData.adults}
                    onChange={handleFormChange}
                    onBlur={(e) => handleBlur(e.target.name)}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  {shouldShowError('adults') && formErrors.adults && <span className="form-field-error">{formErrors.adults}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label"><span className="required-star">*</span>Children</label>
                  <select
                    className="form-input form-select"
                    name="children"
                    value={formData.children}
                    onChange={handleFormChange}
                    onBlur={(e) => handleBlur(e.target.name)}
                  >
                    {[0, 1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  {shouldShowError('children') && formErrors.children && <span className="form-field-error">{formErrors.children}</span>}
                </div>

                {/* Capacity / global errors */}
                {((submitAttempted && formErrors.capacity) || paymentError || bookingError) && (
                  <div className="form-full form-error-block">
                    {submitAttempted && formErrors.capacity && <p className="error">{formErrors.capacity}</p>}
                    {paymentError && <p className="error">{paymentError}</p>}
                    {bookingError && <p className="error">{bookingError}</p>}
                  </div>
                )}

                {/* Total price */}
                {totalPrice > 0 && (
                  <div className="form-full form-total">
                    Total Price: <strong>${totalPrice.toFixed(2)}</strong>
                  </div>
                )}

              </div>

              {/* Action buttons */}
              <div className="form-actions">
                <button type="button" className="form-btn-secondary" onClick={resetForm}>
                  Reset
                </button>
                <div className="form-actions-right">
                  <button
                    type="button"
                    className="form-btn-ghost"
                    onClick={() => { resetForm(); setShowPayment(false); setShowForm(false); }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="form-btn-primary"
                    onClick={handleConfirmPay}
                    disabled={!isFormValid()}
                  >
                    Confirm &amp; Pay
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {showPayment && (
          <PaymentPage
            total={totalPrice}
            onResult={handlePaymentResult}
            onClose={() => setShowPayment(false)}
          />
        )}

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {pendingDeleteId && (
          <div className="confirm-modal-overlay">
            <div className="confirm-modal">
              <p>Are you sure you want to delete this booking?</p>
              <div className="confirm-modal-actions">
                <button className="confirm-modal-cancel" onClick={() => setPendingDeleteId(null)}>
                  Cancel
                </button>
                <button className="confirm-modal-delete" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingManagement;