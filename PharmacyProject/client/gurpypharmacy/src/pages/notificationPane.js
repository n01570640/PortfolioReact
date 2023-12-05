import React, { useState, useEffect } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Divider } from 'primereact/divider';

/**
 * NotificationPanel - Functional component to display refill requests for a given patient.
 *
 * @param {string} patientId - The ID of the patient for whom refill requests are to be displayed.
 * Manages the state of refill requests, layout of the displayed data, and performs data fetching based on the patient ID.
 */
const NotificationPanel = ({ patientId }) => {
    const [refillRequests, setRefillRequests] = useState([]);
    const [layout, setLayout] = useState('list');

    useEffect(() => {
        if (patientId) {
            fetchRefillRequests(patientId);
        }
    }, [patientId]);

    const fetchRefillRequests = async (patientId) => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(`http://localhost:3001/api/refillRequestOrders/${patientId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            setRefillRequests(data);
        } catch (error) {
            console.error("Error fetching refill requests: ", error);
        }
    };

    const itemTemplate = (item, layout) => {
        if (!item) {
            return;
        }

        return (
            <div className="p-col-12">
                       <br />
                <div className="product-list-item">
                    <div className="product-list-detail">
                        <div className="product-name"><strong>Medication Requested:</strong> {item.medicationId.name}</div>
                        <div className="product-description"><strong>Refill Status: </strong>{item.status}</div>
                    </div>
                    <div className="product-list-action">
                        <span className="product-price">
                            <strong>Refill Requested:</strong> {new Date(item.requestDate).toLocaleDateString('en-CA')}
                        </span>
                    </div>
                </div>
                <Divider />
            </div>
            
        );
    };
    return (
        <div>
            <h2>Filling Requests</h2>
            <DataView value={refillRequests.filter(request => request.status === 'Filling')} layout={layout} itemTemplate={itemTemplate} paginator rows={5} header="" />
            
            <h2>Ready for Pickup Requests</h2>
            <DataView value={refillRequests.filter(request => request.status === 'Ready')} layout={layout} itemTemplate={itemTemplate} paginator rows={5} header="" />
        </div>
    );
};

export default NotificationPanel;
