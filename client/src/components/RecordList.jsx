import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Record = (props) => (
    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
        <td className="p-4 align-middle">{props.record.name}</td>
        <td className="p-4 align-middle">{props.record.position}</td>
        <td className="p-4 align-middle">{props.record.level}</td>
        <td className="p-4 align-middle">
            <div className="flex gap-2">
                <Link
                    className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
                    to={`/edit/${props.record._id}`}
                >
                    Edit
                </Link>
                <button
                    className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
                    color="red"
                    type="button"
                    onClick={() => {
                        props.deleteRecord(props.record._id);
                    }}
                >
                    Delete
                </button>
            </div>
        </td>
    </tr>
);

export default function RecordList() {
    const [records, setRecords] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // Added search term

    useEffect(() => {
        async function getRecords() {
            const response = await fetch(`http://localhost:5050/record/`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                console.error(message);
                return;
            }
            const records = await response.json();
            setRecords(records);
        }
        getRecords();
    }, [records.length]);

    // Filter records based on search term
    const filteredRecords = records.filter((record) => {
        return (
            record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.position.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    async function deleteRecord(id) {
        try {
            const response = await fetch(`http://localhost:5050/record/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete record");
            }

            const newRecords = records.filter((el) => el._id !== id);
            setRecords(newRecords);
        } catch (error) {
            console.error("Error deleting record:", error);
        }
    }

    function recordList() {
        return filteredRecords.map((record) => (
            <Record
                key={record._id}
                record={record}
                deleteRecord={deleteRecord}
            />
        ));
    }

    return (
        <>
            <h3 className="text-lg font-semibold p-4">Employee Records</h3>

            {/* Search Box */}
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or position"
                className="p-2 border border-gray-300 rounded mb-4"
            />

            <div className="border rounded-lg overflow-hidden">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Name
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Position
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Level
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>{recordList()}</tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
