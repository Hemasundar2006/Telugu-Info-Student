import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getAdminSuperAdminMessages,
  sendAdminSuperAdminMessage,
} from '../../api/chats';
import '../Tickets/Tickets.css';

export default function AdminSuperAdminChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  const loadMessages = async () => {
    setError('');
    try {
      const res = await getAdminSuperAdminMessages();
      setMessages(res?.data || []);
    } catch (err) {
      setError(err?.error || err?.message || 'Failed to load chat messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    setError('');
    try {
      const res = await sendAdminSuperAdminMessage({
        message: message.trim(),
        attachments: [],
      });
      if (res?.data) {
        setMessages((prev) => [...prev, res.data]);
      }
      setMessage('');
    } catch (err) {
      setError(err?.error || err?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const currentUserId = user?._id;

  return (
    <div className="chat-page">
      <div className="chat-header">
        <h1>Admin ↔ Super Admin Chat</h1>
        <p>Private internal channel between admin and super admin.</p>
      </div>

      <div className="chat-card">
        {error && <div className="chat-alert chat-alert-error">{error}</div>}

        <div className="chat-messages">
          {loading ? (
            <p className="chat-empty">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="chat-empty">No messages yet. Start the conversation.</p>
          ) : (
            messages.map((msg) => {
              const isMe =
                currentUserId && msg.from && msg.from._id === currentUserId;
              return (
                <div
                  key={msg._id}
                  className={`chat-message-row ${isMe ? 'me' : 'them'}`}
                >
                  <div className="chat-message-bubble">
                    <div className="chat-message-meta">
                      <span className="chat-message-from">
                        {msg.from?.name || msg.fromRole || 'Unknown'}
                      </span>
                      <span className="chat-message-role">{msg.fromRole}</span>
                      <span className="chat-message-time">
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleString()
                          : ''}
                      </span>
                    </div>
                    <div className="chat-message-text">{msg.message}</div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <form className="chat-input-bar" onSubmit={handleSend}>
          <textarea
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit" disabled={sending || !message.trim()}>
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

