import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, X } from './icons';
import { GoogleGenAI, Chat } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AI_Assistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const inputRef = useRef<null | HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    useEffect(() => {
        if(isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const apiKey = import.meta.env.VITE_API_KEY;
        if (!apiKey) {
            console.error("VITE_GEMINI_API_KEY not found. Please set it in your .env file.");
            setMessages([{ role: 'model', text: 'Error de configuración: La clave de API de Gemini no fue encontrada.' }]);
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey });
            const chatSession = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: 'You are an expert assistant for NominaDO, a payroll management platform for the Dominican Republic. You help users understand Dominican labor laws, navigate the app, and answer questions about payroll. Be concise and helpful. Format your answers clearly, using markdown for lists (*), and bolding (**text**). All monetary values should be in Dominican Pesos (DOP).',
                },
            });
            setChat(chatSession);
            setMessages([{ role: 'model', text: '¡Hola! Soy tu asistente de IA. ¿Cómo puedo ayudarte con tu nómina hoy?' }]);
        } catch (error) {
            console.error("Error initializing Gemini:", error);
            setMessages([{ role: 'model', text: 'No se pudo inicializar el Asistente de IA. Por favor, verifica la configuración de la API Key.' }]);
        }
    }, []);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chat) return;

        const userMessage: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const responseStream = await chat.sendMessageStream({ message: currentInput });
            
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);
            
            for await (const chunk of responseStream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = modelResponse;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Error sending message to Gemini:", error);
            setMessages(prev => [...prev, { role: 'model', text: 'Lo siento, he encontrado un error. Por favor, intenta de nuevo.' }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const toggleChat = () => setIsOpen(prev => !prev);
    
    // Simple markdown to HTML converter for safety
    const renderMessage = (text: string) => {
        const html = text
            .replace(/</g, "&lt;").replace(/>/g, "&gt;") // Escape HTML tags
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
            .replace(/`([^`]+)`/g, '<code>$1</code>') // Inline code
            .replace(/\n/g, '<br />'); // Newlines
        return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
    };

    return (
        <>
            {/* Chat Window */}
            <div className={`fixed bottom-24 right-6 w-96 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col transform transition-all duration-300 ease-in-out z-40 h-[600px] max-h-[70vh] ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <header className="flex items-center justify-between p-4 border-b bg-light rounded-t-2xl">
                    <div className="flex items-center">
                         <Sparkles className="w-6 h-6 text-secondary" />
                         <h3 className="font-heading font-bold text-lg text-primary ml-2">Asistente IA</h3>
                    </div>
                    <button onClick={toggleChat} className="p-1 text-gray-400 hover:text-primary rounded-full hover:bg-gray-200">
                        <X className="w-5 h-5" />
                    </button>
                </header>

                <div className="flex-1 min-h-0 p-4 space-y-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && <Sparkles className="w-6 h-6 text-secondary flex-shrink-0 mb-1" />}
                            <div className={`px-4 py-2 rounded-2xl max-w-xs md:max-w-sm break-words ${msg.role === 'user' ? 'bg-secondary text-white rounded-br-lg' : 'bg-gray-100 text-gray-800 rounded-bl-lg'}`}>
                                {renderMessage(msg.text)}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-end gap-2 justify-start">
                            <Sparkles className="w-6 h-6 text-secondary flex-shrink-0 mb-1" />
                            <div className="px-4 py-2 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-lg">
                                <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t">
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Pregúntame algo..."
                            disabled={isLoading}
                            className="w-full pl-4 pr-12 py-2 bg-light border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary/50 transition"
                        />
                        <button type="submit" disabled={isLoading} className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-secondary text-white rounded-full hover:bg-secondary/90 disabled:bg-gray-400 transition-all">
                            <Send className="w-5 h-5"/>
                        </button>
                    </div>
                </form>
            </div>

            {/* FAB */}
            <button
                onClick={toggleChat}
                className="fixed bottom-6 right-6 w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary/90 transform hover:scale-110 transition-all z-50"
                aria-label="Toggle AI Assistant"
            >
                {isOpen ? <X className="w-7 h-7" /> : <Sparkles className="w-7 h-7" />}
            </button>
        </>
    );
};

export default AI_Assistant;