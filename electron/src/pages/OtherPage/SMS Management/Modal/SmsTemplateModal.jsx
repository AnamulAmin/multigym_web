import React, { useState, useEffect } from 'react';
import UseAxiosSecure from '../../../../Hook/UseAxioSecure';
import Swal from 'sweetalert2';

const SmsTemplateModal = ({ isOpen, onClose, templateId, onSave, branch }) => {
    const axiosSecure = UseAxiosSecure();
    const [template, setTemplate] = useState({ name: '', msg: '', branch: branch });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (templateId) {
            setLoading(true);
            axiosSecure.get(`/smstemplates/${templateId}`)
                .then(response => {
                    setTemplate(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching template:', error);
                    setLoading(false);
                    Swal.fire("Error", "Failed to fetch template", "error");
                });
        } else {
            setTemplate({ name: '', msg: '', branch: branch }); // Reset form for new template
        }
    }, [templateId, axiosSecure, branch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTemplate({ ...template, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        if (templateId) {
            axiosSecure.put(`/smstemplates/${templateId}`, template)
                .then(() => {
                    onSave();
                    onClose();
                    Swal.fire("Success", "Template updated successfully", "success");
                })
                .catch(error => {
                    console.error('Error updating template:', error);
                    Swal.fire("Error", "Failed to update template", "error");
                })
                .finally(() => setLoading(false));
        } else {
            axiosSecure.post('/smstemplates', template)
                .then(() => {
                    onSave();
                    onClose();
                    Swal.fire("Success", "Template created successfully", "success");
                })
                .catch(error => {
                    console.error('Error creating template:', error);
                    Swal.fire("Error", "Failed to create template", "error");
                })
                .finally(() => setLoading(false));
        }
    };

    const isGsmExtendedChar = (char) => {
        const gsmExtendedChars = '~^{}[]|€';
        return gsmExtendedChars.includes(char);
    };

    const isUnicodeChar = (char) => {
        return char.charCodeAt(0) > 127 && !isGsmExtendedChar(char);
    };

    const isEmoji = (char) => {
        const emojiRegex = /\p{Emoji}/u;
        return emojiRegex.test(char);
    };

    const calculateSmsCount = (text) => {
        let charCount = 0;
        let isUnicode = false;
        let containsEmoji = false;

        for (let char of text) {
            if (isEmoji(char)) {
                containsEmoji = true;
                charCount += 2;
            } else if (isUnicodeChar(char)) {
                isUnicode = true;
                charCount += 1;
            } else if (isGsmExtendedChar(char)) {
                charCount += 2;
            } else {
                charCount += 1;
            }
        }

        if (containsEmoji) {
            return Math.ceil(charCount / 70);
        } else if (isUnicode) {
            return charCount > 70 ? Math.ceil(charCount / 67) : 1;
        } else {
            return charCount > 160 ? Math.ceil(charCount / 153) : 1;
        }
    };

    const charCount = template.msg.length;
    const smsCount = calculateSmsCount(template.msg);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-5 md:p-8 rounded-lg shadow-lg md:w-full w-[90%] md:max-w-lg">
                <h2 className="text-2xl font-semibold mb-4">{templateId ? 'Edit Template' : 'Add New Template'}</h2>
                {loading ? (
                    <div className="text-center py-4">Loading...</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={template.name}
                                onChange={handleChange}
                                required
                                className="focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-4 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Message</label>
                            <textarea
                                name="msg"
                                value={template.msg}
                                onChange={handleChange}
                                required
                                className="focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-4 px-3 leading-tight focus:outline-none focus:shadow-outline resize-none h-40"
                            />
                            <div className="text-right mt-2 text-sm text-gray-600">
                                Characters: {charCount} | SMS: {smsCount}
                            </div>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button type="button" onClick={onClose} className="bg-gray-500 text-white py-2 px-4 font-semibold hover:bg-gray-600 rounded-xl transition duration-300">Cancel</button>
                            <button type="submit" className="bg-yellow-500 text-white py-2 px-4 font-semibold flex  items-center gap-1 hover:bg-yellow-700 rounded-xl transition duration-300">{templateId ? 'Update' : 'Add'}</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SmsTemplateModal;
