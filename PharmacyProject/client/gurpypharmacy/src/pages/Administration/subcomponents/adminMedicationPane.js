import React, { useState, useEffect } from 'react';
//importing primereact components
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';
//importing custom components
import MedicalFormContent from './adminMedicationFormPane';

/**
 * MedicationPanel: React component for managing medications.
 * 
 * Features:
 * - Displays a list of medications in a data table with sorting, filtering, and pagination.
 * - Offers functionalities to add or edit medication details.
 * - Manages the fetching of medication data from the server.
 * - Controls the visibility and data of the dialog for medication details.
 */

const MedicationPanel = () => {
    const [medications, setMedications] = useState([]);
    const [medicationDialogVisible, setMedicationDialogVisible] = useState(false);
    const [selectedMedication, setSelectedMedication] = useState(null);
    const [isAddAction, setIsAddAction] = useState(false); // New state to determine if it's an add action

    const [filters] = useState({
        name: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    useEffect(() => {
        loadMedications();
    }, []);

    const openNewMedicationDialog = () => {
        setIsAddAction(true); // Set to true for add action
        setSelectedMedication(null);
        setMedicationDialogVisible(true);
    };

    const loadMedications = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/medications', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                }
            });
    
            if (!response.ok) {
                console.log(response.status);
                throw new Error(`Error: ${response.status}`);
            }
    
            const meds = await response.json();
            setMedications(meds);
        } catch (error) {
            console.error("Error fetching medications: ", error);
        }
    };

    const medicationActionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button label="Edit" role="button" className="button" onClick={() => editMedication(rowData)} />
            </React.Fragment>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.name}
            </>
        );
    };

    const editMedication = (medication) => {
        setSelectedMedication(medication);
        setMedicationDialogVisible(true);
    };

     const handleDialogHide = () => {
        setMedicationDialogVisible(false);
        setSelectedMedication(null);
        setIsAddAction(false);
    };

    const handleFormSubmit = async (data) => {
        try {
            const response = await fetch('http://localhost:3001/admin/medications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                },
                body: JSON.stringify({ medicationData: data, actionType: selectedMedication ? 'edit' : 'add' })
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            await response.json();
            loadMedications();
            handleDialogHide();
        } catch (error) {
            console.error("Error saving medication: ", error);
        }
    };

    const isActiveBodyTemplate = (rowData) =>{
        return rowData.isActive ? "Active" : "Inactive";
    };
    return (
        <div>
            <Button label="Add Medication" className="button" role="button" onClick={openNewMedicationDialog} />
            <DataTable value={medications} paginator rows={10} showGridlines filters={filters} filterDisplay="row" 
                 globalFilterFields={['name', 'dosage', 'description', 'price', 'requiresPrescription']} emptyMessage="No medication found."tableStyle={{ minWidth: '50rem' }}>
                <Column header=""body={medicationActionBodyTemplate} />
                <Column field="name" header="Name" body={nameBodyTemplate} sortable filter filterMatchMode={filters}/>
                <Column field="dosage" header="Dosage" />
                <Column field="isActive" header="Is Active" body={isActiveBodyTemplate} sortable />
            </DataTable>

            <Dialog header="Medication Details" visible={medicationDialogVisible} className="dialog-background" onHide={handleDialogHide} style={{ width: '60vw', height:'50vh' }} breakpoints={{ '960px': '75vw,65vw', '641px': '100vw,100vh' }}>
                <MedicalFormContent medication={selectedMedication} isAddAction={isAddAction} onSubmit={handleFormSubmit} />
            </Dialog>
        </div>
    );
};

export default MedicationPanel;
