import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! How can I help you with our website today?', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;
  const CHATBOT_ENABLED = process.env.REACT_APP_CHATBOT_ENABLED !== 'false'; // Enable by default

  const systemPrompt = `You are a helpful AI assistant for this Lead Management website. Your primary role is to assist visitors with information about our website, services, and general inquiries.

**WEBSITE KNOWLEDGE BASE:**
- **About**: This is a Lead Management System that helps businesses track, manage, and convert leads effectively
- **Services**: Lead tracking, contact management, dashboard analytics, user authentication, lead conversion tracking
- **Features**: User registration/login, secure dashboard, lead management table, email verification, password reset
- **Navigation**: Home page (landing), About Us (company info), Login/Signup (authentication), Dashboard (lead management)
- **Contact**: Available through the website's contact forms and user registration system
- **Technology**: Built with React.js, featuring responsive design and modern UI

**RESPONSE GUIDELINES:**
1. **Website-First**: Always prioritize website-related information about lead management
2. **Be Specific**: Reference exact page locations and features when possible
3. **Stay Helpful**: For non-website questions, provide useful general information
4. **Keep Concise**: Responses should be helpful but not overly long
5. **Professional Tone**: Maintain a friendly, professional demeanor suitable for business users
6. **Format Clearly**: Use numbered lists, bullet points, and **bold text** for better readability
7. **Structure Content**: Use line breaks and paragraphs to make responses easy to scan

**FORMATTING GUIDELINES:**
- Use **bold** for important terms and features
- Use numbered lists (1. **Feature**: Description) for step-by-step information
- Use bullet points for feature lists
- Add line breaks between different topics
- Keep paragraphs short and focused

**RESPONSE PATTERNS:**
- Website questions: "Based on our Lead Management system, you can find [info] in the [section/page]..."
- Navigation help: "You can access [feature] by clicking on [menu item] in the navigation..."
- Feature questions: "Our system provides [feature] which allows you to [functionality]..."
- Generic questions: "While I'm here to help with website questions, here's some general information..."
- Unknown topics: "I don't have specific details about that on our website, but generally speaking..."

**EXAMPLE RESPONSES:**
- "What is this website about?" → "This is a **Lead Management System** designed to help businesses track and manage their leads effectively. You can learn more on our About page..."
- "How do I get started?" → "You can get started by creating an account using the **Sign Up** button in the navigation, then access your dashboard to begin managing leads..."
- "What features do you offer?" → "Our Lead Management system offers:

1. **Lead Tracking**: Monitor leads in real-time and track their progress
2. **Contact Management**: Store and manage lead contact details securely  
3. **Dashboard Analytics**: Gain insights into lead performance and conversion rates
4. **User Authentication**: Securely log in to access your personalized dashboard

You can explore these features by signing up and accessing the **Dashboard** section."
- "How do I contact support?" → "You can reach out through our contact forms available on the website, or create an account to access additional support features..."

Remember: Be conversational, helpful, and always guide users to relevant website sections when applicable. Focus on lead management and business productivity benefits.`;

  const sendMessage = async (message) => {
    if (!message.trim() || isLoading) return;

    // Check if API key is available
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'undefined' || OPENROUTER_API_KEY.trim() === '') {
      console.error('OpenRouter API key is missing or invalid');
      setMessages(prev => [...prev, {
        role: 'bot',
        content: 'Sorry, the chatbot service is currently unavailable due to configuration issues. Please contact our support team for assistance.',
        timestamp: new Date()
      }]);
      setIsLoading(false);
      return;
    }

    const userMessage = { 
      role: 'user', 
      content: message, 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Lead Management Chatbot'
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo', // Changed to a more common model
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.slice(-10).map(msg => ({
              role: msg.role === 'bot' ? 'assistant' : 'user',
              content: msg.content
            })),
            { role: 'user', content: message }
          ],
          max_tokens: 300,
          temperature: 0.7,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        
        if (response.status === 401) {
          throw new Error('Authentication failed - Please check your OpenRouter account and API key permissions');
        } else if (response.status === 402) {
          throw new Error('Insufficient credits - Please add credits to your OpenRouter account');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded - Please wait a moment and try again');
        }
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      const botResponse = {
        role: 'bot',
        content: data.choices[0].message.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Chatbot error:', error);
      
      // Provide more helpful fallback responses based on the error
      let fallbackMessage;
      
      if (error.message.includes('Authentication failed')) {
        fallbackMessage = 'I apologize, but the chatbot service is temporarily unavailable due to authentication issues. However, I can help you with some common questions:\n\n• **Getting Started**: Click "Sign Up" to create an account and access the dashboard\n• **Lead Management**: Use the dashboard to add, edit, and track your leads\n• **Support**: Contact our team through the website contact forms\n\nIs there anything specific about our lead management features you\'d like to know?';
      } else if (error.message.includes('credits')) {
        fallbackMessage = 'The chatbot service has reached its usage limit, but I can still help! Our Lead Management system offers:\n\n• **Lead Tracking**: Monitor and organize all your leads\n• **Dashboard Analytics**: View lead statistics and performance\n• **User Management**: Secure login and personal workspaces\n\nPlease explore the website or contact support for more detailed assistance.';
      } else {
        fallbackMessage = 'I\'m experiencing some technical difficulties, but I can still provide basic information about our Lead Management system:\n\n• **Sign up** to get started with lead tracking\n• **Dashboard** provides analytics and lead management\n• **Secure** user authentication and data protection\n\nFor detailed help, please explore our website sections or contact support.';
      }
      
      setMessages(prev => [...prev, {
        role: 'bot',
        content: fallbackMessage,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ 
      role: 'bot', 
      content: 'Hello! How can I help you with our website today?', 
      timestamp: new Date() 
    }]);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageContent = (content) => {
    // Split content by double line breaks for paragraphs
    const paragraphs = content.split('\n\n');
    
    return paragraphs.map((paragraph, paragraphIndex) => {
      // Split each paragraph by single line breaks
      const lines = paragraph.split('\n');
      
      return (
        <div key={paragraphIndex} className="message-paragraph">
          {lines.map((line, lineIndex) => {
            // Check if line starts with a number (ordered list)
            const numberedListMatch = line.match(/^(\d+)\.\s*\*\*(.*?)\*\*:\s*(.*)/);
            if (numberedListMatch) {
              const [, number, title, description] = numberedListMatch;
              return (
                <div key={lineIndex} className="message-list-item numbered">
                  <span className="list-number">{number}.</span>
                  <span className="list-content">
                    <strong>{title}</strong>: {description}
                  </span>
                </div>
              );
            }

            // Check if line starts with bullet point
            const bulletMatch = line.match(/^[-•]\s*\*\*(.*?)\*\*:\s*(.*)/);
            if (bulletMatch) {
              const [, title, description] = bulletMatch;
              return (
                <div key={lineIndex} className="message-list-item bulleted">
                  <span className="list-bullet">•</span>
                  <span className="list-content">
                    <strong>{title}</strong>: {description}
                  </span>
                </div>
              );
            }

            // Handle bold text with **text**
            const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
            // If it's an empty line, render a line break
            if (line.trim() === '') {
              return <br key={lineIndex} />;
            }

            return (
              <div 
                key={lineIndex} 
                className="message-line"
                dangerouslySetInnerHTML={{ __html: formattedLine }}
              />
            );
          })}
        </div>
      );
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Don't render chatbot if disabled
  if (!CHATBOT_ENABLED) {
    return null;
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <div 
        className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? 'Close chat' : 'Open chat'}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? '✕' : '💬'}
      </div>

      {/* Chat Window */}
      <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-title">
            <h3>Lead Management Assistant</h3>
            <span className="chatbot-status">Online</span>
          </div>
          <div className="chatbot-actions">
            <button 
              onClick={clearChat} 
              title="Clear chat" 
              className="clear-btn"
              aria-label="Clear chat history"
            >
              🗑️
            </button>
            <button 
              onClick={() => setIsOpen(false)} 
              title="Close" 
              className="close-btn"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="chatbot-messages" role="log" aria-live="polite">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.role === 'user' ? 'user' : 'bot'}`}
            >
              <div className="message-content">
                {formatMessageContent(message.content)}
              </div>
              <div className="message-time">
                {formatTime(message.timestamp)}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message bot">
              <div className="message-content typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(inputValue)}
            placeholder="Ask about our lead management system..."
            disabled={isLoading}
            maxLength={500}
            aria-label="Type your message"
          />
          <button 
            onClick={() => sendMessage(inputValue)}
            disabled={isLoading || !inputValue.trim()}
            className="send-btn"
            aria-label="Send message"
          >
            {isLoading ? '⏳' : '➤'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
