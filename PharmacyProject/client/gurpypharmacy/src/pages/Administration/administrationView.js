import React, { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';

import MedicationPanel from './subcomponents/adminMedicationPane';
import '../../App.css';

export default function AdministrationView(){
    return (
        <TabView className='product-card'>
            <TabPanel header="Pharmacists">
                {/* Pharmacists DataTable and Actions Here */}
            </TabPanel>
            <TabPanel header="Medications">
                <MedicationPanel />
            </TabPanel>
        </TabView>
    );
}