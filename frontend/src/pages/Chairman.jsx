import React from 'react';
import ChairmanNav from '../components/chairman/ChairmanNav';
import { Outlet } from 'react-router';

const Chairman = () => {
    return (
        <div>
        <ChairmanNav></ChairmanNav>
        <Outlet></Outlet>
        </div>
    );
};

export default Chairman;