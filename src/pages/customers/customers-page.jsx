import React from 'react'
import CustomerList from "@/components/customers/customer-list/CustomerList.jsx";

const CustomerPage = () => {
    return (
        <>
            <div className='main-content'>
                <div>
                    <CustomerList />
                </div>
            </div>

        </>
    )
}

export default CustomerPage