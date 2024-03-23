import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './App.css'; // Import the CSS file
import { CSVLink } from 'react-csv'; // Import CSVLink from react-csv

function App() {
    const [data, setData] = useState([]);
    const [inputText, setInputText] = useState('');
    const [jsonData, setJsonData] = useState([]);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [headers, setHeaders] = useState([
        { label: 'Name', key: 'name' },
        { label: 'Description', key: 'description' },
        { label: 'Quantity', key: 'quantity' },
        { label: 'Cost per unit', key: 'cost_per_unit' },
        { label: 'Fulfilled', key: 'fulfilled' },
    ])

    // Operations to update and edit the CSV table
    const [newItem, setNewItem] = useState({ name: '', description: '', quantity: 0, cost_per_unit: 0, fulfilled: false });
    const [editingIndex, setEditingIndex] = useState(0);

    const handleEditClick = (index) => {
        setEditingIndex(index);
    };

    const handleInputChange = (event, key) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        if (editingIndex !== null) {
            const updatedData = [...jsonData];
            updatedData[editingIndex][key] = value;
            setJsonData(updatedData);
        } else {
            setNewItem({ ...newItem, [key]: value });
        }
    };

    const handleSaveClick = () => {
        if (editingIndex !== null) {
            setEditingIndex(null);
        } else {
            setJsonData([...jsonData, newItem]);
            setNewItem({ name: '', description: '', quantity: 0, cost_per_unit: 0, fulfilled: false });
        }
    };

    const handleDeleteClick = (index) => {
        const updatedData = [...jsonData];
        updatedData.splice(index, 1);
        setJsonData(updatedData);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        Papa.parse(file, {
            header: true,
            complete: (result) => {
                console.log('Parsed CSV data:', result.data);
                setJsonData(result.data);
                setFileUploaded(true);
            },
            error: (error) => {
                console.error('Error parsing CSV:', error);
                alert('Error processing CSV');
            },
        });
    };

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/data/sample_data.csv');
            const reader = response.body.getReader();
            const result = await reader.read();
            const decoder = new TextDecoder('utf-8');
            const csv = decoder.decode(result.value);

            const { data } = Papa.parse(csv, { header: true });
            setData(data);
        }

        fetchData();
    }, []);

    function handleTextChange(e) {
        setInputText(e.target.value);
    }

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredData = jsonData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="App">
            <header className="header-container">
                <h1>BOM Beautifier</h1>
            </header>

            {!fileUploaded && (
                <div className="file-upload-container">
                    <h1>Upload CSV File</h1>
                    <input type="file" onChange={handleFileUpload} accept=".csv" />
                    <div>
                        <h2>JSON Data:</h2>
                        <pre>{JSON.stringify(jsonData, null, 1)}</pre>
                    </div>
                </div>
            )}

            {fileUploaded && (
                <div className="search-container">
                    <h2>Search CSV</h2>
                    <h4>Input the name of the item you are searching for</h4>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button onClick={handleSaveClick}>Add</button>
                    <CSVLink data={jsonData} headers={headers} filename={'test_data.csv'}>
                        Export CSV
                    </CSVLink>
                </div>
            )}

            {fileUploaded && (
                <div className="data-container">
                    <h1>CSV to JSON Data</h1>
                    <table className="table-container">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Cost per unit</th>
                            <th>Fulfilled</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={index} className="data-item">
                                <td><input type="text" value={item.name} onChange={(e) => handleInputChange(e, 'name')} /></td>
                                <td><input type="text" value={item.description} onChange={(e) => handleInputChange(e, 'description')} /></td>
                                <td><input type="number" value={item.quantity} onChange={(e) => handleInputChange(e, 'quantity')} /></td>
                                <td><input type="number" value={item.cost_per_unit} onChange={(e) => handleInputChange(e, 'cost_per_unit')} /></td>
                                <td><input type="checkbox" checked={item.fulfilled} onChange={(e) => handleInputChange(e, 'fulfilled')} /></td>
                                <td className="action-buttons">
                                    {editingIndex === index ? (
                                        <button onClick={handleSaveClick} className="edit-btn">Save</button>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEditClick(index)} className="edit-btn">Edit</button>
                                            <button onClick={() => handleDeleteClick(index)} className="delete-btn">Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default App;
