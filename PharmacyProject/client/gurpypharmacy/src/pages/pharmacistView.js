//importing primereact component
import { TabView, TabPanel } from 'primereact/tabview';
import {Text } from 'react'
import React, { useRef, useState } from 'react';
import '../App.css';

//importing custom components
import PatientList from './patientList';
import MedicationList from './medicationList';



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
                    <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti 
                        quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in
                        culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. 
                        Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                    </p>
                </TabPanel>
            </TabView>
           
        </div>
    );

}