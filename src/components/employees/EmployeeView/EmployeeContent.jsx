import {useLocation} from 'react-router-dom'
import EmployeeContactDetails from './CustomerSocalMedia.jsx'
import TabOverviewContent from './TabOverviewContent.jsx'
import TabDocumentsContent from './EmployeeDocsView.jsx'
import EmployeeProfile from '../../widgetsList/EmployeeProfile.jsx'
import AttendanceTabView from "@/components/employees/EmployeeView/AttendanceTabView.jsx";

const EmployeeContent = () => {
    const location = useLocation();
    const employeeData = location.state?.employeeData;
    const empId = location.state?.userId;
    return (
        <>
            <div className="col-xxl-4 col-xl-6">
                <EmployeeProfile employeeData={employeeData}/>
                <EmployeeContactDetails employeeData={employeeData}/>
            </div>
            <div className="col-xxl-8 col-xl-6">
                <div className="card border-top-0">
                    <div className="card-header p-0">
                        <ul className="nav nav-tabs flex-wrap w-100 text-center customers-nav-tabs" id="myTab"
                            role="tablist">
                            <li className="nav-item flex-fill border-top" role="presentation">
                                <a href="#" className="nav-link active" data-bs-toggle="tab"
                                   data-bs-target="#overviewTab" role="tab">Overview</a>
                            </li>
                            <li className="nav-item flex-fill border-top" role="presentation">
                                <a href="#" className="nav-link" data-bs-toggle="tab"
                                   data-bs-target="#tabDocumentsContent" role="tab">Docs</a>
                            </li>
                            <li className="nav-item flex-fill border-top" role="presentation">
                                <a href="#" className="nav-link" data-bs-toggle="tab"
                                   data-bs-target="#attendanceTabView" role="tab">Attendance</a>
                            </li>
                        </ul>
                    </div>
                    <div className="tab-content">
                        <TabOverviewContent employeeData={employeeData}/>
                        <div className="tab-pane fade" id="tabDocumentsContent" role="tabpanel">
                            <TabDocumentsContent employeeData={employeeData}/>
                        </div>
                        <div className="tab-pane fade" id="attendanceTabView" role="tabpanel">
                            <AttendanceTabView employeeData={employeeData}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EmployeeContent
