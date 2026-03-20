import { useEffect, useRef, useState } from 'react';
import { chapterMemberCount, chatMessagesSeed } from '../data';
import type { ChatMessage } from '../types';

const simulatedMessage: ChatMessage = {
  author: 'Sarah Miller',
  avatar:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
  text: 'Just confirmed 3 new referrals from last week\'s swap! This chapter is on fire 🔥',
  time: '',
};

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNewMessage: () => void;
}

export function ChatPanel({ isOpen, onClose, onNewMessage }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(chatMessagesSeed);
  const [draft, setDraft] = useState('');
  const hasSimulated = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  // Simulate an incoming message once after the user has closed the panel
  useEffect(() => {
    if (isOpen || hasSimulated.current) return;

    const timeout = setTimeout(() => {
      hasSimulated.current = true;
      const time = new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true,
        minute: '2-digit',
      });
      setMessages((current) => [...current, { ...simulatedMessage, time }]);
      onNewMessage();
    }, 12000);

    return () => clearTimeout(timeout);
  }, [isOpen, onNewMessage]);

  const sendMessage = () => {
    const nextValue = draft.trim();
    if (!nextValue) return;

    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true,
      minute: '2-digit',
    });

    setMessages((current) => [
      ...current,
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
    <>
      <div
        aria-hidden={!isOpen}
        className={`chat-panel-backdrop${isOpen ? ' is-visible' : ''}`}
        onClick={onClose}
        role="presentation"
      />
      <aside
        aria-label="Chapter Chat"
        className={`chat-panel${isOpen ? ' is-open' : ''}`}
      >
        <div className="chat-panel-header">
          <h2>FRAP Chapter Chat</h2>
          <span className="chat-members">{chapterMemberCount} members</span>
          <button
            aria-label="Close chat"
            className="chat-panel-close"
            onClick={onClose}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="chat-messages" ref={messagesRef}>
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
            onChange={(e) => setDraft(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage();
            }}
            placeholder="Type a message..."
            ref={inputRef}
            type="text"
            value={draft}
          />
          <button
            className="chat-send-btn"
            onClick={sendMessage}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
}
