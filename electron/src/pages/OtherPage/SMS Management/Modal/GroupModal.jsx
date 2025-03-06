import React, { useState, useEffect } from 'react';
import UseAxiosSecure from '../../../../Hook/UseAxioSecure';
import Mpagination from '../../../../components library/Mpagination';

const GroupModal = ({ isOpen, onClose, onSubmit, initialData, branch }) => {
    const [formData, setFormData] = useState({
        groupName: '',
        phoneNumbers: [], // Initialize as array of objects
        branch: branch || '',
        type: 'custom',
        status: 'active',
    });

    const [type, setType] = useState('active');
    const [status, setStatus] = useState('');
    const [packageType, setPackageType] = useState('All Packages');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [packages, setPackages] = useState([]);
    const [members, setMembers] = useState([]);
    const [selectedCount, setSelectedCount] = useState(0); // New state to track selected members
    const [selectAll, setSelectAll] = useState(false); // New state for select all
    const axiosSecure = UseAxiosSecure();
    



    useEffect(() => {
        axiosSecure.get('/package/shia/names')
            .then(response => setPackages(response.data))
            .catch(error => console.error("Error fetching packages!", error));
    }, []);

    useEffect(() => {
        if ((type === 'member' || type === 'staff') && status) {
            axiosSecure.get(`/users/status/${status}/role/${type}`)
                .then(response => {
                    setMembers(response.data);

                    // Auto-select members if they were previously selected in initialData
                    if (initialData && initialData.phoneNumbers) {
                        const selectedMembers = response.data.filter(member =>
                            initialData.phoneNumbers.some(phoneNumber => phoneNumber.mobile === member.contact_no)
                        );

                        // Set the selected members in formData
                        setFormData(prevData => ({
                            ...prevData,
                            phoneNumbers: selectedMembers.map(member => ({ name: member.full_name, mobile: member.contact_no }))
                        }));

                        // Update selectedCount based on the number of selected members
                        setSelectedCount(selectedMembers.length);
                    }
                })
                .catch(error => console.error(`Error fetching ${type} data!`, error));
        }
    }, [type, status, initialData, axiosSecure]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                branch: branch || initialData.branch,
                phoneNumbers: initialData.phoneNumbers.map(num => ({ ...num })),
            });
            setType(initialData.type);
            setStatus(initialData.status);
        } else {
            setFormData({
                groupName: '',
                phoneNumbers: [],
                branch: branch || '',
                type: 'custom',
                status: 'active',
            });
            setType('custom');
            setStatus('active');
        }
    }, [initialData, branch]);

    useEffect(() => {
        if (selectAll) {
            const selectedMembers = members.filter(member => member.full_name.toLowerCase().includes(searchKeyword.toLowerCase()));
            setFormData(prevData => ({
                ...prevData,
                phoneNumbers: selectedMembers.map(member => ({ name: member.full_name, mobile: member.contact_no }))
            }));
            setSelectedCount(selectedMembers.length);
        } else {
            setFormData(prevData => ({
                ...prevData,
                phoneNumbers: []
            }));
            setSelectedCount(0);
        }
    }, [selectAll, searchKeyword, members]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));

        if (name === 'type') {
            setType(value);
        }

        if (name === 'status') {
            setStatus(value);
        }

        if (name === 'packageType') {
            setPackageType(value);
        }

        if (name === 'searchKeyword') {
            setSearchKeyword(value);
        }
    };

    const addPhoneNumberFromInput = (newname, number) => {
        setFormData(prevData => ({
            ...prevData,
            phoneNumbers: [...prevData.phoneNumbers, { name: newname, mobile: number }]
        }));
        setSelectedCount(prevCount => prevCount + 1);
    };

    const removePhoneNumberFromInput = (number) => {
        setFormData(prevData => ({
            ...prevData,
            phoneNumbers: prevData.phoneNumbers.filter(
                phoneNumber => phoneNumber.mobile !== number
            ),
        }));
        setSelectedCount(prevCount => prevCount - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit(formData);
    };

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
    };

    const { paginatedData, paginationControls, rowsPerPageAndTotal } = Mpagination({ totalData: members });

    return (
        <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box">
                <h3 className="font-semibold text-2xl mb-3">{initialData ? 'Edit Group' : 'Add New Group'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-normal mb-2 text-gray-700">Group Name</label>
                        <input
                            type="text"
                            name="groupName"
                            value={formData.groupName}
                            onChange={handleChange}
                            className="focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-4 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-normal mb-2 text-gray-700">Type</label>
                        <select
                            name="type"
                            value={type}
                            onChange={handleChange}
                            className="select select-bordered focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="custom">Custom Number</option>
                            <option value="member">Member Number</option>
                            <option value="staff">Staff Number</option>
                        </select>
                    </div>
                    {type !== 'custom' && (
                        <>
                            <div className='flex gap-3 justify-between'>
                                <div className='w-full'>
                                    <label className="block text-sm mb-2 text-gray-700">Package Type</label>
                                    <select
                                        name="packageType"
                                        value={packageType}
                                        onChange={handleChange}
                                        className="select select-bordered focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        {packages.map(pkg => (
                                            <option key={pkg._id} value={pkg.name}>{pkg.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='w-full'>
                                    <label className="block text-sm mb-2 text-gray-700">Status</label>
                                    <select
                                        name="status"
                                        value={status}
                                        onChange={handleChange}
                                        className="select select-bordered focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="All">All (Active + Inactive)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm mb-2 text-gray-700">Search</label>
                                <input
                                    type="text"
                                    name="searchKeyword"
                                    value={searchKeyword}
                                    onChange={handleChange}
                                    className=" focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Enter search keyword"
                                />
                            </div>
                            <div className='flex items-center justify-between px-1'>
                                <div className='flex items-center'>
                                    <input
                                        type="checkbox"
                                        className="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                    />
                                    <label className="ml-2">Select All</label>
                                </div>
                                <span className="ml-4">Selected : {selectedCount}</span>
                            </div>
                            <div>
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr>
                                            <td className="px-4 py-2">Name</td>
                                            <td className="px-4 py-2">Mobile No.</td>
                                            <td className="px-4 py-2">Action</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData.filter(member => member.full_name.toLowerCase().includes(searchKeyword.toLowerCase())).map((member, index) => (
                                            <tr key={index}>
                                                <td className="border px-4 py-2 w-36">{member.full_name}</td>
                                                <td className="border px-4 py-2">{member.contact_no}</td>
                                                <td className="border px-4 py-2">
                                                    <input
                                                        type="checkbox"
                                                        className="checkbox"
                                                        checked={formData.phoneNumbers.some(phoneNumber => phoneNumber.mobile === member.contact_no)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                addPhoneNumberFromInput(member.full_name, member.contact_no);
                                                            } else {
                                                                removePhoneNumberFromInput(member.contact_no);
                                                            }
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                                <div onClick={(e) => e.preventDefault() /* Prevent form submission */}>
                                    {paginationControls}
                                </div>
                            </div>
                        </>
                    )}
                    {type === 'custom' && (
                        <div className="flex flex-col">
                            <div className="">
                                <label className="block text-sm font-normal mb-2 text-gray-700">Enter Mobile No : </label>
                                <textarea
                                    placeholder="Enter or paste mobile numbers here"
                                    rows={10}
                                    defaultValue={formData.phoneNumbers.map(num => num.mobile).join('\n')}
                                    onChange={(e) => {
                                        const phoneNumbers = e.target.value.split(/\r?\n/).filter(num => num.trim() !== '');
                                        setFormData(prevData => ({
                                            ...prevData,
                                            phoneNumbers: phoneNumbers.map(num => ({ name: '', mobile: num.trim() }))
                                        }));
                                    }}
                                    className="focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-4 px-3 leading-tight focus:outline-none focus:shadow-outline resize-none"
                                ></textarea>
                            </div>
                            <div className="">
                                {/* <label className="block text-sm font-medium text-gray-700">Instruction</label> */}
                                <p className="text-sm text-gray-500 ml-1 pb-2">
                                    Please, press enter after every single mobile no<br />
                                    {/* Example: 01715384539 */}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="modal-action">
                        <button type="button" className="bg-gray-500 text-white py-2 px-4 font-semibold hover:bg-gray-600 rounded-xl transition duration-300" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="bg-yellow-500 text-white py-2 px-4 font-semibold flex  items-center gap-1 hover:bg-yellow-700 rounded-xl transition duration-300">
                            {initialData ? 'Save Changes' : 'Add Group'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GroupModal;
