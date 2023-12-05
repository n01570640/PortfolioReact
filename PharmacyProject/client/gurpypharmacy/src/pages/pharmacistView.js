//importing primereact component
import { TabView, TabPanel } from 'primereact/tabview';
import {Text } from 'react'
import React, { useRef, useState } from 'react';
import '../App.css';

//importing custom components
import PatientList from './patientList';
import MedicationList from './medicationList';
import RefillRequests from './refillRequestsList';

/**
 * PharmacistView - A functional component rendering the pharmacist's view.
 * 
 * This component utilizes the TabView component from PrimeReact to display different panels:
 * - Patients: Renders a list of patients using the PatientList custom component.
 * - Medications: Renders a list of medications using the MedicationList custom component.
 * - Refill Requests: Renders a list of refill requests using the RefillRequests custom component.
 *
 * Each tab is structured to enhance the pharmacist's user experience by categorizing essential data.
 */

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