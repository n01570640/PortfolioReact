import {InputText, Password, Button, Toast } from 'primereact';
import React, { useRef, useState } from 'react';
//import 'primereact/resources/themes/saga-blue/theme.css';
import '../App.css';




export default function UserRegistration(){
    //initial state
    const [userFormData, setUserFormData] = useState({ name: "", email: "", password: "" , userType: ""});
    const toast = useRef(null);//For showing feedback message
    //Email validation regrex
    const emailRegex = /\S+@\S+\.\S+/;

    //Validate form fields
    const validateForm = () => {
        if(!userFormData.name.trim()){
            toast.current.show({severity: 'error', summary: 'Error', detail: 'Name is required'})
            return false;
        }
        if(!emailRegex.test(userFormData.email)){
            toast.current.show({severity: 'error', summary: 'Error', detail: 'Enter a valid email'})
            return false;
        }
        if(userFormData.password.length < 8){
            toast.current.show({severity: 'error', summary: 'Error', detail: 'Password much be at least 8 characters long'})
        }
        return true; //if all validation pass
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //Perform the validation
        const isFormValid = validateForm();
        if(!isFormValid) return; //if form is not valid, stop here

        try{
            userFormData.userType ='Patient';
            const response = await fetch('http://localhost:3001/register',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'  },
                body: JSON.stringify({ 
                    username: userFormData.email,
                    password: userFormData.password,
                    userType: userFormData.userType
                })
            });
            if(response.ok){
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Registration Successfull'});
                setUserFormData({name: "" , email: "", password: "", useType: "" })
            }else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Registration Failed'});
            }
        } catch (error) {
            console.log(error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occured'});
        }
       
    };

    return(
        
        <div className='product-card'>
           
            <Toast ref={toast} />
                <h2 className='brand-logo'>
                    User Registration
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className='form-field'>
                        <label htmlFor='name' className="form-label">Name</label>
                        <InputText className="form-input"  id="name" value={userFormData.name} onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })} required />
                    </div>
                    <div className='form-field'>
                        <label htmlFor='email' className="form-label">Email</label>
                        <InputText className="form-input" id="email" value={userFormData.email} onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })} required />
                    </div>
                    <div className='form-field'>
                        <label htmlFor='password' className="form-label">Password</label>
                        <Password id="password" className="form-password" value={userFormData.password} onChange={(e) => setUserFormData({...userFormData, password: e.target.value })} feedback={false} required/>
                    </div>
                    
                    <Button label="Register" className="button" />
                </form>
           
        </div>
    );

}