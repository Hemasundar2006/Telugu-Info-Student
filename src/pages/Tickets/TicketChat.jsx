import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getUserSupportMessages,
  sendUserSupportMessage,
} from '../../api/chats';
import './Tickets.css';

export default function TicketChat() {
  const { ticketId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  const loadMessages = async () => {
    if (!ticketId) return;
    setError('');
    try {
      const res = await getUserSupportMessages(ticketId);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !ticketId) return;
    setSending(true);
    setError('');
    try {
      const res = await sendUserSupportMessage(ticketId, {
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
        <h1>Ticket Chat</h1>
        <p>Chat with support about this ticket.</p>
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

