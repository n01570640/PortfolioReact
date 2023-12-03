import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import AdminPharmacistForm from './adminPharmacistForm';

const PharmacistPanel = () => {
    const [pharmacists, setPharmacists] = useState([]);
    const [pharmacistDialogVisible, setPharmacistDialogVisible] = useState(false);
    const [selectedPharmacist, setSelectedPharmacist] = useState(null);
    const [isAddAction, setIsAddAction] = useState(false);

    useEffect(() => {
        loadPharmacists();
    }, []);

    const openNewPharmacistDialog = () => {
        setIsAddAction(true);
        setSelectedPharmacist(null);
        setPharmacistDialogVisible(true);
    };

    const loadPharmacists = async () => {
        try {
            const response = await fetch('http://localhost:3001/admin/pharmacists', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const pharmacistData = await response.json();
            setPharmacists(pharmacistData);
        } catch (error) {
            console.error("Error fetching pharmacists: ", error);
        }
    };

    const editPharmacist = (pharmacist) => {
        setSelectedPharmacist(pharmacist);
        setIsAddAction(false);
        setPharmacistDialogVisible(true);
    };

    const pharmacistActionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button label="Edit" className="button" onClick={() => editPharmacist(rowData)} />
            </React.Fragment>
        );
    };

    const handleDialogHide = () => {
        setPharmacistDialogVisible(false);
        setSelectedPharmacist(null);
        setIsAddAction(false);
    };

    const handleFormSubmit = async (data) => {
        try {
            const response = await fetch(`http://localhost:3001/admin/pharmacists`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                },
                body: JSON.stringify({ pharmacistData: data, actionType: isAddAction ? 'add' : 'edit' })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            await response.json();
            loadPharmacists();
            handleDialogHide();
        } catch (error) {
            console.error("Error saving pharmacist: ", error);
        }
    };

    const isActiveBodyTemplate = (rowData) => {
        return rowData.isActive ? "Active" : "Inactive";
    };

    return (
        <div>
            <Button label="Add Pharmacist" className="button" onClick={openNewPharmacistDialog} />
            <DataTable value={pharmacists} paginator rows={10} showGridlines>
                <Column body={pharmacistActionBodyTemplate} />
                <Column field="licenseNumber" header="License Number" sortable />
                <Column field="isActive" header="Is Active" body={isActiveBodyTemplate} sortable />
               
            </DataTable>

            <Dialog header="Pharmacist Details" visible={pharmacistDialogVisible}  className="dialog-background" onHide={handleDialogHide} style={{ width: '60vw', height:'50vh' }} breakpoints={{ '960px': '75vw,65vw', '641px': '100vw,100vh' }}>
                <AdminPharmacistForm pharmacist={selectedPharmacist} isAddAction={isAddAction} onSubmit={handleFormSubmit} />
            </Dialog>
        </div>
    );
};

export default PharmacistPanel;
