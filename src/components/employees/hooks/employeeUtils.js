import dayjs from "dayjs";

export const transformEmployeeData = (formData, files, isEditMode, employeeDataFromState) => {
    const employeeData = {
        name: formData.firstName.trim(),
        sirName: formData.sirName.trim(),
        phone1: formData.mobile1.trim(),
        phone2: formData.mobile2 ? formData.mobile2.trim() : "",
        phone3: formData.mobile3 ? formData.mobile3.trim() : "",
        divisionId: formData.divisionId,
        email: formData.email.trim(),
        temporaryAddress: formData.temporaryAddress.trim(),
        permanentAddress: formData.permanentAddress.trim(),
        uuid: formData.cnicNumber.trim(),
        education: formData.education.trim(),
        emergencyContactName: formData.emergencyContactName.trim(),
        emergencyContactNo: formData.emergencyContactNo.trim(),
        dob: formData.dob ? dayjs(formData.dob).format("DD-MM-YYYY") : "",
        bloodGroup: formData.bloodGroup,
        employeeCode: formData.employeeCode,
        joiningDate: dayjs(formData.joiningDate).format("DD-MM-YYYY"),
        dutyStartTime: dayjs(formData.dutyStartTime).format("hh:mm A"),
        dutyEndTime: dayjs(formData.dutyEndTime).format("hh:mm A"),
        basicSalaryPerMonth: formData.basicSalary,
        referredBy: formData.referredBy || "",
        departmentId: formData.departmentId.toString(),
        designationIds: Array.isArray(formData.designationIds)
            ? formData.designationIds.map(id => id.toString())
            : formData.designationIds ? [formData.designationIds.toString()] : [],
        designationId: Array.isArray(formData.designationIds) && formData.designationIds.length > 0
            ? formData.designationIds[0].toString()
            : "",
        officeLocationId: formData.officeId.toString(),
        userStatusId: formData.statusId.toString(),
        userTypeId: "2",
        identityType: "1",
        ...(formData.accessGroupId ? { accessGroupId: formData.accessGroupId.toString() } : {}),
        // Only send password if the user provided one (required on create, optional on edit)
        ...(formData.password ? { password: formData.password } : {}),
    };

    if (isEditMode && employeeDataFromState?.userId) {
        employeeData.userId = employeeDataFromState.userId.toString();
    }

    // Log the formatted data to verify formats
    console.log('Sending employee data to server:');
    console.log('DOB:', employeeData.dob, '(DD-MM-YYYY format)');
    console.log('Joining Date:', employeeData.joiningDate, '(DD-MM-YYYY format)');
    console.log('Duty Start Time:', employeeData.dutyStartTime, '(LocalTime format)');
    console.log('Duty End Time:', employeeData.dutyEndTime, '(LocalTime format)');

    return employeeData;
};
