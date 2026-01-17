'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail,
    Trash2,
    CheckCircle,
    Clock,
    MessageCircle,
    RefreshCw,
    Search,
    ExternalLink,
    Eye,
    X,
    Send
} from 'lucide-react';
import { ContactMessage } from '@/lib/types';
import { getContactMessages, updateContactMessageStatus, deleteContactMessage } from '@/lib/firestore';

export function ContactManager() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'read' | 'replied'>('all');
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

    const loadMessages = async () => {
        setIsLoading(true);
        const data = await getContactMessages();
        setMessages(data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadMessages();
    }, []);

    const handleMarkAsRead = async (messageId: string) => {
        await updateContactMessageStatus(messageId, 'read');
        setMessages(messages.map(m =>
            m.id === messageId ? { ...m, status: 'read' } : m
        ));
        if (selectedMessage?.id === messageId) {
            setSelectedMessage({ ...selectedMessage, status: 'read' });
        }
    };

    const handleMarkAsReplied = async (messageId: string) => {
        await updateContactMessageStatus(messageId, 'replied');
        setMessages(messages.map(m =>
            m.id === messageId ? { ...m, status: 'replied', repliedAt: new Date() } : m
        ));
        if (selectedMessage?.id === messageId) {
            setSelectedMessage({ ...selectedMessage, status: 'replied', repliedAt: new Date() });
        }
    };

    const handleDelete = async (messageId: string) => {
        if (confirm('Are you sure you want to delete this message?')) {
            await deleteContactMessage(messageId);
            setMessages(messages.filter(m => m.id !== messageId));
            if (selectedMessage?.id === messageId) {
                setSelectedMessage(null);
            }
        }
    };

    const openEmailClient = (email: string, subject: string) => {
        const mailtoLink = `mailto:${email}?subject=Re: ${encodeURIComponent(subject)}`;
        window.open(mailtoLink, '_blank');
    };

    const filteredMessages = messages.filter(message => {
        const matchesSearch =
            message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            message.subject.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || message.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const newCount = messages.filter(m => m.status === 'new').length;
    const readCount = messages.filter(m => m.status === 'read').length;
    const repliedCount = messages.filter(m => m.status === 'replied').length;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'new':
                return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">New</span>;
            case 'read':
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Read</span>;
            case 'replied':
                return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Replied</span>;
            default:
                return null;
        }
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-PK', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="font-playfair text-2xl font-bold text-charcoal">Contact Messages</h2>
                    <p className="text-medium-gray mt-1">
                        {messages.length} total messages • {newCount} unread
                    </p>
                </div>
                <button
                    onClick={loadMessages}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal text-white rounded-xl hover:bg-gold-primary transition-all"
                >
                    <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <MessageCircle className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-charcoal">{newCount}</p>
                            <p className="text-sm text-medium-gray">New Messages</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                            <Eye className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-charcoal">{readCount}</p>
                            <p className="text-sm text-medium-gray">Pending Reply</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-charcoal">{repliedCount}</p>
                            <p className="text-sm text-medium-gray">Replied</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email or subject..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-gold-primary focus:ring-1 focus:ring-gold-primary"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'new', 'read', 'replied'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status as any)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterStatus === status
                                    ? 'bg-charcoal text-white'
                                    : 'bg-white text-charcoal border border-gray-200 hover:border-gold-primary'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Messages List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <RefreshCw className="w-8 h-8 text-gold-primary animate-spin" />
                </div>
            ) : filteredMessages.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                    <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-charcoal mb-2">No Messages Found</h3>
                    <p className="text-medium-gray">
                        {searchQuery || filterStatus !== 'all'
                            ? 'Try adjusting your filters'
                            : 'Messages from customers will appear here'
                        }
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        {filteredMessages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${message.status === 'new' ? 'bg-blue-50/50' : ''
                                    }`}
                                onClick={() => {
                                    setSelectedMessage(message);
                                    if (message.status === 'new') {
                                        handleMarkAsRead(message.id);
                                    }
                                }}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className={`font-semibold text-charcoal truncate ${message.status === 'new' ? 'font-bold' : ''
                                                }`}>
                                                {message.name}
                                            </h4>
                                            {getStatusBadge(message.status)}
                                        </div>
                                        <p className="text-sm text-medium-gray truncate">{message.email}</p>
                                        <p className="font-medium text-charcoal mt-2 truncate">{message.subject}</p>
                                        <p className="text-sm text-medium-gray mt-1 line-clamp-2">{message.message}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                        <span className="text-xs text-medium-gray whitespace-nowrap">
                                            {formatDate(message.createdAt)}
                                        </span>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openEmailClient(message.email, message.subject);
                                                }}
                                                className="p-2 text-gray-400 hover:text-gold-primary hover:bg-gold-primary/10 rounded-lg transition-all"
                                                title="Reply via Email"
                                            >
                                                <Send size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(message.id);
                                                }}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Message Detail Modal */}
            <AnimatePresence>
                {selectedMessage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedMessage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h3 className="font-playfair text-2xl font-bold text-charcoal">{selectedMessage.subject}</h3>
                                    <p className="text-medium-gray mt-1">{formatDate(selectedMessage.createdAt)}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                    <div className="w-12 h-12 bg-gold-primary/20 rounded-full flex items-center justify-center">
                                        <span className="text-gold-primary font-semibold text-lg">
                                            {selectedMessage.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-charcoal">{selectedMessage.name}</p>
                                        <a
                                            href={`mailto:${selectedMessage.email}`}
                                            className="text-sm text-gold-primary hover:underline"
                                        >
                                            {selectedMessage.email}
                                        </a>
                                    </div>
                                    <div className="ml-auto">
                                        {getStatusBadge(selectedMessage.status)}
                                    </div>
                                </div>

                                <div className="p-6 bg-gray-50 rounded-2xl">
                                    <p className="text-charcoal whitespace-pre-wrap leading-relaxed">
                                        {selectedMessage.message}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => {
                                            openEmailClient(selectedMessage.email, selectedMessage.subject);
                                            handleMarkAsReplied(selectedMessage.id);
                                        }}
                                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold-primary text-white rounded-xl hover:bg-gold-dark transition-all"
                                    >
                                        <Mail size={18} />
                                        Reply via Email
                                    </button>
                                    {selectedMessage.status !== 'replied' && (
                                        <button
                                            onClick={() => handleMarkAsReplied(selectedMessage.id)}
                                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all"
                                        >
                                            <CheckCircle size={18} />
                                            Mark as Replied
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            handleDelete(selectedMessage.id);
                                            setSelectedMessage(null);
                                        }}
                                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"
                                    >
                                        <Trash2 size={18} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
