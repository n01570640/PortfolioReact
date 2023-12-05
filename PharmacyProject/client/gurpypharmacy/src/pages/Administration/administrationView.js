import { TabView, TabPanel } from 'primereact/tabview';
import MedicationPanel from './subcomponents/adminMedicationPane';
import PharmacistPanel from './subcomponents/adminPharmacistPane';
import '../../App.css';
/**
 * AdministrationView: React component for the administration view.
 * 
 * Features:
 * - Tabbed interface for managing different administrative aspects.
 * - Includes tabs for managing pharmacists (PharmacistPanel) and medications (MedicationPanel).
 */

export default function AdministrationView(){
    return (
        <TabView className='product-card'>
            <TabPanel header="Pharmacists">
                <PharmacistPanel />
            </TabPanel>
            <TabPanel header="Medications">
                <MedicationPanel />
            </TabPanel>
        </TabView>
    );
}