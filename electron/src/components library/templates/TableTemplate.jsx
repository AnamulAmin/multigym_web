
const body =
    // copy the <section> only [used as a component to avoid vs code error marks]
    <section className="overflow-x-auto border shadow-sm rounded-xl p-4 mt-5">
        <table className="table w-full">
            <tbody>
                {paginatedData.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-100 hover:rounded-xl">
                        {/* add data as much you want with same class */}
                        <td className="px-4 py-3">{item[0]}</td>


                        {/* Opional Part : If you have to render conditional classes */}
                        {/* <td className="px-4 text-left py-3">
                            <div className='flex justify-start items-center gap-1'>
                                <GoDotFill className={`text-xs ${item.status === 'inactive' ? 'text-[#f70000e0]' : 'text-green-500'}`} />
                                <span>{item.status}</span>
                            </div>
                        </td> */}
                    </tr>
                ))}
            </tbody>
        </table>
        {/* use  Mpagination for pagination and MtableLoading for table loading    */}
    </section>


