import { useState, useEffect } from 'react';
//importing reactprime components
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Dialog } from 'primereact/dialog';
         
//importing custom components
import { getToken } from './tokenUtils';
import ConfirmFillingPanel from './confirmFillingPanel';

/**
 * RefillRequests - A functional component for displaying and managing refill requests.
 *
 * Manages state for refill requests, dialog visibility, and selected refill request.
 * Implements fetching of refill requests and updating their status.
 */
export default function RefillRequests() {
    const [refillRequests, setRefillRequests] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isConfirmFillingVisible, setIsConfirmFillingVisible] = useState(false);
    const [selectedRefillRequest, setSelectedRefillRequest] = useState(null);

    useEffect(() => {
        fetchRefillRequests();
    }, []);
    
    //Getting the refill request orders
    const fetchRefillRequests = async () => {
        try {
            const token = getToken();
            const response = await fetch('http://localhost:3001/api/refillRequestOrders', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}`  }
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setRefillRequests(data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };
    //When filling is complete, updating the status
    const updateRefillRequestStatus = async (requestId, newStatus, fillQuantity) => {
        try {
            const token = getToken();
            const response = await fetch(`http://localhost:3001/api/refillRequestOrders/${requestId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ newStatus , fillQuantity})
            });
    
            if (!response.ok) throw new Error('Network response was not ok');
    
            // Refresh the list or handle UI update accordingly
            fetchRefillRequests();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    //Complete refill request by deleting it from the collection
    const completeRefillRequest = async (requestId) => {
        try{
            const token = getToken();
            const response = await fetch(`http://localhost:3001/api/completeRefillRequestOrder/${requestId}`,{
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            //Refresh the page
            fetchRefillRequests();
            
        } catch (error){
            console.error("Error in completing a refill: ", error);
        }
    }
    
    //formatted date
    const renderDate = (rowData) => {
        return new Date(rowData.requestDate).toLocaleDateString();
    };

    const fillRefillButtonTemplate = (rowData) => {
        return rowData.status === 'Filling' ? (
            <Button
                label='Fill'
                className='button'
                onClick={() => openConfirmFillingPanel(rowData)} 
                disabled={rowData.status !== 'Filling'}
            />
        ) : null ;
    };
    const completeRefillButtonTemplate = (rowData) => {
        console.log("ROW DATA",rowData._id);
        return rowData.status === 'Ready' ? (
            <Button
                label='Complete Pickup'
                className='button'
                onClick={() => completeRefillRequest(rowData._id)} 
                disabled={rowData.status !== 'Ready'}
            />
        ) : null ;
    };
    //handle opening the form
    const openConfirmFillingPanel = (rowData) => {
        setSelectedRefillRequest(rowData);
        setIsConfirmFillingVisible(true);
    };

    //handle the add new patient record form submission
    const handleConfirmFillingSubmit = async (formData) => {
        const fillQuantity = formData.quantity;
        await updateRefillRequestStatus(selectedRefillRequest._id, 'Ready', fillQuantity);
        setIsConfirmFillingVisible(false);
    };

    const renderRefillRequestsTable = (statusFilter) => {
        const filteredRequests = refillRequests.filter(req => req.status === statusFilter);
    
        return (
            <DataTable value={filteredRequests}>
                <Column field="patientDetails.firstName" header="Patient Name" body={(rowData) => `${rowData.patientDetails.firstName} ${rowData.patientDetails.lastName}`} />
                <Column field="patientDetails.dateOfBirth" header="DOB" body={(rowData) => rowData.patientDetails.dateOfBirth ? new Date(rowData.patientDetails.dateOfBirth).toLocaleDateString() : ''} />
                <Column field="medicationId.name" header="Medication Name" />
                <Column field="medicationId.dosage" header="Dosage" />
                <Column field="fillQuantity" header="Fill Quantity" />
                <Column field="requestDate" header="Request Date" body={renderDate} />
                <Column body={fillRefillButtonTemplate} />
                <Column body={completeRefillButtonTemplate } />
            </DataTable>
        );
    };

    return (
        <div className="'product-card'">
            <div className="flex flex-wrap gap-2 mb-3">
                <Button className="button" onClick={() => setActiveIndex(0)}  label="Filling" >
                    <Badge value={refillRequests.length} className='badgeUrgent'></Badge>
                </Button>
                <Button className="button" onClick={() => setActiveIndex(1)} label="Pick-Up" >
                    <Badge value={refillRequests.length} className='badgeComplete'></Badge>
                </Button>
                <Dialog header="Confirm Filling" className="dialog-background" visible={isConfirmFillingVisible} 
                modal onHide={() => setIsConfirmFillingVisible(false)} style={{ width: '50vw', height:'50vh' }} >
                    <ConfirmFillingPanel fillingRequestData={selectedRefillRequest}  onSubmit={handleConfirmFillingSubmit} />
                </Dialog>
            </div>
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Rx in Filling">
                    {renderRefillRequestsTable('Filling')}
                </TabPanel>
                <TabPanel header="Rx for Pick up">
                    {renderRefillRequestsTable('Ready')}
                </TabPanel>
            </TabView>
        </div>
    )
}
        