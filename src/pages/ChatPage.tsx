import { useEffect, useRef, useState } from 'react';
import { AppLayout } from '../components/Layout';
import { chapterMemberCount, chatMessagesSeed } from '../data';
import type { ChatMessage } from '../types';

export function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(chatMessagesSeed);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    const nextValue = draft.trim();
    if (!nextValue) {
      return;
    }

    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true,
      minute: '2-digit',
    });

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        author: 'You',
        avatar:
          'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face',
        own: true,
        text: nextValue,
        time: timestamp,
      },
    ]);
    setDraft('');
  };

  return (
    <AppLayout
      activeNav="chat"
      navVariant="chapter"
      title="Chapter Chat | Profit Academy"
    >
      <section className="view-section active" id="chatView">
        <div className="chat-container">
          <div className="chat-header">
            <h2>FRAP Chapter Chat</h2>
            <span className="chat-members">{chapterMemberCount} members</span>
          </div>
          <div className="chat-messages" id="chatMessages" ref={messagesRef}>
            {messages.map((message, index) => (
              <div
                className={`message ${message.own ? 'own' : ''}`}
                key={`${message.author}-${message.time}-${index}`}
              >
                <img
                  src={message.avatar}
                  alt={message.author}
                  className="message-avatar"
                />
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-author">{message.author}</span>
                    <span className="message-time">{message.time}</span>
                  </div>
                  <p className="message-text">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="chat-input-container">
            <input
              className="chat-input"
              id="chatInput"
              onChange={(event) => setDraft(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  sendMessage();
                }
              }}
              placeholder="Type a message..."
              ref={inputRef}
              type="text"
              value={draft}
            />
            <button
              className="chat-send-btn"
              id="chatSendBtn"
              onClick={sendMessage}
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
