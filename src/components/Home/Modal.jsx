import React, { useEffect, useState } from "react";
import { Button, Stack, Box, Zoom, Typography, FormGroup, FormControlLabel, Checkbox, MenuItem, Menu, IconButton } from "@mui/material";
import { MDBRow, MDBCol, MDBInput } from "mdb-react-ui-kit";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import Loader from "../Loader/Loader";
import { DeleteProfile, GetActions, GetMenuData, GetProfileDetails, UpsertProfile } from "../../api/Api";
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


import { useSpring, animated } from '@react-spring/web';
import SvgIcon from '@mui/material/SvgIcon';

import Collapse from '@mui/material/Collapse';
import { alpha, styled } from '@mui/material/styles';
import { treeItemClasses } from '@mui/x-tree-view/TreeItem';
import ErrorMessage from "../ErrorMessage/ErrorMessage";

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
    width: '100%',
    height: '450px'

};


///TREE VIEW ITEMS----------------------------------------------------------------------------------------------------------------------
function MinusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
        </SvgIcon>
    );
}

function PlusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
        </SvgIcon>
    );
}

function CloseSquare(props) {
    return (
        <SvgIcon
            className="close"
            fontSize="inherit"
            style={{ width: 14, height: 14 }}
            {...props}
        >
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
        </SvgIcon>
    );
}



function StyledTreeItem(props) {
    // Implement your StyledTreeItem component here
    return (
        <TreeItem
            label={
                <div>
                    <Typography variant="body2">
                        {props.labelText}
                    </Typography>
                </div>
            }
            {...props}
        />
    );
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////





function Modal({ isOpen, handleNewClose, mode, resetChangesTrigger, formDataEdit }) {
    const [open, setOpen] = React.useState(false);
    const [warning, setWarning] = useState(false);
    const [message, setMessage] = useState("");
    const [id, setId] = useState(0);
    const [name, setName] = useState("");
    const [menu, setMenu] = React.useState([]);
    const [ActionButton, setActionButton] = React.useState([]);
    const [SelectActionButton, setSelectActionButton] = React.useState([]);
    const [menuId, setMenuId] = React.useState([]);
    const [mode1, setMode1] = useState("");
    const [ProfileId, setProfileId] = useState();



    const modalStyle = {
        display: isOpen ? "block" : "none",
    };

    useEffect(() => {
        setMode1(mode);
        setProfileId(formDataEdit)

    }, [mode]);

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
        const GetProfileDetails7 = async () => {
            let profilId = formDataEdit
            try {
                const response = await GetProfileDetails({ profileId: profilId })
                const data = JSON.parse(response.result)
                const datas = data.Table.map((item) => item.sProfileName);
                const datas1 = data.Table1.map((item) => item);
                const datas2 = datas1.map((item) => (item.iMenuId));
                if (datas1.length > 0) {
                    const combinedIdsMap = new Map(); // Use a map to group combinedIds by menuId
                    datas1.forEach(actionItem => {
                        const key = actionItem.iMenuId;
                        const combinedId = `${actionItem.iMenuId}_${actionItem.iActionId}`;
                        if (combinedIdsMap.has(key)) {
                            combinedIdsMap.get(key).push(combinedId);
                        } else {
                            combinedIdsMap.set(key, [combinedId]);
                        }
                    });
                
                    const selectActionButton = Array.from(combinedIdsMap).map(([menuId, combinedIds]) => ({
                        menuId: menuId,
                        combinedIds: combinedIds
                    }));
                
                    setSelectActionButton(selectActionButton);
                    setMenuId(datas2[0]);
                }
                setName(datas[0])

            } catch (error) {
                console.log("get menus", error);
            }
        }
        if (formDataEdit > 0) {
            GetProfileDetails7()
        }
    }, [])

    const handleClickEvents = async (thirdMenu,subMenu,menuList) => {
      
        try {
            const response = await GetActions({
                menuId: thirdMenu.iId
            })
            const data = JSON.parse(response.result)
            setActionButton(data)
            setMenuId(thirdMenu.iId)
        } catch (error) {
            console.log("Get Actions ", error)
        }
    };

const ClickEvents= async (subMenu,menuList) => {
    try {
        const response = await GetActions({
            menuId: subMenu.iId
        })
        const data = JSON.parse(response.result)
        setActionButton(data)
        setMenuId(subMenu.iId)
    } catch (error) {
        console.log("Get Actions ", error)
    }
}

    // useEffect(()=>{
    //     const dataArray = SelectActionButton.map(item => {
    //         const [iMenu, iAction] = item.split('_');
    //         return {
    //             iMenu: parseInt(iMenu),
    //             iAction: parseInt(iAction)
    //         };
    //     });

    //     const data = {
    //         profileId: formDataEdit,
    //         profileName: name,
    //     }
    //     setBody(dataArray)
    //     sethead(data)
    // },[])



    const handleSaveAccount = async () => {
        if (mode1 === "edit") {
            const dataArray = SelectActionButton.flatMap(item => {
                const combinedIds = item.combinedIds;
                return combinedIds.map(combinedId => {
                    const [iMenu, iAction] = combinedId.split('_');
                    return {
                        iMenu: parseInt(iMenu),
                        iAction: parseInt(iAction)
                    };
                });
            });
            
            if (!dataArray.length > 0) {
                Swal.fire({
                    title: "Error!",
                    text: "Action is required",
                    icon: "error",
                    confirmButtonText: "Ok",
                    confirmButtonColor: secondaryColorTheme,
                });
                return;
            }
            if (!name) {
                Swal.fire({
                    title: "Error!",
                    text: "UserName is required",
                    icon: "error",
                    confirmButtonText: "Ok",
                    confirmButtonColor: secondaryColorTheme,
                });
                return;
            }
            const data = {
                profileId: formDataEdit,
                profileName: name,
            }


            try {
                const response = await UpsertProfile(data, dataArray)
                // const result = JSON.parse(response.result)
                // if (response.status === "Success") {
                if (response.message === "Inserted Successfully" || response.message === "Updated Successfully") {
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
                //   }
                resetChangesTrigger()
                handleNewClose()
            } catch (error) {
                console.log("Get UpsertProfile ", error.response)
                Swal.fire({
                    title: "Error!",
                    text: `${error.response.data.message}`,
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        } else {
            if (!name) {
                Swal.fire({
                    title: "Error!",
                    text: "name is required",
                    icon: "error",
                    confirmButtonText: "Ok",
                    confirmButtonColor: secondaryColorTheme,
                });
                return;
            }
            const dataArray = SelectActionButton.flatMap(item => {
                const combinedIds = item.combinedIds;
                return combinedIds.map(combinedId => {
                    const [iMenu, iAction] = combinedId.split('_');
                    return {
                        iMenu: parseInt(iMenu),
                        iAction: parseInt(iAction)
                    };
                });
            });
            
            

            
            if (!dataArray.length > 0) {
                Swal.fire({
                    title: "Error!",
                    text: "Action is required",
                    icon: "error",
                    confirmButtonText: "Ok",
                    confirmButtonColor: secondaryColorTheme,
                });
                return;
            }

            const data = {
                profileId: ProfileId,
                profileName: name,
            }
            try {
                const response = await UpsertProfile(data, dataArray)
                if (response.message === "Inserted Successfully" || response.message === "Updated Successfully") {
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

                console.log("Get UpsertProfile ", error.response.data.message)
                Swal.fire({
                    title: "Error!",
                    text: `${error.response.data.message}`,
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500,
                });
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
        setName("")
        setSelectActionButton("")
        setProfileId(0)

    };



    const handleCheckboxChange = (iActionId) => {
        const combinedId = `${menuId}_${iActionId}`;
        setSelectActionButton((prevItems) => {
            if (Array.isArray(prevItems)) { // Check if prevItems is an array
                const existingIndex = prevItems.findIndex(item => item.menuId === menuId);

                if (existingIndex !== -1) {
                    // If menuId exists, update its combinedIds
                    const updatedActionItem = {
                        ...prevItems[existingIndex],
                        combinedIds: prevItems[existingIndex].combinedIds.includes(combinedId) ?
                            prevItems[existingIndex].combinedIds.filter(id => id !== combinedId) :
                            [...prevItems[existingIndex].combinedIds, combinedId]
                    };

                    // Update SelectActionButton with the updated object
                    const updatedSelectActionButton = [...prevItems];
                    updatedSelectActionButton[existingIndex] = updatedActionItem;
                    return updatedSelectActionButton;
                } else {
                    // If menuId does not exist, add it to SelectActionButton
                    const newSelectActionItem = {
                        menuId: menuId,
                        combinedIds: [combinedId]
                    };

                    // Update SelectActionButton with the new object
                    return [...prevItems, newSelectActionItem];
                }
            } else {
                // If it's not an array, initialize with newSelectActionItem
                const newSelectActionItem = {
                    menuId: menuId,
                    combinedIds: [combinedId]
                };
                return [newSelectActionItem];
            }
        });
    };


    // const handleCheckboxChange = (iActionId) => {
    //     const combinedId = `${menuId}_${iActionId}`
    //     setSelectActionButton((prevItems) => {
    //         if (Array.isArray(prevItems)) { // Check if prevItems is an array
    //             if (prevItems.includes(combinedId)) {
    //                 return prevItems.filter((id) => id !== combinedId); // Deselect if already selected
    //             } else {
    //                 return [...prevItems, combinedId]; // Select if not selected
    //             }
    //         } else {
    //             return [combinedId]; // If it's not an array, initialize with iId
    //         }
    //     });
    // };

    //     const handleSelectAll = () => {
    //         const combinedId = ActionButton.map((actionItem) => `${menuId}_${actionItem.iActionId}`).join(',');
    //         const combindeIdString=combinedId.split(',')
    //         // setSelectActionButton(combinedId.split(','));
    //         //  setSelectActionButton([...SelectActionButton, combindeIdString]);
    //          setSelectAll(combindeIdString)
    //          // To update the state:
    //   setState({
    //     ...state,
    //     selectAll:combindeIdString,
    //     selectActionButton: SelectActionButton
    //   });
    //     };
    const handleSelectAll = () => {
        const combinedId = ActionButton.map((actionItem) => `${menuId}_${actionItem.iActionId}`).join(',');
        const combinedIdArray = combinedId.split(',');

        // Check if SelectActionButton already contains menuId
        const existingIndex = SelectActionButton.findIndex(item => item.menuId === menuId);

        if (existingIndex !== -1) {
            // If menuId exists, update its combinedIds
            const updatedActionItem = {
                ...SelectActionButton[existingIndex],
                combinedIds: combinedIdArray
            };

            // Update SelectActionButton with the updated object
            const updatedSelectActionButton = [...SelectActionButton];
            updatedSelectActionButton[existingIndex] = updatedActionItem;
            setSelectActionButton(updatedSelectActionButton);
        } else {
            // If menuId does not exist, add it to SelectActionButton
            const newSelectActionItem = {
                menuId: menuId,
                combinedIds: combinedIdArray
            };

            // Update SelectActionButton with the new object
            setSelectActionButton([...SelectActionButton, newSelectActionItem]);
        }
    };


    const handleUnselectAll = () => {
        const existingIndex = SelectActionButton.findIndex(item => item.menuId === menuId);
    
        if (existingIndex !== -1) {
            // If menuId exists, remove its combinedIds
            const updatedSelectActionButton = [...SelectActionButton];
            updatedSelectActionButton[existingIndex].combinedIds = [];
            setSelectActionButton(updatedSelectActionButton);
        } 
    };
    

    // const handleDelete = async () => {

    //     try {
    //         if (!formDataEdit) {
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
    //                 const res = await DeleteProfile({ profileId: formDataEdit });
    //                 // Add success message here if needed
    //                 Swal.fire('Deleted!', 'The profile has been deleted.', 'success');
    //             }
    //         }
    //         resetChangesTrigger()
    //         handleNewClose()
    //     } catch (error) {
    //         console.log("delete", error);
    //         // Add error message here if needed
    //         Swal.fire('Error', 'Failed to delete the profile.', 'error');
    //         resetChangesTrigger()
    //         handleNewClose()
    //     }

    // }
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
                    <div style={{ marginTop: "5%", width: "60%", marginLeft: "300px", height: "60%" }} >
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
                                        <MDBCol >
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
                                            />

                                        </MDBCol>
                                        <div style={{ display: 'flex' }}>


                                            <div style={customFormGroupStyle1}>
                                                <Typography sx={{ fontSize: '16px', paddingBottom: '10px' }}>
                                                    Menu
                                                </Typography>

                                                {/* <Box sx={{ minHeight: 270, flexGrow: 1, maxWidth: 300 }}> */}
                                                <TreeView
                                                    aria-label="customized"
                                                    defaultExpanded={['1']}
                                                    defaultCollapseIcon={<MinusSquare />}
                                                    defaultExpandIcon={<PlusSquare />}
                                                    defaultEndIcon={<CloseSquare />}
                                                    sx={{ overflowX: 'hidden' }}
                                                >
                                                    {menu &&
                                                        menu.filter((menuList) => menuList.iParentId === 0).map((menuList) => (
                                                            <StyledTreeItem
                                                                key={menuList.iId}
                                                                nodeId={menuList.iId.toString()}
                                                                labelText={menuList.sName}
                                                            >
                                                                {menu
                                                                    .filter((subMenu) => subMenu.iParentId === menuList.iId)
                                                                    .map((subMenu) => (
                                                                        <StyledTreeItem
                                                                            key={subMenu.iId}
                                                                            nodeId={subMenu.iId.toString()}
                                                                            labelText={subMenu.sName}
                                                                            onClick={() => ClickEvents(subMenu,menuList)}

                                                                        >
                                                                            {menu
                                                                                .filter((thirdMenu) => thirdMenu.iParentId === subMenu.iId)
                                                                                .map((thirdMenu) => (
                                                                                    <StyledTreeItem
                                                                                        key={thirdMenu.iId}
                                                                                        nodeId={thirdMenu.iId.toString()}
                                                                                        labelText={thirdMenu.sName}

                                                                                        onClick={() => handleClickEvents(thirdMenu,subMenu,menuList)}
                                                                                    />
                                                                                ))}
                                                                        </StyledTreeItem>
                                                                    ))}
                                                            </StyledTreeItem>
                                                        ))}
                                                </TreeView>
                                                {/* </Box> */}


                                            </div>

                                            <div style={customFormGroupStyle1}>
                                                <Box>
                                                    <Box sx={{ flexDirection: 'row', alignItems: 'center' }} style={{ display: 'flex' }}>
                                                        <Typography sx={{ fontSize: '16px', }}>
                                                            Action
                                                        </Typography>
                                                        {ActionButton.length > 0 ? (
                                                            <Box sx={{ paddingLeft: '200px', flexDirection: 'column' }}>
                                                                <FormControlLabel
                                                                    control={<Checkbox
                                                                        onChange={handleSelectAll}
                                                                        checked={Array.isArray(SelectActionButton) &&
                                                                            SelectActionButton.some(actionItem =>
                                                                                actionItem.menuId === menuId &&
                                                                                actionItem.combinedIds.length === ActionButton.length
                                                                            )}
                                                                        sx={{ height: "10px" }}
                                                                    />}
                                                                    label="Select All"
                                                                />


                                                                <FormControlLabel
                                                                    control={<Checkbox onChange={handleUnselectAll}
                                                                    checked={SelectActionButton.some(item => item.menuId === menuId && item.combinedIds.length === 0)}
                                                                        sx={{ height: "10px" }} />}
                                                                    label="Unselect All"
                                                                />
                                                            </Box>
                                                        ) : null}

                                                    </Box>

                                                    <Box sx={{ flexDirection: 'column', display: 'flex' }}>
                                                        {ActionButton.map((item) => (
                                                            <FormControlLabel
                                                                key={item.iActionId}
                                                                control={
                                                                    <Checkbox
                                                                        checked={Array.isArray(SelectActionButton) &&
                                                                            SelectActionButton.some(actionItem =>
                                                                                actionItem.menuId === menuId &&
                                                                                actionItem.combinedIds.includes(`${menuId}_${item.iActionId}`)
                                                                            )}
                                                                        onChange={() => handleCheckboxChange(item.iActionId)}
                                                                        sx={{ height: "10px" }}
                                                                    />
                                                                }
                                                                label={item.sName}
                                                            />
                                                        ))}
                                                    </Box>

                                                </Box>



                                            </div>
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