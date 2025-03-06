import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import UseAxiosSecure from '../../Hook/UseAxioSecure';

const useSendSimpleSms = () => {
    const responseMessages = {
        200: 'The SMS was sent successfully!',
        205: 'The content of the message is invalid.',
        206: 'The mobile number provided is invalid.',
        207: 'The transaction type is invalid.',
        208: 'The sender ID provided is invalid.',
        209: 'The SMS exceeds the maximum allowable length.',
        210: 'The campaign ID provided is invalid.',
        213: 'There is a mismatch in the provided parameters.',
        216: 'Insufficient balance. Please recharge your account.',
        221: 'The SMS failed to send.',
        401: 'Unauthorized access: Your IP has been blacklisted, or the credentials provided are invalid.',
        500: 'An internal server error occurred.',
    };

    const axiosSecure = UseAxiosSecure();

    const sendSimpleSms = async ({name, senderid, campaignName, mobile, message, branch, TransactionType, useSwal = true }) => {
        let status = 'unknown';
        let trxnId = 'N/A';

        const sendCount = mobile.split(',').length;
        const Type = sendCount > 1 ? 2 : 1;

        console.log('Sending SMS with the following details:', {
            mobile,
            message,
            branch,
            TransactionType,
            senderid,
            campaignName,
            Type,
            sendCount,
        });

        try {
            const response = await axios.post('https://www.multigympremium.com/api/sms/send-sms', {
                mobile,
                message,
                TransactionType,
                senderid,
                campaignName,
                Type,
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;
            console.log('Response:', data);
            status = data.status || status;
            trxnId = data.trxnId || trxnId;

            if (data.statusCode === '200') {
                if (useSwal) {
                    Swal.fire('Success', 'Message sent successfully', 'success');
                } else {
                    toast.success('Message sent successfully');
                }
            } else {
                const errorMessage = responseMessages[data.statusCode] || data.message || 'Failed to send SMS';
                if (useSwal) {
                    Swal.fire('Error', errorMessage, 'error');
                } else {
                    toast.error(errorMessage);
                }
            }
            return data;
        } catch (error) {
            console.error('Error sending SMS:', error);
            if (error.response) {
                status = error.response.data.status || 'unknown';
                trxnId = error.response.data.trxnId || 'N/A';
            }
            if (useSwal) {
                Swal.fire('Error', 'An unexpected error occurred while sending SMS', 'error');
            } else {
                toast.error('An unexpected error occurred');
            }
        } finally {
            try {
                if (Type === 1) {
                    await axiosSecure.post("/smslogs/post", {
                        name,
                        mobile,
                        message,
                        branch,
                        status,
                        trxnId,
                    });
                } else if (Type === 2) {
                    await axiosSecure.post("/smscampaigns/post", {
                        campaignName,
                        mobile,
                        message,
                        branch,
                        status,
                        trxnId,
                        sendCount,
                    });
                }
            } catch (logError) {
                console.error('Error logging SMS:', logError);
                toast.error('Failed to log SMS transaction.');
            }
        }
    };

    return { sendSimpleSms };
};

export default useSendSimpleSms;
