import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookingForm from "../../components/BookingForm";
import api from "../../services/api";
import { getImage } from "../../utils/roomImages";
import "./rooms-booking.css";

function Booking() {
  const { roomId } = useParams();
  const navigate   = useNavigate();

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [allRooms,     setAllRooms]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); setError(null);
      try {
        const [roomRes, allRoomsRes] = await Promise.all([
          api.get(`/rooms/${roomId}`),
          api.get("/rooms"),
        ]);
        setSelectedRoom(roomRes.data.data);
        setAllRooms(allRoomsRes.data.data);
      } catch { setError("Failed to load room data."); }
      finally   { setLoading(false); }
    };
    fetchData();
  }, [roomId]);

  if (loading) return (
    <div className="ck-page">
      <div className="ck-wrap"><p style={{padding:"4rem",textAlign:"center",color:"#888"}}>Loading…</p></div>
    </div>
  );

  if (error || !selectedRoom) return (
    <div className="ck-page">
      <div className="ck-wrap"><p style={{padding:"4rem",textAlign:"center",color:"#c0392b"}}>{error || "Room not found."}</p></div>
    </div>
  );

  const browseRooms = (() => {
    const others   = allRooms.filter(r => r._id !== selectedRoom._id);
    const shuffled = [...others];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 6);
  })();

  return (
    <div className="ck-page">
      <div className="ck-wrap">

        {/* Breadcrumb */}
        <nav className="ck-breadcrumb">
          <span onClick={() => navigate("/")} className="ck-breadcrumb-link">Hotel</span>
          <span className="ck-breadcrumb-sep">›</span>
          <span>Checkout</span>
        </nav>

        <h1 className="ck-page-title">Book your stay securely</h1>

        <BookingForm
          room={selectedRoom}
          allRooms={allRooms}
          onRoomChange={newRoom => {
            setSelectedRoom(newRoom);
            navigate(`/booking/${newRoom._id}`);
          }}
        />

        {/* Explore other rooms */}
        <div className="ck-browse-section">
          <h2 className="ck-browse-title">Explore Other Rooms</h2>
          <div className="ck-browse-grid">
            {browseRooms.map(room => (
              <div key={room._id} className="ck-browse-card" onClick={() => navigate(`/rooms/${room._id}`)}>
                <div className="ck-browse-img-wrap">
                  <img src={getImage(room.images[0])} alt={room.title} />
                  <div className="ck-browse-overlay">
                    <span>{room.title}</span>
                    <span>${room.price} / night</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Booking;