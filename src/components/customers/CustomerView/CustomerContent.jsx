import {useLocation} from 'react-router-dom'
import CustomerContactDetails from './CustomerContactDetails.jsx'
import CustomerTabOverviewContent from './CustomerTabOverviewContent.jsx'
import TabDocumentsContent from './CustomerDocsView.jsx'
import CustomerProfile from '../../widgetsList/CustomerProfile.jsx'
import {CustomerSalesIdList} from "@/components/customers/CustomerView/CustomerSalesIdLIst.jsx";

const CustomerContent = () => {
    const location = useLocation();
    const customerData = location.state?.customerData;

    return (
        <>
            <div className="col-xxl-4 col-xl-6">
                <CustomerProfile customerData={customerData}/>
                <CustomerContactDetails customerData={customerData}/>
            </div>
            <div className="col-xxl-8 col-xl-6">
                <div className="card border-top-0">
                    <div className="card-header p-0">
                        <ul className="nav nav-tabs flex-wrap w-100 text-center customers-nav-tabs" id="myTab" role="tablist">

                            <li className="nav-item flex-fill border-top" role="presentation">
                                <a
                                    href="#"
                                    className="nav-link active"
                                    data-bs-toggle="tab"
                                    data-bs-target="#salesIdTab"
                                    role="tab"
                                >
                                    Sales Id
                                </a>
                            </li>

                            <li className="nav-item flex-fill border-top" role="presentation">
                                <a
                                    href="#"
                                    className="nav-link"
                                    data-bs-toggle="tab"
                                    data-bs-target="#overviewTab"
                                    role="tab"
                                >
                                    Overview
                                </a>
                            </li>


                            <li className="nav-item flex-fill border-top" role="presentation">
                                <a
                                    href="#"
                                    className="nav-link"
                                    data-bs-toggle="tab"
                                    data-bs-target="#tabDocumentsContent"
                                    role="tab"
                                >
                                    Docs
                                </a>
                            </li>
                        </ul>

                    </div>
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="salesIdTab" role="tabpanel">
                            <CustomerSalesIdList customerData={customerData} />
                        </div>

                        <CustomerTabOverviewContent customerData={customerData} />

                        <div className="tab-pane fade" id="tabDocumentsContent" role="tabpanel">
                            <TabDocumentsContent customerData={customerData} />
                        </div>
                    </div>



                </div>
            </div>
        </>
    )
}

export default CustomerContent
