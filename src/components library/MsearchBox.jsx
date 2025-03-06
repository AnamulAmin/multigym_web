import { TfiSearch } from "react-icons/tfi";

const MsearchBox = ({ placeholder, className }) => {
    // Note : dynamic classes are only applicable for main div not for the search input
    return (
        // Search Bar
        <div>
            <div className={`${className} w-64 border shadow-sm py-2 px-3 bg-white rounded-xl`}>
                <div className='flex items-center gap-2'>
                    <TfiSearch className='text-2xl font-bold text-gray-500' />
                    <input type="text" className='outline-none w-full' placeholder={placeholder} />
                </div>
            </div>
        </div>
    );
};

export default MsearchBox;
