import React, { useState, useEffect, useContext } from 'react';
import { FiSend } from 'react-icons/fi';
import axios from 'axios';
import UseAxiosSecure from '../../../Hook/UseAxioSecure';
import Swal from 'sweetalert2';
import useSendSimpleSms from '../../../config/SMS/SendSimpleSms';
import Mtitle from "/src/components library/Mtitle";
import { AuthContext } from '../../../providers/AuthProvider';

const SendGroupSms = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [smsCount, setSmsCount] = useState(0);
    const [messageBody, setMessageBody] = useState('');
    const [campaignName, setCampaignName] = useState('');
    const [senderId, setSenderId] = useState('');
    const [smsTemplate, setSmsTemplate] = useState('');
    const [templates, setTemplates] = useState([]);
    const [senderIds, setSenderIds] = useState([]); // Ensure this is an array
    const [loading, setLoading] = useState(false);
    const axiosSecure = UseAxiosSecure();
    const {branch} = useContext(AuthContext);
    const { sendSimpleSms } = useSendSimpleSms();
    const maxCharactersPerSMS = 160;
    const maxTotalCharacters = 1000;
    const inputClass = "focus:border-yellow-400 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-4 px-3 leading-tight focus:outline-none focus:shadow-outline"
    useEffect(() => {
        fetchGroups();
        fetchTemplates();
        fetchSenderIds();
    }, [branch]);

    const fetchGroups = () => {
        setLoading(true);
        axiosSecure.get(`/smsgroups//${branch}/get-all`)
            .then(response => {
                setGroups(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching groups:', error);
                setLoading(false);
            });
    };
    console.log(groups);

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
                // Ensure the response data is an array
                if (Array.isArray(response.data)) {
                    setSenderIds(response.data);
                    if (response.data.length > 0) {
                        setSenderId(response.data[0].ID); // Set default to the first sender ID
                    }
                } else {
                    console.error('Expected an array for sender IDs but received:', response.data);
                    setSenderIds([]); // Fallback to an empty array
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching sender IDs:', error);
                setLoading(false);
            });
    };

    const handleGroupSelect = (group) => {
        setSelectedGroup(group);
        setSmsCount(group.phoneNumbers.length);
    };

    const handleSend = async () => {
        if (!selectedGroup) {
            Swal.fire({
                icon: 'error',
                title: 'No Group Selected',
                text: 'Please select a group before sending the SMS.',
            });
            return;
        }

        if (!messageBody) {
            Swal.fire({
                icon: 'error',
                title: 'Empty Message',
                text: 'Please enter a message body before sending the SMS.',
            });
            return;
        }

        if (!senderId) {
            Swal.fire({
                icon: 'error',
                title: 'Sender ID Missing',
                text: 'Please select a sender ID before sending the SMS.',
            });
            return;
        }
        if (!campaignName.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Campaign Name Missing',
                text: 'Please enter a campaign name before sending the SMS.',
            });
            return;
        }

        const formattedNumbers = selectedGroup.phoneNumbers.map(contact => {
            let mobile = contact.mobile.trim();

            if (mobile.length === 10) {
                mobile = '0' + mobile;
            }

            if (mobile.length === 11 && mobile.startsWith('0')) {
                mobile = '88' + mobile.substring(1);
            }

            return '880' + mobile.substring(2);
        }).join(',');

        setLoading(true);
        try {
            const responseData = await sendSimpleSms({
                senderid: senderId,
                mobile: formattedNumbers,
                message: messageBody,
                TransactionType: "T",
                branch,
                campaignName,
                useSwal: true,
            });

            if (responseData) {
                console.log('Response Data:', responseData);
            }

            setMessageBody('');
            setSmsTemplate('');
            setSelectedGroup(null);
        } catch (error) {
            console.error('Error sending SMS:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setSelectedGroup(null);
        setSmsCount(0);
        setMessageBody('');
        setCampaignName('');
        setSenderId('');
        setSmsTemplate('');
    };

    const handleSenderIdChange = (e) => {
        setSenderId(e.target.value);
    };

    const handleTemplateChange = (templateId) => {
        setSmsTemplate(templateId);
        const selectedTemplate = templates.find(template => template._id === templateId);
        if (selectedTemplate) {
            setMessageBody(selectedTemplate.msg);
        }
    };

    const handleGroupDropdownChange = (e) => {
        const groupId = e.target.value;
        const selectedGroup = groups.find(group => group._id === groupId);
        handleGroupSelect(selectedGroup);
    };

    const handleMessageBodyChange = (e) => {
        const newText = e.target.value;
        if (newText.length <= maxTotalCharacters) {
            setMessageBody(newText);
        }
    };

    const characterCount = messageBody.length;
    const remainingCharacters = maxTotalCharacters - characterCount;
    const smsCountRequired = Math.ceil(characterCount / maxCharactersPerSMS);
    const totalSmsCount = smsCountRequired * (selectedGroup ? selectedGroup.phoneNumbers.length : 0);

    return (
        <div className="p-4  rounded-xl space-y-6">
            <Mtitle title="Send Group SMS"></Mtitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1">
                    <label className="block text-base-content  mb-2">Campaign Name</label>
                    <input
                        type="text"
                        placeholder="Optional"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        className={inputClass}
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-base-content  mb-2">Sender ID</label>
                    <select
                        value={senderId}
                        onChange={handleSenderIdChange}
                        className={inputClass}
                    >
                        <option value="">Select One</option>
                        {senderIds.map(sender => (
                            <option key={sender._id} value={sender.ID}>
                                {sender.ID}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-span-1">
                    <label className="block text-base-content  mb-2">Select Group</label>
                    <select
                        value={selectedGroup?._id || ''}
                        onChange={handleGroupDropdownChange}
                        className={inputClass}
                    >
                        <option value="">Select a group</option>
                        {groups.map((group) => (
                            <option key={group._id} value={group._id}>
                                {group.groupName} ({group.phoneNumbers.length} numbers)
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-span-1">
                    <label className="block text-base-content  mb-2">SMS Template</label>
                    <select
                         className={inputClass}
                        value={smsTemplate}
                        onChange={(e) => handleTemplateChange(e.target.value)}
                    >
                        <option value="">Select a template</option>
                        {templates.map((template) => (
                            <option key={template._id} value={template._id}>
                                {template.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mt-4">
                <textarea
                    className="resize-none focus:border-yellow-400 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full h-48 py-4 px-3 leading-tight focus:outline-none focus:shadow-outline"
                    rows="6"
                    placeholder="Enter SMS Content"
                    value={messageBody}
                    onChange={handleMessageBodyChange}
                ></textarea>
                <div className="text-right mt-2 text-sm text-gray-500">
                    {characterCount} Characters | {remainingCharacters} Characters Left | SMS ({smsCountRequired} SMS) | Total SMS = {totalSmsCount}
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
                <button onClick={handleClear} className="bg-gray-500 text-white py-2 px-4 font-semibold hover:bg-gray-600 rounded-xl transition duration-300">Clear</button>
                <button onClick={handleSend} className="bg-yellow-500 text-white py-2 px-4 font-semibold flex  items-center gap-1 hover:bg-yellow-700 rounded-xl transition duration-300">
                    <FiSend /> Send
                </button>
            </div>
        </div>
    );
};

export default SendGroupSms;
