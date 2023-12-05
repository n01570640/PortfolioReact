import React, { useState, useEffect, useRef } from 'react';
import PatientInfoForm from './patientInfoForm'; 
import NotificationPanel from './notificationPane';
//importing primereact component
import { TabView, TabPanel } from 'primereact/tabview';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import '../App.css';

/**
 * PatientView - A functional component that displays patient-related information and actions.
 *
 * Manages state for patient information, form editability, and active tab index.
 * Handles data fetching for patient information and updates state accordingly.
 * Offers functionalities to edit patient information and view medication history and refill requests.
 */
export default function PatientView() {
    const [patientInfo, setPatientInfo] = useState(null);
    const [isFormEditable, setIsFormEditable] = useState(false);
    const [activeTabIndex, setActiveTabIndex] = useState(0); // Default to the first tab
    const linkRef = useRef(null);

    
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

    useEffect(() => {
        if (activeTabIndex === 1 && patientInfo) {
            linkRef.current?.click();
        }
    }, [activeTabIndex, patientInfo]);

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
            <TabView activeIndex={activeTabIndex} onTabChange={(e) => setActiveTabIndex(e.index)}>
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
                         <Link 
                            /**Links the button to the patient medication profile using patientid */
                            to={`/medicationProfile/${patientInfo.patientId}`} className='button' role="button" ref={linkRef}>View your Medication History</Link>
                    </TabPanel>
                )}
                {patientInfo && (
                    <TabPanel header="Refill Request Status">
                        <NotificationPanel patientId={patientInfo.patientId} />
                    </TabPanel>
                )}
            </TabView>
        </div>
    );
}
