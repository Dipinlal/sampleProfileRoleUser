import React, { useEffect, useState } from "react";
import { Button, Stack, Box, Zoom, Typography, FormGroup, FormControlLabel, Checkbox, MenuItem, Menu, IconButton } from "@mui/material";
import { MDBRow, MDBCol, MDBInput } from "mdb-react-ui-kit";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import Loader from "../Loader/Loader";
import { DeleteUser, GetMenuData, GetRoles, GetUserDetails, UpsertUser } from "../../api/Api";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { colourTheme, secondaryColorTheme } from "../../config";

import Swal from "sweetalert2";

import ErrorMessage from "../ErrorMessage/ErrorMessage";
import AutoComplete3 from "./AutoComplete";
import GetRoleAutocomplete from "./AutoComplete";
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const buttonStyle = {
    textTransform: "none",
    color: `#fff`,
    backgroundColor: `#1976d2`,
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
};

const customFormGroupStyle1 = {
    border: '1px solid #ccc',
    borderRadius: '10px',
    maxHeight: '550px', // Adjust as needed
    overflowY: 'auto', // Hide vertical overflow
    overflowX: 'auto', // Allow horizontal scrolling
    padding: '10px',
    width: '472px',
    height: '450px'

};






function Modal({ isOpen, handleNewClose, mode, resetChangesTrigger, formDataEdit }) {
    const getInitialFormData = () => {
        return {
            id: 0,
            LoginName: "",
            UserName: "",
            Password: "",
            Phone: "",
            Email: "",
            iRole: 0,
            isWebUser: true,
            isMobileUser: true,
            // upsertUserId: 0,
            // sRole:""
        }
    };

    const [open, setOpen] = React.useState(false);
    const [warning, setWarning] = useState(false);
    const [message, setMessage] = useState("");
    const [menu, setMenu] = React.useState([]);
    const [mode1, setMode1] = useState("");
    const [role, setRoles] = React.useState([]);
    const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

    const [formData, setFormData] = useState({});
    const [iIds, setIids] = useState()

    const modalStyle = {
        display: isOpen ? "block" : "none",
    };

    useEffect(() => {
        setMode1(mode);
        setIids(formDataEdit)
    }, [mode, formDataEdit]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await GetMenuData()
                const data = JSON.parse(response.result)
                setMenu(data)
            } catch (error) {
                console.log("get menus", error);
            }
        }
        fetchData()

        const GetRole = async () => {
            try {
                const response = await GetRoles()
                const data = JSON.parse(response.result)
                setRoles(data)
            } catch (error) {
                console.log("GetRoles", error);
            }
        }
        GetRole()

        const GetUserDetail = async () => {
            try {
                const response = await GetUserDetails({ userId: iIds })
                const data = JSON.parse(response.result)
                const id = data.map((item) => item.iId)
                const LoginName = data.map((item) => item.sLoginName)
                const UserName = data.map((item) => item.sUserName)
                const Password = data.map((item) => item.sPassword)
                const phoneNumber = data.map((item) => item.sPhoneNo)
                const Email = data.map((item) => item.sEmail)
                const role = data.map((item) => item.iRole)
                const sRoleName = data.map((item) => item.sRoleName)


                setFormData({
                    ...formData,
                    id: id.join(','),
                    LoginName: LoginName.join(','),
                    UserName: UserName.join(','),
                    Password: Password.join(','),
                    Phone: phoneNumber.join(','),
                    Email: Email.join(','),
                    iRole: role.join(','),
                    sRole: sRoleName.join(','),
                    isWebUser: true,
                    isMobileUser: true,
                    upsertUserId: 0
                })
            } catch (error) {
                console.log("GetUserDetails", error);
            }
        }
        if (iIds > 0) {
            GetUserDetail()

        }
        if (mode1 === "new") {
            setFormData(getInitialFormData());
        }
    }, [mode1, iIds])



    const hndleAction = async (obj) => {
        if (obj) {
            setRoles(obj)
        } else {
            setRoles(0)
        }
    }

    const handleSaveAccount = async () => {
        if (!formData.LoginName) {
            Swal.fire({
                title: "Error!",
                text: "Login Name is required",
                icon: "error",
                confirmButtonText: "Ok",
                confirmButtonColor: secondaryColorTheme,
            });
            return;
        }
        if (!formData.iRole) {
            Swal.fire({
                title: "Error!",
                text: "Role is required",
                icon: "error",
                confirmButtonText: "Ok",
                confirmButtonColor: secondaryColorTheme,
            });
            return;
        }
        if (!formData.UserName) {
            Swal.fire({
                title: "Error!",
                text: "UserName is required",
                icon: "error",
                confirmButtonText: "Ok",
                confirmButtonColor: secondaryColorTheme,
            });
            return;
        }

        if (!formData.Password) {
            Swal.fire({
                title: "Error!",
                text: "Password is required.",
                icon: "error",
                confirmButtonText: "Ok",
                confirmButtonColor: secondaryColorTheme,
            });
            return;
        } else if (
            !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/.test(
                formData.Password
            )
        ) {
            Swal.fire({
                title: "Error!",
                text:
                    "Password must be at least 6 characters long and include at least one letter, one number, and one special character.",
                icon: "error",
                confirmButtonText: "Ok",
                confirmButtonColor: secondaryColorTheme,
            });
            return;
        }

        // Regular expression for email validation
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!formData.Email) {
            Swal.fire({
                title: "Error!",
                text: "Email is required",
                icon: "error",
                confirmButtonText: "Ok",
                confirmButtonColor: secondaryColorTheme,
            });
            return;
        } else if (!emailRegex.test(formData.Email)) {
            Swal.fire({
                title: "Error!",
                text: "Invalid email format",
                icon: "error",
                confirmButtonText: "Ok",
                confirmButtonColor: secondaryColorTheme,
            });
            return;
        }

        if (!formData.Phone) {
            Swal.fire({
                title: "Error!",
                text: "Phone number is required.",
                icon: "error",
                confirmButtonText: "Ok",
                confirmButtonColor: secondaryColorTheme,
            });
            return;
        } else if (!/^\d{10}$/.test(formData.Phone)) {
            Swal.fire({
                title: "Error!",
                text: "Please enter a valid 10-digit phone number.",
                icon: "error",
                confirmButtonText: "Ok",
                confirmButtonColor: secondaryColorTheme,
            });
            return;
        }

        try {
            const res = await UpsertUser({
                id: formData.id,
                LoginName: formData.LoginName,
                UserName: formData.UserName,
                Password: formData.Password,
                phoneNumber: formData.Phone,
                Email: formData.Email,
                role: formData.iRole,
                isWebUser: true,
                isMobileUser: true,
                upsertUserId: 0,
            });
            if (res.status === "Success") {
                if (res.message === "User Inserted" || res.message === "User Updated") {
                    Swal.fire({
                        title: "Success!",
                        text: `${res.message}`,
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                } else {
                    handleOpenAlert();
                    setMessage(`${res.message}`);
                    return;
                }
            }
            handleNewClose();
        } catch (error) {
            console.log("UpsertUser", error);
            if (error.response?.data?.message) {
                Swal.fire({
                    title: "Error!",
                    text: `${error.response.data.message}`,
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500,
                });
            } else {
                Swal.fire({
                    title: "Error!",
                    text: `${error.message}`,
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        }
    };


    const handleAllClear = () => {
        handleNewClose();
        // handleClear();
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleOpenAlert = () => {
        setWarning(true);
    };

    const handleCloseAlert = () => {
        setWarning(false);
    };
    const newButtonClick = () => {
        setMode1("new");
        setFormData(getInitialFormData())
        setIids(0)

    };


    // const handleDelete = async () => {


    //     try {
    //         if (!iIds) {
    //             Swal.fire({
    //                 title: "Error!",
    //                 text: "choose data!!",
    //                 icon: "error",
    //                 showConfirmButton: false,
    //                 timer: 1500,
    //             });
    //         } else {
    //             const shouldDelete = await Swal.fire({
    //                 title: 'Are you sure?',
    //                 text: "You won't be able to revert this!.",
    //                 icon: 'warning',
    //                 showCancelButton: true,
    //                 confirmButtonText: 'Yes, delete it!',
    //                 cancelButtonText: 'No, cancel it!'
    //             });

    //             if (shouldDelete.isConfirmed) {
    //                 const res = await DeleteUser({ userId: iIds });
    //                 // Add success message here if needed
    //                 Swal.fire('Deleted!', 'The User has been deleted.', 'success');
    //             }
    //         }
    //         resetChangesTrigger()
    //         handleNewClose()

    //     } catch (error) {
    //         console.log("delete", error);
    //         // Add error message here if needed
    //         Swal.fire('Error', 'Failed to delete the User.', 'error');
    //         resetChangesTrigger()
    //         handleNewClose()

    //     }

    // }


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    return (
        <div><div
            className={`modal-backdrop fade ${isOpen ? "show" : ""}`}
            style={{
                display: isOpen ? "block" : "none",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
            }}
        ></div>
            <Zoom in={isOpen} timeout={isOpen ? 400 : 300}>
                <div
                    className={`modal ${isOpen ? "modal-open" : ""}`}
                    style={modalStyle}
                >
                    <div style={{ marginTop: "10%", width: "40%", marginLeft: "30%", height: "60%" }} >
                        <div className="modal-content">
                            <form>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    padding={2}
                                    justifyContent="flex-end"
                                >
                                    <Button
                                        onClick={newButtonClick}
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        style={buttonStyle}
                                    >
                                        New
                                    </Button>
                                    <Button
                                        onClick={handleSaveAccount}
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        style={buttonStyle}
                                    >
                                        Save
                                    </Button>
                                    {/* <Button
                                        onClick={handleDelete}
                                        variant="contained"
                                        startIcon={<CloseIcon />}
                                        style={buttonStyle}
                                    >
                                        Delete
                                    </Button> */}
                                    <Button
                                        onClick={handleAllClear}
                                        variant="contained"
                                        startIcon={<CloseIcon />}
                                        style={buttonStyle}
                                    >
                                        Close
                                    </Button>
                                </Stack>
                                <Box
                                    sx={{
                                        width: "auto",
                                        marginTop: 1,
                                        padding: 3,
                                        zIndex: 1,
                                        backgroundColor: "#ffff",
                                        borderRadius: 2,
                                    }}
                                >
                                    <div className="attendanceNewContainer">

                                        <div style={{ display: 'flex', marginBottom: '10px' }}>
                                            <MDBCol >
                                                <Typography  > Login Name <span style={{ color: '#1976D2', marginLeft: '1px' }}>*</span></Typography>
                                            </MDBCol>
                                            <MDBCol >
                                                <MDBInput
                                                    required
                                                    // value={name}
                                                    id="form6Example1"
                                                    maxLength={100}
                                                    name="LoginName"
                                                    value={formData.LoginName}
                                                    onChange={handleInputChange}
                                                    labelStyle={{
                                                        fontSize: "15px",
                                                    }}
                                                />

                                            </MDBCol>
                                        </div>
                                        <div style={{ display: 'flex', marginBottom: '10px' }}>
                                            <MDBCol >
                                                <Typography  > ERP Role <span style={{ color: '#1976D2', marginLeft: '1px' }}>*</span></Typography>
                                            </MDBCol>
                                            <MDBCol >
                                                <GetRoleAutocomplete
                                                    formData={formData}
                                                    setFormData={setFormData}
                                                    autoId={`Role`}
                                                    apiKey={"GetRoles"}
                                                    formDataName={"sRole"}
                                                    formDataiId={"iRole"} />
                                            </MDBCol>
                                        </div>
                                        <div style={{ display: 'flex', marginBottom: '10px' }}>
                                            <MDBCol >
                                                <Typography  > User Name <span style={{ color: '#1976D2', marginLeft: '1px' }}>*</span></Typography>
                                            </MDBCol>
                                            <MDBCol >
                                                <MDBInput
                                                    required
                                                    // value={name}
                                                    id="form6Example1"
                                                    maxLength={100}
                                                    name="UserName"
                                                    value={formData.UserName}
                                                    onChange={handleInputChange} labelStyle={{
                                                        fontSize: "15px",
                                                    }}
                                                />

                                            </MDBCol>
                                        </div>
                                        <div style={{ display: 'flex', marginBottom: '10px' }}>
                                            <MDBCol >
                                                <Typography  > Password <span style={{ color: '#1976D2', marginLeft: '1px' }}>*</span></Typography>
                                            </MDBCol>
                                            <div style={{ position: 'relative', width: '50%' }}>
                                                <MDBInput
                                                    required
                                                    id="form6Example3"
                                                    type={showPassword ? 'text' : 'password'} // Toggle type based on showPassword state
                                                    name="Password"
                                                    value={formData.Password}
                                                    onChange={handleInputChange}
                                                    icon={null} // Remove default eye icon

                                                />
                                                <div
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        right: '10px',
                                                        transform: 'translateY(-50%)',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    {showPassword ? <LockOpenIcon /> : <LockIcon />}
                                                </div>
                                            </div>
                                            {/* <MDBCol >
                                                <MDBInput
                                                    required
                                                    // value={name}
                                                    id="form6Example1"
                                                    maxLength={100}
                                                    name="Password"
                                                    type="password"
                                                    value={formData.Password}
                                                    onChange={handleInputChange} labelStyle={{
                                                        fontSize: "15px",
                                                    }}
                                                />

                                            </MDBCol> */}
                                        </div>
                                        {/* <div style={{ display: 'flex', marginBottom: '10px' }}>
                                            <MDBCol >
                                                <Typography  > Confirm Password</Typography>
                                            </MDBCol>
                                            <MDBCol >
                                                <MDBInput
                                                    required
                                                    // value={name}
                                                    id="form6Example1"
                                                    maxLength={100}
                                                    label="Confirm Password"
                                                    name="ConfirmPassword"
                                                    value={formData.ConfirmPassword}
                                                    onChange={handleInputChange} labelStyle={{
                                                        fontSize: "15px",
                                                    }}
                                                />

                                            </MDBCol>
                                        </div> */}
                                        <div style={{ display: 'flex', marginBottom: '10px' }}>
                                            <MDBCol >
                                                <Typography  > Email <span style={{ color: '#1976D2', marginLeft: '1px' }}>*</span></Typography>
                                            </MDBCol>
                                            <MDBCol >
                                                <MDBInput
                                                    required
                                                    // value={name}
                                                    id="form6Example1"
                                                    maxLength={100}
                                                    name="Email"
                                                    value={formData.Email}
                                                    onChange={handleInputChange} labelStyle={{
                                                        fontSize: "15px",
                                                    }}
                                                />

                                            </MDBCol>
                                        </div>
                                        <div style={{ display: 'flex', marginBottom: '10px' }}>
                                            <MDBCol >
                                                <Typography  > Phone No <span style={{ color: '#1976D2', marginLeft: '1px' }}>*</span></Typography>
                                            </MDBCol>
                                            <MDBCol >
                                                <MDBInput
                                                    required
                                                    // value={name}
                                                    id="form6Example1"
                                                    maxLength={100}
                                                    name="Phone"
                                                    value={formData.Phone}
                                                    // type="number"

                                                    onChange={handleInputChange} labelStyle={{
                                                        fontSize: "15px",
                                                    }}
                                                />

                                            </MDBCol>
                                        </div>

                                    </div>
                                </Box>

                            </form>
                        </div>
                    </div>
                </div>

            </Zoom >
            <Loader open={open} handleClose={handleClose} />
            <ErrorMessage
                open={warning}
                handleClose={handleCloseAlert}
                message={message}
            />
        </div>
    )
}

export default Modal