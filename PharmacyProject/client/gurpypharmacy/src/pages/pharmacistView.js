//importing primereact component
import { TabView, TabPanel } from 'primereact/tabview';
import React, { useRef, useState } from 'react';
import '../App.css';

//importing custom components
import PatientList from './patientList';
import MedicationList from './medicationList';
import RefillRequests from './refillRequestsList';
import { Button } from 'bootstrap';


export default function PharmacistView(){
    return(
        
        <div className='product-card'>
           <TabView>
                <TabPanel header="Patients">
                    <PatientList/>
                </TabPanel>
                <TabPanel header="Medications">
                    <MedicationList/>
                </TabPanel>
                <TabPanel header="Refill Requests">
                    <RefillRequests/>
                </TabPanel>
            </TabView>
           
        </div>
    );

}