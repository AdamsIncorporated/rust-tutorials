import React, { useEffect, useState } from 'react';
import Chart from './Chart';

const Table = ({ activeSection }) => {
    const [data, setData] = useState([]);
    const [showMenu, setShowMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [selectedRow, setSelectedRow] = useState(null);

    useEffect(() => {
        if (activeSection !== null) {
            const fetchData = async () => {
                try {
                    const response = await fetch("/api/read", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            exercise: activeSection,
                        }),
                    });
                    const result = await response.json();
                    setData(result.lifts);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchData();
        } else {
            setData([]);
        }
    }, [activeSection]);

    const formatDate = (dateString) => {
        const date = new Date(dateString.replace(" ", "T"));
        const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', optionsDate);

        return formattedDate;
    };

    const handleContextMenu = (e, row) => {
        e.preventDefault();
        setMenuPosition({ top: e.clientY, left: e.clientX });
        setSelectedRow(row);
        setShowMenu(true);
    };

    const handleMenuItemClick = (action) => {
        setShowMenu(false);
        if (action === 'edit') {
            console.log('Edit row:', selectedRow);
            // Implement edit logic here
        } else if (action === 'delete') {
            console.log('Delete row:', selectedRow);
            // Implement delete logic here
        }
    };

    return (
        <div className="flex flex-row mt-10 justify-between gap-5 h-64">
            <div className='overflow-auto'>
                <table className="w-full text-sm text-gray-500 dark:text-gray-400">
                    <thead className="text-left text-xs text-gray-400 uppercase dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Create Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Pounds
                            </th>
                        </tr>
                    </thead>
                    {
                        data &&
                        <tbody>
                            {data.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-b dark:bg-gray-800 dark:border-gray-700"
                                    onContextMenu={(e) => handleContextMenu(e, item)}
                                >
                                    <td className="px-6 py-4">
                                        {formatDate(item.create_date)}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                                        {item.pounds}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    }
                </table>
            </div>

            <Chart data={data} />

            {showMenu && (
                <div
                    className="context-menu"
                    style={{ top: menuPosition.top, left: menuPosition.left }}
                >
                    <div onClick={() => handleMenuItemClick('edit')}>Edit</div>
                    <div onClick={() => handleMenuItemClick('delete')}>Delete</div>
                </div>
            )}
        </div>
    );
};

export default Table;
