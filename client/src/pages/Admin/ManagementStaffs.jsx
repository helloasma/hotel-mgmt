import { useEffect, useState } from "react";
import api from "../../services/api";
import "./ContactMessages.css";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingData, setEditingData] = useState({ status: "" });
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get("/contact-messages");
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
      await api.delete(`/contact-messages/${pendingDeleteId}`);
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
      const response = await api.put(`/contact-messages/${id}`, {
        status: editingData.status,
      });

      setMessages(
        messages.map((msg) => (msg._id === id ? response.data.data : msg))
      );

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
                          Save
                        </button>

                        <button
                          className="cancel-btn"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="edit-btn"
                          onClick={() => handleEditMessage(msg)}
                        >
                          Edit
                        </button>

                        {msg.status === "Closed" && (
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteMessage(msg._id)}
                          >
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
              <button
                className="confirm-modal-cancel"
                onClick={() => setPendingDeleteId(null)}
              >
                Cancel
              </button>

              <button
                className="confirm-modal-delete"
                onClick={confirmDeleteMessage}
              >
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