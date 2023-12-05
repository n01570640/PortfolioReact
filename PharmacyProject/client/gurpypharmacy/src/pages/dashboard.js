import { useNavigate, useLocation } from 'react-router-dom';
import pharmacistIcon from '../images/pharmacist-view-icon.jpg';
import patientIcon from '../images/patient-view-icon.jpg';
import adminIcon from '../images/admin-view-icon.jpg';

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();

    const handlePharmacistViewNavigation = () => {
        if (isAuthenticated()) {
            // If the user is authenticated, navigate to the pharmacist view
            navigate('/login/pharmacist-loggedin');
          } else {
            // If the user is not authenticated, perhaps navigate to the login page or show an alert
            navigate('/login');
          }
    };

    const handlePatientViewNavigation = () => {
        if (isAuthenticated()) {
            // If the user is authenticated, navigate to the pharmacist view
            navigate('/patient-view');
          } else {
            // If the user is not authenticated, perhaps navigate to the login page or show an alert
            navigate('/login');
          }
    };

    const handleAdminViewNavigation = () => {
        if (isAuthenticated()) {
            // If the user is authenticated, navigate to the pharmacist view
            navigate('/admin');
          } else {
            // If the user is not authenticated, perhaps navigate to the login page or show an alert
            navigate('/login');
          }
    };
    const isAuthenticated = () => {
        // Retrieve the token from local storage or session storage
        const token = localStorage.getItem('token');
      
        // Check if the token exists
        if (token) {
          return true;
        }
        return false;
      };

    return (
        <div>
            {location.pathname == '/' && (
                <div className="dashboard">
                    <div className='dashboard-icon'>
                        <img
                            src={pharmacistIcon}
                            alt="Pharmacist Icon"
                            onClick={handlePharmacistViewNavigation}

                        />
                        <p>Pharmacist</p>
                    </div>
                    

                    <div className='dashboard-icon'>
                        <img
                            src={patientIcon}
                            alt="Patient Icon"
                            onClick={handlePatientViewNavigation}
                        />
                        <p>Patient</p>
                    </div>
                    <div className='dashboard-icon'>
                        <img
                            src={adminIcon}
                            alt="Patient Icon"
                            onClick={handleAdminViewNavigation}
                        />
                        <p>Admin</p>
                    </div>
     
                </div>
     
            )}
        </div>
    );
  }
  