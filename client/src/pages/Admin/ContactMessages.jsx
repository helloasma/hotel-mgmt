import { useEffect, useState } from "react";
import axios from "axios";
import "./ContactMessages.css";

const EditIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const SaveIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const CancelIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingData, setEditingData] = useState({ status: "" });
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/contact-messages`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMessages(response.data.data);
      } catch (error) {
        console.error("Error fetching messages", error);
      }
    };

    fetchMessages();
  }, []);

  const handleDeleteMessage = (id) => {
    setPendingDeleteId(id);
  };

  const confirmDeleteMessage = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/contact-messages/${pendingDeleteId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessages(messages.filter((msg) => msg._id !== pendingDeleteId));
    } catch (error) {
      console.error("Failed to delete message", error);
      alert("Failed to delete message");
    } finally {
      setPendingDeleteId(null);
    }
  };

  const handleEditMessage = (message) => {
    setEditingMessageId(message._id);
    setEditingData({ status: message.status });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
  };

  const handleUpdateMessage = async (id) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/contact-messages/${id}`,
        { status: editingData.status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessages(messages.map((msg) => (msg._id === id ? response.data.data : msg)));
      setEditingMessageId(null);
    } catch (error) {
      console.error("Failed to update message", error);
      alert("Failed to update message");
    }
  };

  const renderAttachments = (attachments) => {
    if (!attachments || attachments.length === 0) return "None";
    return attachments.map((att, idx) => (
      <div key={idx}>
        <a href={att.url} target="_blank" rel="noopener noreferrer">
          {att.filename}
        </a>
      </div>
    ));
  };

  return (
    <div className="admin-page">
      <div className="admin-content">
        <h1>Website Messages</h1>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Attachments</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg._id}>
                <td>{msg.name}</td>
                <td>{msg.email}</td>
                <td>{msg.message}</td>
                <td>{renderAttachments(msg.attachments)}</td>
                <td>
                  {editingMessageId === msg._id ? (
                    <select
                      name="status"
                      value={editingData.status}
                      onChange={handleEditChange}
                    >
                      <option value="New">New</option>
                      <option value="Closed">Closed</option>
                    </select>
                  ) : (
                    msg.status
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    {editingMessageId === msg._id ? (
                      <>
                        <button
                          className="save-btn"
                          onClick={() => handleUpdateMessage(msg._id)}
                        >
                          <SaveIcon />
                          Save
                        </button>
                        <button className="cancel-btn" onClick={handleCancelEdit}>
                          <CancelIcon />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="edit-btn"
                          onClick={() => handleEditMessage(msg)}
                        >
                          <EditIcon />
                          Edit
                        </button>
                        {msg.status === "Closed" && (
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteMessage(msg._id)}
                          >
                            <DeleteIcon />
                            Delete
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pendingDeleteId && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <p>Are you sure you want to delete this message?</p>
            <div className="confirm-modal-actions">
              <button className="confirm-modal-cancel" onClick={() => setPendingDeleteId(null)}>
                Cancel
              </button>
              <button className="confirm-modal-delete" onClick={confirmDeleteMessage}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
