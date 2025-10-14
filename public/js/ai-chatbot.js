class ChatBot {
    constructor() {
        this.apiUrl = 'http://localhost:5000'; // This should point to your Python Flask chatbot service
        this.sessionId = this.generateSessionId();
        this.customerName = document.getElementById('customerName').textContent;
        
        this.initializeElements();
        this.bindEvents();
        this.checkServerStatus();
        this.messageInput.focus();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    initializeElements() {
        this.messagesContainer = document.getElementById('messagesContainer');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.statusDot = this.statusIndicator.querySelector('.status-dot');
        this.statusText = this.statusIndicator.querySelector('.status-text');
        this.customerNameDisplay = document.getElementById('customerName');
        this.charCount = document.getElementById('charCount');
        this.thinkingIndicator = document.getElementById('thinkingIndicator');
    }

    bindEvents() {
        // Message input events
        this.messageInput.addEventListener('input', () => {
            this.updateCharCount();
            this.toggleSendButton();
        });

        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Button events
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.resetBtn.addEventListener('click', () => this.resetConversation());
    }

    updateCharCount() {
        const length = this.messageInput.value.length;
        this.charCount.textContent = length;
        
        if (length > 450) {
            this.charCount.style.color = '#e53e3e';
        } else if (length > 400) {
            this.charCount.style.color = '#dd6b20';
        } else {
            this.charCount.style.color = '#718096';
        }
    }

    toggleSendButton() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendBtn.disabled = !hasText;
    }

    updateStatus(status, text) {
        this.statusDot.className = `status-dot ${status}`;
        this.statusText.textContent = text;
    }

    async checkServerStatus() {
        try {
            this.updateStatus('connecting', 'Connecting...');
            const response = await fetch(`${this.apiUrl}/health`);
            
            if (response.ok) {
                const data = await response.json();
                this.updateStatus('', 'Connected');
                console.log('Chatbot server status:', data);
            } else {
                throw new Error('Chatbot server responded with error');
            }
        } catch (error) {
            console.error('Chatbot server connection failed:', error);
            this.updateStatus('error', 'Connection failed');
            this.showError('Unable to connect to AI chatbot server. Please make sure the Python service is running on port 5000.');
        }
    }

    showLoading() {
        this.thinkingIndicator.classList.add('show');
        this.sendBtn.disabled = true;
        this.messageInput.disabled = true;
    }

    hideLoading() {
        this.thinkingIndicator.classList.remove('show');
        this.sendBtn.disabled = false;
        this.messageInput.disabled = false;
        this.toggleSendButton();
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        this.messageInput.value = '';
        this.updateCharCount();
        this.toggleSendButton();

        // Show loading
        this.showLoading();

        try {
            const response = await fetch(`${this.apiUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    customer_name: this.customerName,
                    session_id: this.sessionId
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            // Add bot response to chat
            this.addMessage(data.response, 'bot');
            
        } catch (error) {
            console.error('Chat error:', error);
            this.addMessage(
                "I'm sorry, I encountered an error processing your request. Please try again or check if the AI chatbot service is running.", 
                'bot',
                true
            );
        } finally {
            this.hideLoading();
            this.messageInput.focus();
        }
    }

    addMessage(content, sender, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        if (sender === 'bot') {
            const avatar = document.createElement('div');
            avatar.className = 'bot-avatar';
            avatar.textContent = isError ? '⚠️' : '🤖';

            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            if (isError) {
                contentDiv.classList.add('error-message');
            }
            
            // Handle markdown-like formatting
            contentDiv.innerHTML = this.formatMessage(content);

            messageDiv.appendChild(avatar);
            messageDiv.appendChild(contentDiv);
        } else {
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.textContent = content;

            const avatar = document.createElement('div');
            avatar.className = 'user-avatar';
            avatar.textContent = this.customerName.charAt(0).toUpperCase();

            messageDiv.appendChild(contentDiv);
            messageDiv.appendChild(avatar);
        }

        // Remove welcome message if it exists
        const welcomeMessage = this.messagesContainer.querySelector('.welcome-message');
        if (welcomeMessage && sender === 'user') {
            welcomeMessage.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => welcomeMessage.remove(), 300);
        }

        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatMessage(message) {
        // Basic formatting for bot messages
        return message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="message-image" loading="lazy">')
            .replace(/\n/g, '<br>')
            .replace(/`(.*?)`/g, '<code>$1</code>');
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }

    async resetConversation() {
        if (!confirm('Are you sure you want to reset the conversation?')) {
            return;
        }

        try {
            const response = await fetch(`${this.apiUrl}/chat/reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session_id: this.sessionId
                })
            });

            if (response.ok) {
                // Clear messages except welcome
                const messages = this.messagesContainer.querySelectorAll('.message');
                messages.forEach(msg => {
                    if (!msg.classList.contains('welcome-message')) {
                        msg.remove();
                    }
                });

                // Show welcome message if hidden
                const welcomeMessage = this.messagesContainer.querySelector('.welcome-message');
                if (!welcomeMessage) {
                    location.reload(); // Simple way to restore welcome message
                } else {
                    welcomeMessage.style.display = 'flex';
                }

                this.addMessage("Conversation reset! How can I help you?", 'bot');
            } else {
                throw new Error('Failed to reset conversation');
            }
        } catch (error) {
            console.error('Reset error:', error);
            this.showError('Failed to reset conversation. Please try again.');
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Insert at the top of messages
        this.messagesContainer.insertBefore(errorDiv, this.messagesContainer.firstChild);
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            errorDiv.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => errorDiv.remove(), 300);
        }, 8000);
    }
}

// CSS animation for fade out
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
    
    code {
        background: #f1f5f9;
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
        font-size: 0.9em;
    }
`;
document.head.appendChild(style);

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.chatBot = new ChatBot();
});

// Handle page visibility for better UX
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.chatBot) {
        window.chatBot.checkServerStatus();
    }
});