import React, { useEffect, useState } from 'react'; //useState helps the component remember data, useEffect help the component do tasks - like fetching data, when it first loads.
import { categoryApi } from '../services/api'; //we bring in our categoryApi to fetch the categories from the backend.
import { Plus } from 'lucide-react';
import AddCategoryModal from '../components/AddCategoryModal';


// this part tell TypeScript - every category in our list will look like this. if a category doesn't have an id or name, TypeScript will warn us.
interface Category {
    id: number;
    name: string;
    color: string;
    icon?: string;
    subscriptions_count: number;
}


const Categories = () => {
    const [showModal,  setShowModal]  = useState(false)
    const [categories, setCategories] = useState<Category[]>([]); //state : the memory - categories: This is a variable that holds your list of data. Initially, it is empty []. 
    
    // setCategories: This is a function that you can call to update the categories variable. When you call setCategories with new data, React will remember that data and also re-render the component to show the updated list.

    //useEffect: This tells React: "Run the code inside here as soon as the component appears on the page." 
    // In this case, we want to fetch the list of categories from the backend when the component first loads. So we call categoryApi.getAll(), which makes an API request to get the categories. When the data comes back, we call setCategories(data) to update our state with the new list of categories. This will cause the component to re-render and show the categories in the table.

    //[]: The empty brackets mean "Run this only once when the page loads."
    // categoryApi.getAll(): We call your API function to get the data.
    // .then(...): Once the server sends the data, we take that data and pass it to setCategories to update our memory.
    useEffect(() => {
        categoryApi.getAll().then(data => setCategories(data));
    }, []);


    function create(data: any) {
        throw new Error('Function not implemented.');
    }

    //The Render: Drawing the Table
    //return (...): This is what actually gets drawn on your user's browser.
    //<table>: We create the table structure.
    //categories.map((cat) => ...): This is the magic part. We take the categories array (our list) and loop through it.
    //key={cat.id}: React needs a unique ID for every row to keep track of it.
    //<td>{cat.name}</td>: We create a cell inside the row and put the category name inside it.
    
    return (
        <div style={{ width: '100%', padding: '20px' }}>
            {/* Header */}
            <div className="page-header">
                <h1 className="page-title">All Categories</h1>
                <button
                    className="btn-primary"
                    onClick={() => setShowModal(true)}
                    >
                    <Plus size={16} /> Add New
                </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd', color: 'black' }}>ID</th>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd', color: 'black' }}>Name</th>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd', color: 'black' }}>Color</th>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd', color: 'black' }}>Icon</th>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd', color: 'black' }}>Subscriptions</th>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd', color: 'black' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((cat) => (
                        <tr key={cat.id} style={{ borderBottom: '1px solid #eee', transition: '0.3s' }}>
                            <td style={{ padding: '12px' }}>{cat.id}</td>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{cat.name}</td>
                            <td style={{ padding: '12px', color: cat.color }}>{cat.color}</td>
                            <td style={{ padding: '12px', fontSize: '1.2rem' }}>{cat.icon}</td>
                            <td style={{ padding: '12px' }}>{cat.subscriptions_count}</td>
                            <td style={{ padding: '12px' }}><button style={{ borderRadius: '2px', padding: '9px' }} className="btn-primary">Update</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
                  {/* Add Modal */}
                  {showModal && (
                <AddCategoryModal
                    onClose={() => setShowModal(false)}
                    onSaved={async (data) => {
                        await create(data)
                        setShowModal(false)
                    }}
                />
            )}
        </div>
    );
};

export default Categories;