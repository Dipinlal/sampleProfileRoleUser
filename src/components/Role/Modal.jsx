import React, { useEffect, useState } from "react";
import { Button, Stack, Box, Zoom, Typography, FormGroup, FormControlLabel, Checkbox, MenuItem, Menu, IconButton } from "@mui/material";
import { MDBRow, MDBCol, MDBInput } from "mdb-react-ui-kit";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import Loader from "../Loader/Loader";
import { DeleteProfile, GetActions, GetMenuData, GetRoleDetails, UpsertRole } from "../../api/Api";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { colourTheme, secondaryColorTheme } from "../../config";

import { TreeView, TreeItem } from '@mui/x-tree-view';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FolderIcon from "@mui/icons-material/Folder";
// import { makeStyles } from "@material-ui/core";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
// import { createTheme, ThemeProvider } from "@mui/material/styles";
import DescriptionIcon from '@mui/icons-material/Description';
import Swal from "sweetalert2";


import SvgIcon from '@mui/material/SvgIcon';

import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AssignedProfile from "./tabs/AssignedProfile";
import Addition from "./tabs/Addition";
import Exclusion from "./tabs/Exclusion";
import MasterRistriction from "./tabs/masterRistriction";
import Transaction from "./tabs/Transaction";


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
    width: '572px',

};

const customFormGroupStyle2 = {
    border: '1px solid #ccc',
    borderRadius: '10px',
    maxHeight: '550px', // Adjust as needed
    overflowY: 'auto', // Hide vertical overflow
    overflowX: 'auto', // Allow horizontal scrolling
    padding: '10px',
    width: '60px',

};



function Modal({ isOpen, handleNewClose, mode, resetChangesTrigger, formDataEdit }) {
    const [open, setOpen] = React.useState(false);
    const [warning, setWarning] = useState(false);
    const [message, setMessage] = useState("");
    const [id, setId] = useState(0);
    const [name, setName] = useState("");
    const [menu, setMenu] = React.useState([]);
    const [mode1, setMode1] = useState("");

    const [value, setValue] = React.useState(0);

    const [AssignedProfiles, setAssignedProfiles] = useState([]);
    const [AssignedProfilesObj, setAssignedProfilesobj] = useState([]);
    const [profileId, setProfileId] = useState([])

    const [additions, setAdditions] = useState([]);
    const [exclutions, setexclutions] = useState([]);
    const [masters, setMasters] = useState([]);
    const [transactions, settransactions] = useState({});
    const [newState, setNewState] = useState(false)

    // const setParentFunc=((value,masteriId)=>{
    //     if(masteriId){
    //         console.log(value,masteriId,"value,masteriId");
    //         setMasters([{...masters,[masteriId]:value}])
    //     }
        

    // })

    const setParentFunc = (value, masteriId) => {
        if (value == null || masteriId == null) {
           
            return; // Exit if data or masterId is invalid
        }
        setMasters((prevMasters) => {
            const index = prevMasters.findIndex((data) => data[masteriId]);
            if (index !== -1) {
                // Clone the array and modify only the specific entry
                const updatedMasters = [...prevMasters];
                updatedMasters[index] = { [masteriId]: value };
                return updatedMasters;
            } else {
                // Add new data entry if not found
                return [...prevMasters, { [masteriId]: value }];
            }
        });
    };
    
   
        const flattenMastersData = (masters) => {
            // Start with an empty array
            let combinedArray = [];
        
            // Iterate through each masteriId object
            masters.forEach((masterObject) => {
                const masterId = Object.keys(masterObject)[0]; // Get the masterId, assuming there's only one key per object
                const items = masterObject[masterId]; // Get the array of items for this masterId
        
                // Add masterId to each item and add to the combined array
                const enhancedItems = items.filter(item => item.TagName !== "").map(item => ({
                    ...item,
                    iMasterTypeId: masterId // Ensure all items include their masterId
                }));
                
                combinedArray = combinedArray.concat(enhancedItems);
            });
        
            return combinedArray;
        };
       
        
  
    
    


    const parentData = [{
        1: [{
            bMaster: true,
            bReport: true,
            bTransaction: true,
            bView: true,
            TagName: "Backing Washer",
            iTagId: 2533,
            iMasterTypeId: 1,
        },
        {
            bMaster: true,
            bReport: true,
            bTransaction: true,
            bView: true,
            TagName: "Backing Washer",
            iTagId: 2533,
            iMasterTypeId: 1,
        }
        ]
    },    {
        2: [{
            bMaster: false,
            bReport: false,
            bTransaction: true,
            bView: true,
            TagName: "Backing Washer",
            iTagId: 2533,
            iMasterTypeId: 2,
        }, {
            bMaster: true,
            bReport: true,
            bTransaction: false,
            bView: true,
            TagName: "Backing Washer",
            iTagId: 2533,
            iMasterTypeId: 2,
        }]
    }]

    //ADDITION ACTION DATA CONVERTING OBJECTVISE--------------------------------------------------------------------------------------------
    const additiondata = additions.flatMap(item => {
        const combinedIds = item.combinedIds;
        return combinedIds.map(combinedId => {
            const [iMenu, iAction] = combinedId.split('_');
            return {
                iMenu: parseInt(iMenu),
                iAction: parseInt(iAction)
            };
        });
    });


    //exclution action data converting object----------------------------------------------------------------------------------------------
    const exclutiondata = exclutions.length > 0 ? exclutions.flatMap(item => {
        const combinedIds = item.combinedIds;
        return combinedIds.map(combinedId => {
            const [iMenu, iAction] = combinedId.split('_');
            return {
                iMenu: parseInt(iMenu),
                iAction: parseInt(iAction)
            };
        });
    }) : [];


    





    //AssignedProfiles NAME TO CONVERT ID------------------------------------------------------------------------------------------------
    React.useEffect(() => {
        if (Array.isArray(AssignedProfilesObj)) {
            const allProfiles = AssignedProfilesObj.map((item) => item.sProfileName);

            if (AssignedProfiles.every((profile) => allProfiles.includes(profile))) {
                const matchingProfiles = AssignedProfilesObj.filter((item) =>
                    AssignedProfiles.includes(item.sProfileName)
                );

                const matchingIds = matchingProfiles.map((item) => item.iProfileId);

                const profileIds = matchingIds.join(', '); // This will result in "51, 27, 33"
                setProfileId(profileIds);
            }
        } else {
           
        }
    }, [AssignedProfiles, AssignedProfilesObj]);

    const ProfileId = JSON.parse(localStorage.getItem('profileId'));


    const modalStyle = {
        display: isOpen ? "block" : "none",
    };

    useEffect(() => {
        setMode1(mode);
    }, [mode]);
    console.log("123")
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

    }, [])

    useEffect(() => {
        let roleId = formDataEdit

        const GetProfileDetails7 = async () => {
            try {
                const response = await GetRoleDetails({ roleId: roleId })
                const data = JSON.parse(response.result)
                const datas = data.map((item) => item.sRoleName);
                setName(datas[0])
            } catch (error) {
                console.log("Get RoleDetails", error);
            }
        }
        if (formDataEdit > 0) {
            GetProfileDetails7()
        }
    }, [])
    


    const handleSaveAccount = async () => {
        const flattenedData = flattenMastersData(masters);
        if (mode1 === "edit") {
            if (!name) {
                Swal.fire({
                    title: "Error!",
                    text: "UserName is required",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500,
                });
                return;
            }
            if (!ProfileId) {
                Swal.fire({
                    title: "Error!",
                    text: "choose Profile!!",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500,
                });
                return;
            }
            try {
                const response = await UpsertRole({
                    roleId: formDataEdit,
                    roleName: name,
                    profileId: ProfileId,
                    rolesMasters: flattenedData,
                    roleTransRights: transactions,
                    menuActionAddition: additiondata,
                    menuActionExclusion: exclutiondata
                })
                const result = JSON.parse(response.result)
                if (response.message === "Role Inserted Successfully." || response.message === "Role Updated Successfully.") {
                    Swal.fire({
                        title: "Success!",
                        text: `${response.message}`,
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                } else {
                    //   handleOpenAlert();
                    setMessage(`${response.message}`);
                    return;
                }
                resetChangesTrigger()
                handleNewClose()
            } catch (error) {
                console.log("Get UpsertRole ", error)
            }
        } else {
            if (!name) {
                Swal.fire({
                    title: "Error!",
                    text: "name is required",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500,
                });
                return;
            }
            if (!ProfileId) {
                Swal.fire({
                    title: "Error!",
                    text: "choose Profile!!",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500,
                });
                return;
            }
            try {
                
                const response = await UpsertRole({
                    roleId: 0,
                    roleName: name,
                    profileId: ProfileId,
                    rolesMasters: flattenedData,
                    roleTransRights: transactions,
                    menuActionAddition: additiondata,
                    menuActionExclusion: exclutiondata
                })
                if (response.message === "Role Inserted Successfully." || response.message === "Role Updated Successfully.") {
                    Swal.fire({
                        title: "Success!",
                        text: `${response.message}`,
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                } else {
                    //   handleOpenAlert();
                    setMessage(`${response.message}`);
                    return;
                }
                resetChangesTrigger()
                handleNewClose()
            } catch (error) {
                console.log("Role UpsertRole ", error)

                if (error.response.data.message) {
                    Swal.fire({
                        title: "Error!",
                        text: `${error.response.data.message}`,
                        icon: "error",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    if (error.response.data.statusCode===409) {
                        Swal.fire({
                            title: "Error!",
                            text: `${error.response.data.message}`,
                            icon: "error",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    }else{
                        handleNewClose()

                    }
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
        }


    }

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

        setName('')

        setNewState(true)
    };







    const handleDelete = async () => {
        try {
            if (!formDataEdit) {
                Swal.fire({
                    title: "Error!",
                    text: "choose data!!",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500,
                });
            } else {
                const shouldDelete = await Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, delete it!',
                    cancelButtonText: 'No, cancel it'
                });

                if (shouldDelete.isConfirmed) {
                    const res = await DeleteProfile({ profileId: formDataEdit });
                    // Add success message here if needed
                    Swal.fire('Deleted!', 'The Role has been deleted.', 'success');
                }
            }
            handleNewClose()
            resetChangesTrigger()

        } catch (error) {
            console.log("delete", error);
            // Add error message here if needed
            Swal.fire('Error', 'Failed to delete the Role.', 'error');
            resetChangesTrigger()
            handleNewClose()
        }

    }



    const handleChange = (event, newValue) => {
        setValue(newValue);
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
                    <div style={{ marginTop: "", width: "80%", marginLeft: "150px" }} >
                        <div className="modal-content">
                            <form>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    padding={2}
                                    justifyContent="flex-end"
                                >
                                    {/* <Button
                                        onClick={newButtonClick}
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        style={buttonStyle}
                                    >
                                        New
                                    </Button> */}
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
                                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                            <MDBCol sx={{ width: "10px" }}>
                                                <MDBInput
                                                    required
                                                    value={name}
                                                    id="form6Example1"
                                                    maxLength={100}
                                                    label="Name"
                                                    onChange={(e) => setName(e.target.value)}
                                                    labelStyle={{
                                                        fontSize: "15px",
                                                    }}
                                                    style={{
                                                        width: "200px", // Adjust the width as per your preference
                                                    }}
                                                />

                                            </MDBCol>
                                        </Box>
                                        <Box sx={{ width: '100%' }}>
                                            <Box sx={{ borderBottom: 1, borderColor: 'divider', }}>
                                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                                    <Tab label="Assigned Profiles" id="simple-tab-0" aria-controls="simple-tabpanel-0" sx={{ fontSize: 'small' }} />
                                                    <Tab label="Addition" id="simple-tab-1" aria-controls="simple-tabpanel-1" sx={{ fontSize: 'small' }} />
                                                    <Tab label="Exclusion" id="simple-tab-2" aria-controls="simple-tabpanel-2" sx={{ fontSize: 'small' }} />
                                                    <Tab label="Master Restriction" id="simple-tab-3" aria-controls="simple-tabpanel-3" sx={{ fontSize: 'small' }} />
                                                    <Tab label="Transaction Rights" id="simple-tab-4" aria-controls="simple-tabpanel-4" sx={{ fontSize: 'small' }} />
                                                </Tabs>
                                            </Box>
                                            <div role="tabpanel" hidden={value !== 0} id="simple-tabpanel-0" aria-labelledby="simple-tab-0">
                                                {value === 0 && (
                                                    <Box sx={{ p: 3 }}>
                                                        <AssignedProfile roleId={formDataEdit}
                                                            setAssignedProfiles={setAssignedProfiles}
                                                            setAssignedProfilesobj={setAssignedProfilesobj}
                                                            AssignedProfiles={AssignedProfiles}
                                                            AssignedProfilesObj={AssignedProfilesObj}
                                                            setNewState={setNewState}
                                                            newState={newState}
                                                            mode={mode} />

                                                    </Box>
                                                )}
                                            </div>
                                            <div role="tabpanel" hidden={value !== 1} id="simple-tabpanel-1" aria-labelledby="simple-tab-1">
                                                {value === 1 && (
                                                    <Box sx={{ p: 3 }}>
                                                        <Addition formDataEdit={formDataEdit}
                                                            setAdditions={setAdditions}
                                                            additions={additions}
                                                            setNewState={setNewState}
                                                            newState={newState}
                                                            mode={mode} />
                                                    </Box>
                                                )}
                                            </div>
                                            <div role="tabpanel" hidden={value !== 2} id="simple-tabpanel-2" aria-labelledby="simple-tab-2">
                                                {value === 2 && (
                                                    <Box sx={{ p: 3 }}>
                                                        <Exclusion formDataEdit={formDataEdit}
                                                            setexclutions={setexclutions}
                                                            setNewState={setNewState}
                                                            exclutions={exclutions}
                                                            newState={newState}
                                                            mode={mode} />
                                                    </Box>
                                                )}
                                            </div>
                                            <div role="tabpanel" hidden={value !== 3} id="simple-tabpanel-3" aria-labelledby="simple-tab-3">
                                                {value === 3 && (
                                                    <Box sx={{ p: 3 }}>
                                                        <MasterRistriction formDataEdit={formDataEdit}
                                                        setParentFunc={setParentFunc}
                                                            setMasters={setMasters}
                                                            setNewState={setNewState}
                                                            masterData={masters}
                                                            newState={newState}
                                                            mode={mode}
                                                            mode1={mode1}
                                                            parentData={parentData}
                                                        />
                                                    </Box>
                                                )}
                                            </div>
                                            <div role="tabpanel" hidden={value !== 4} id="simple-tabpanel-4" aria-labelledby="simple-tab-4">
                                                {value === 4 && (
                                                    <Box sx={{ p: 3 }}>
                                                        <Transaction formDataEdit={formDataEdit}
                                                            settransactions={settransactions}
                                                            setNewState={setNewState}
                                                            newState={newState}
                                                            transactions={transactions}
                                                            mode={mode}
                                                        />
                                                    </Box>
                                                )}
                                            </div>

                                        </Box>



                                        <div style={{ display: 'flex' }}>




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