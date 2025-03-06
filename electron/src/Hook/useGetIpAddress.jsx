import React, { useEffect } from 'react';

const useGetIpAddress = () => {
    useEffect(() => {
        const fetchIp = async () => {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                console.log('Current IP Address:', data.ip);
            } catch (error) {
                console.error('Failed to fetch IP address:', error);
            }
        };

        fetchIp();
    }, []);
};

export default useGetIpAddress;