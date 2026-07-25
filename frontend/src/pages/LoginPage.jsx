import React from 'react';
import AuthForm from '../components/AuthForm';

const LoginPage = ({ onLogin }) => <AuthForm type="login" onLogin={onLogin} />;

export default LoginPage;
