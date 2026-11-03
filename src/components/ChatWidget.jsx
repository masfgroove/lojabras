import React, { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

export default function ChatWidget() {
  useEffect(() => {
    // Evita duplicar o chat caso o React reinicie o efeito
    const existingChat = document.getElementById('n8n-chat');
    if (existingChat) return;

    // Injeção dinâmica do estilo CSS personalizado para combinar com a identidade visual da Vitrine Delas
    const styleId = 'n8n-chat-custom-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        :root, #n8n-chat, .chat-window-wrapper {
          --chat--toggle--background: #e11d48 !important; /* Rose-600 */
          --chat--toggle--hover--background: #be123c !important; /* Rose-700 */
          --chat--toggle--active--background: #9f1239 !important;
          --chat--toggle--color: #ffffff !important;
          --chat--toggle--size: 60px !important;

          --chat--color-primary: #171717 !important; /* Neutral-900 */
          --chat--color-primary-shade-50: #262626 !important;
          --chat--color-primary-shade-100: #0a0a0a !important;

          --chat--message--user--background: #e11d48 !important;
          --chat--message--user--color: #ffffff !important;

          --chat--message--bot--background: #262626 !important;
          --chat--message--bot--color: #f5f5f5 !important;

          --chat--color-light: #0a0a0a !important;
          --chat--color-dark: #f5f5f5 !important;

          --chat--border-radius: 8px !important;
          --chat--window--width: 380px !important;
          --chat--window--height: 560px !important;
        }

        .chat-window-wrapper .chat-window-toggle {
          position: relative !important;
        }

        .chat-window-wrapper .chat-window-toggle::after {
          content: '';
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          border-radius: 50% !important;
          background: #e11d48;
          z-index: -1;
          pointer-events: none;
          animation: chatPulse 2.4s ease-out infinite;
        }

        @keyframes chatPulse {
          0%   { transform: scale(1);   opacity: 0.5; }
          70%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        .chat-window-wrapper.chat-window-open .chat-window-toggle::after {
          animation: none;
        }
      `;
      document.head.appendChild(style);
    }

    createChat({
      webhookUrl: 'https://n8n-n8n.yqlkvb.easypanel.host/webhook/e6c249d4-0465-4b53-99a1-2a1616819a1f/chat',
      mode: 'window',
      showWelcomeScreen: false,
      loadPreviousSession: false,
      allowFileUploads: false,
      allowedFilesMimeTypes: '',
      initialMessages: [
        'Olá! Bem-vinda à Vitrine Delas! ✨ Como posso te ajudar com nossos looks ou pedidos hoje?'
      ],
      i18n: {
        en: {
          title: 'Atendimento Vitrine Delas',
          subtitle: 'Fale com nossa assistente virtual',
          footer: '',
          getStarted: 'Nova conversa',
          inputPlaceholder: 'Digite sua dúvida sobre os looks...',
        },
      },
    });
  }, []);

  return null;
}