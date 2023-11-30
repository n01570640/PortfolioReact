import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css"
//importing prime components

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import React, { useState, useEffect } from "react";
//importing bootstrap components for Grid
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function App() {
 //variables to handle the state
 const [loading, setLoading] = useState(null);
 const [users, setUsers] = useState([]);
 
 //Function to fetch the data
 const fetchUsersData = async (url, buttonId) => {
   setLoading(buttonId);//Set loading to the current buttons id
   try {
       const response = await fetch(url);
       const data = await response.json();
       setUsers(data);
   } catch (error) {
       console.error("Error fetching data: ", error);
   } finally {
     setTimeout(() => {
       setLoading(null);
   }, 1000);
   }
};
//Fetching all the users when the page loads
 useEffect(() => {
   fetchUsersData('http://localhost:3001/');
 }, []); 
 
  return (
    <Container>
      <Row>
        <Col></Col>
        <Col xs={12}>
          <div className="card">
            <div className='button-container'>
              {/** loading when buttonsId matches the loading state*/}
              <Button 
                label="Show Not 30 Years old" 
                icon="pi pi-check" 
                severity="secondary" 
                loading={loading === "not-thirty"} 
                onClick={()=> fetchUsersData("http://localhost:3001/not-thirty", "not-thirty")} 
              />
              <Button 
                label="Show Older than 22 Years" 
                icon="pi pi-check" 
                severity="secondary" 
                loading={loading === "older-than-22"} 
                onClick={()=> fetchUsersData("http://localhost:3001/older-than-22", "older-than-22")}
              />
              <Button 
                label="Show Younger than 20 Years" 
                icon="pi pi-check" 
                severity="secondary" 
                loading={loading === "younger-than-20"} 
                onClick={()=> fetchUsersData("http://localhost:3001/younger-than-20", "younger-than-20")}  
              />
              <Button 
                label="Show Active Mentors" 
                icon="pi pi-check" 
                severity="secondary" 
                loading={loading === "active-mentors"} 
                onClick={()=> fetchUsersData("http://localhost:3001/active-mentors", "active-mentors")} 
              />
              <Button 
                label="Show Not 20 Years Old" 
                icon="pi pi-check" 
                severity="secondary" 
                loading={loading === "not-twenty"}   
                onClick={()=> fetchUsersData("http://localhost:3001/not-twenty", "not-twenty")}
              />
            </div>
            {/** Users data is passed through the prop value*/}
            <DataTable value = {users} tableStyle={{ minWidth: '30rem', maxWidth: "80rem"}}>
              <Column field="name" header="Name" sortable style={{ width: '25%' }}></Column>
              <Column field="email" header="Email" sortable style={{ width: '25%' }}></Column>
              <Column field="age" header="Age" sortable style={{ width: '25%' }}></Column>
              <Column field="isActive" header="Is Active?" sortable style={{ width: '25%' }}></Column>
              <Column field="tags" header="Tags" sortable style={{ width: '25%' }} body={(rowData) => rowData.tags.join(', ')}></Column>{/**Joins tags with a comma and space */}
            </DataTable>
                
          </div>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}

export default App;
