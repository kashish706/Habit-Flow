import React from 'react';
import AuthForm from '../components/AuthForm';

const RegisterPage = ({ onLogin }) => <AuthForm type="register" onLogin={onLogin} />;

export default RegisterPage;
