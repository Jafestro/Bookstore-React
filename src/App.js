import { useEffect, useState } from 'react';
import { AgGridReact} from 'ag-grid-react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AddBook from './components/AddBook';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';


import './App.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

function App() {
  const [books, setBooks] = useState([]);

   // !!!Add keys into the todo objects
  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) => 
    Object.defineProperty(item, 'id', {value: keys[index]}));
    setBooks(valueKeys);
  }

  useEffect (() =>{
    fetchItems();
  }, [])

  const fetchItems = () => {
    fetch("https://bookstore-c5cdb-default-rtdb.europe-west1.firebasedatabase.app/books/.json")
    .then(response => response.json())
    .then(data => addKeys(data))
    .catch(err => console.error(err))
  }

  const addBook = (newBook) => {
    fetch('https://bookstore-c5cdb-default-rtdb.europe-west1.firebasedatabase.app/books/.json',
    {
      method: 'POST',
      body: JSON.stringify(newBook)
    })
    .then(response => fetchItems()
    .catch(err => console.error(err)))
  }

  const deleteBook = (id) => {
    fetch(`https://bookstore-c5cdb-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json`,
    {
      method: 'DELETE',
    })
    .then(response => fetchItems())
    .catch(err => console.error(err))
  }

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            Bookstore
          </Typography>
        </Toolbar>
      </AppBar>
      <AddBook addBook={addBook} /> 
      <div className='ag-theme-material' style={{height: 400, width: 1100, margin: 'auto'}}>
        <AgGridReact 
          rowData={books} 
          columnDefs={[
            {sortable:'true' , filter:'true', field:'author'}, 
            {sortable:'true' , filter:'true', field:'isbn'},
            {sortable:'true' , filter:'true', field:'price'},
            {sortable:'true' , filter:'true', field:'title'},
            {sortable:'true' , filter:'true', field:'year'},
            {field:'id', headerName: '', width: 90, 
            cellRenderer: (params) => {  
              return(
                <IconButton onClick={()=> deleteBook(params.value)} size='small' color='error'>
                  <DeleteIcon/>
                </IconButton>
              );
                }
             }]}
            
        />
      </div>
     
    </div>
  );
}

export default App;
