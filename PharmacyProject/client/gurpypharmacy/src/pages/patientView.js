import React, { useState, useEffect } from 'react';
import PatientInfoForm from './patientInfoForm'; // Make sure the path is correct
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import '../App.css';

export default function PatientView() {
    const [patientInfo, setPatientInfo] = useState(null);
    const [isFormEditable, setIsFormEditable] = useState(false);

    useEffect(() => {
        const fetchPatientInfo = async () => {
            try {
                const userToken = localStorage.getItem('userToken');
                const response = await fetch('http://localhost:3001/api/patientinfo', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
           
                setPatientInfo(data);
                setIsFormEditable(!data); // Enable form editing if no patient data is fetched
            } catch (error) {
                console.error("Error fetching patient info: ", error);
                setIsFormEditable(true); // Enable form for new data entry if there's an error
            }
        };

        fetchPatientInfo();
    }, []);

    const handleEdit = () => {
        setIsFormEditable(true);
    };

    const handleSubmit = (updatedInfo) => {
        setIsFormEditable(false);
        setPatientInfo(updatedInfo);
    };

    const handleCancel = () => {
        setIsFormEditable(false);
        // Reset to initial patient info if canceling editing of existing data
        if (patientInfo) {
            setPatientInfo(patientInfo);
        }
    };

    return (
        <div className='product-card'>
            <TabView>
                <TabPanel header="Patients">
                    <PatientInfoForm 
                        data={patientInfo || {}} 
                        editable={isFormEditable} 
                        onSubmit={handleSubmit} 
                        onCancel={handleCancel}
                    />
                    {!isFormEditable && <Button label="Edit" className="button" onClick={handleEdit} />}
                </TabPanel>
                {patientInfo && (
                    <TabPanel header="Medications">
                        {/* Medications content */}
                    </TabPanel>
                )}
            </TabView>
        </div>
    );
}
