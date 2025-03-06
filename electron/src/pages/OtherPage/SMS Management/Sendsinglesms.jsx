import React, { useState, useEffect, useContext } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import UseAxiosSecure from '../../../Hook/UseAxioSecure';
import Swal from 'sweetalert2';
import useSendSimpleSms from '../../../config/SMS/SendSimpleSms';
import Mtitle from "/src/components library/Mtitle";
import { AuthContext } from '../../../providers/AuthProvider';

const Sendsinglesms = () => {
    const [name, setName] = useState(''); // New state for name
    const [mobile, setMobile] = useState('');
    const [template, setTemplate] = useState('');
    const [smsBody, setSmsBody] = useState('');
    const [smsType, setSmsType] = useState('text'); // text or unicode
    const [senderId, setSenderId] = useState(''); // Default sender ID
    const axiosSecure = UseAxiosSecure();
    const [templates, setTemplates] = useState([]);
    const [senderIds, setSenderIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const {branch} = useContext(AuthContext);
    const { sendSimpleSms } = useSendSimpleSms();

    useEffect(() => {
        fetchTemplates();
        fetchSenderIds();
    }, []);

    const inputClass = "focus:border-yellow-400 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-4 px-3 leading-tight focus:outline-none focus:shadow-outline"
    const fetchTemplates = () => {
        setLoading(true);
        axiosSecure.get(`/smstemplates/?branch=${branch}`)
            .then(response => {
                setTemplates(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching templates:', error);
                setLoading(false);
            });
    };

    const fetchSenderIds = () => {
        setLoading(true);
        axiosSecure.get(`/senderids/${branch}/get-all`)
            .then(response => {
                setSenderIds(response.data);
                if (response.data.length > 0) {
                    setSenderId(response.data[0].ID); // Set default to the first sender ID
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching sender IDs:', error);
                setLoading(false);
            });
    };

    const handleTemplateChange = (e) => {
        const selectedTemplateId = e.target.value;
        const selectedTemplate = templates.find(template => template._id === selectedTemplateId);
        setTemplate(selectedTemplateId);
        setSmsBody(selectedTemplate ? selectedTemplate.msg : '');
    };

    const validateSms = () => {
        if (!mobile) {
            Swal.fire('Validation Error', 'Mobile number is required', 'error');
            return false;
        }
        if (!/^\d{11}$/.test(mobile)) {
            Swal.fire('Validation Error', 'Enter a valid 11-digit mobile number', 'error');
            return false;
        }
        if (!smsBody) {
            Swal.fire('Validation Error', 'SMS body cannot be empty', 'error');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateSms()) return;

        // Default name to "No Name" if it's not provided
        const finalName = name || "No Name";

        const formattedMobile = '88' + mobile;

        setLoading(true);
        try {
            const responseData = await sendSimpleSms({
                name: finalName,
                campaignName: "singlesms",
                senderid: senderId,
                mobile: formattedMobile,
                message: smsBody,
                TransactionType: "T",
                branch,
                useSwal: true,
            });

            if (responseData) {
                console.log('Response Data:', responseData);
            }

            // Reset form fields
            setName('');
            setMobile('');
            setTemplate('');
            setSmsBody('');
        } catch (error) {
            console.error('Error sending SMS:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSmsTypeChange = (e) => {
        setSmsType(e.target.value);
    };

    const handleSenderIdChange = (e) => {
        setSenderId(e.target.value);
    };

    const getRemainingCharacters = () => {
        const maxChars = smsType === 'text' ? 160 : 70;
        const remaining = maxChars - smsBody.length;
        const smsCount = Math.ceil(smsBody.length / maxChars);

        return {
            remaining,
            smsCount,
            maxChars,
        };
    };

    const { remaining, smsCount, maxChars } = getRemainingCharacters();

    return (
        <div className="p-4 rounded-lg">
            <Mtitle title="Send SMS" ></Mtitle>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Enter Name</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        className={inputClass}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Select Sender ID</span>
                    </label>
                    <select
                        className={inputClass}
                        value={senderId}
                        onChange={handleSenderIdChange}
                    >
                        {senderIds.map(sender => (
                            <option key={sender._id} value={sender.ID}>
                                {sender.ID}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="form-control mt-4">
                <input
                    type="text"
                    placeholder="Enter 11-Digit Mobile Number"
                    className={inputClass}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                />
            </div>
            <div className="form-control mt-4">
                <label className="label">
                    <span className="label-text">Select Template</span>
                </label>
                <select
                   className={inputClass}
                    value={template}
                    onChange={handleTemplateChange}
                >
                    <option value="">Select a template</option>
                    {templates.map((template) => (
                        <option key={template._id} value={template._id}>
                            {template.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-control mt-4">
                <div className="flex space-x-4">
                    <label className="cursor-pointer flex items-center">
                        <input
                            type="radio"
                            name="smsType"
                            value="text"
                            checked={smsType === 'text'}
                            onChange={handleSmsTypeChange}
                            className="radio radio-warning"
                        />
                        <span className="label-text ml-2">Text</span>
                    </label>
                    <label className="cursor-pointer flex items-center">
                        <input
                            type="radio"
                            name="smsType"
                            value="unicode"
                            checked={smsType === 'unicode'}
                            onChange={handleSmsTypeChange}
                            className="radio radio-warning"
                        />
                        <span className="label-text ml-2">Unicode</span>
                    </label>
                </div>
            </div>
            <div className="form-control mt-4">
                <label className="label">
                    <span className="label-text">Enter SMS Content</span>
                </label>
                <textarea
                    className="resize-none focus:border-yellow-400 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full h-16 py-4 px-3 leading-tight focus:outline-none focus:shadow-outline"
                    resize
                    placeholder="Type your message here..."
                    value={smsBody}
                    onChange={(e) => setSmsBody(e.target.value)}
                    maxLength={1000}
                />
                <div className="text-right text-sm mt-2">
                    <span>{remaining} Characters Left | SMS ({maxChars} Char./SMS)</span>
                    <span className="block mt-1 text-gray-500">This message will be sent as {smsCount} SMS{smsCount > 1 ? 'es' : ''}</span>
                </div>
            </div>
            <div className="mt-6 p-4 bg-gray-100 rounded-md">
                <p className="text-sm">
                    The message length for English (GSM 7bit) characters is <strong>160 for regular message</strong> and <strong>153 for multipart message</strong>.<br />
                    GSM extended characters (~^{}[]|€) can be used for the cost of two characters.<br />
                    The message length for Unicode (UCS-2) characters is <strong>70 for regular message</strong> and <strong>67 for multipart message</strong>.<br />
                    Emojis reduce the character limit to <strong>70 characters</strong>, and some Emojis can be used for the cost of <strong>two characters</strong>.
                </p>
            </div>
            <div className="flex justify-end gap-3 items-center mt-6">
                <button
                    className="bg-gray-500 text-white py-2 px-4 font-semibold hover:bg-gray-600 rounded-xl transition duration-300"
                    onClick={() => {
                        setName('');
                        setMobile('');
                        setTemplate('');
                        setSmsBody('');
                    }}
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    className={`bg-yellow-500 text-white py-2 px-4 font-semibold flex  items-center gap-1 hover:bg-yellow-700 rounded-xl transition duration-300 ${loading ? 'loading' : ''}`}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    <FaPaperPlane className="mr-2" /> Submit
                </button>
            </div>
            
        </div>
    );
};

export default Sendsinglesms;
