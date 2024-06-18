import React, { useState, useEffect } from "react";
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { GetEntryRestriction } from "../../../api/Api";
import AutoComplete3 from "./AutoComplete";
import Swal from "sweetalert2";

const columns = [
    { id: "sMaster", sName: "Master", minWidth: 120, name: "Master" },
    { id: "Master", sName: "bMaster", minWidth: 50, isChecked: false, name: "Master" },
    { id: "Transaction", sName: "bTransaction", minWidth: 50, isChecked: false, name: "Transaction" },
    { id: "Report", sName: "bReport", minWidth: 50, isChecked: false, name: "Report" },
    { id: "View", sName: "bView", minWidth: 50, isChecked: false, name: "View" },
];


const EnhancedCheckbox = ({ isChecked, onChange }) => {
    return (
        <Checkbox
            checked={isChecked}
            onChange={onChange}
            inputProps={{ "aria-label": "checkbox" }}
            sx={{ transform: "scale(0.7)" }} // Adjust checkbox size with scale transformation
        />
    );
};

export default function EnhancedTable({ masteriId, setMasters, formDataEdit, mode1, setNewState, newState, masterData, objects, parentData, setParentFunc }) {
    const [selectedRow, setSelectedRow] = useState(null);
    const [autocompleteOpen, setAutocompleteOpen] = useState({});
    const [formData, setFormData] = useState([]);
    const [Data, setData] = useState(Array.from({ length: 1 }, () => ([]))); // Initialize Data with 30 empty objects
    const [loading, setLoading] = useState(false);
    const [MasterDatas, setMasterDatas] = useState([]);
  

    useEffect(() => {
        const dataForMasterId = masterData.find(item => item[masteriId]);
        if (dataForMasterId) {
            setFormData(dataForMasterId[masteriId]); // This sets the specific master's data to state
        } else {
            // If no data for this masterId, initialize with default structure
            const defaultData = Array.from({ length: 1 }, () => ({
                bMaster: false,
                bReport: false,
                bTransaction: false,
                bView: false,
                TagName: "",
                iTagId: 0,
                iMasterTypeId: masteriId,
            }));
            setFormData(defaultData);
        }
    }, [masteriId]);
    

    
    useEffect(() => {
        
        setParentFunc(formData,masteriId)
    }, [formData])

   


    useEffect(() => {
        if (masterData.length === 0) {
            // const newRow = Array.from({ length: 30 }, () => ({
            //     Master: false,
            //     Report: false,
            //     Transaction: false,
            //     View: false,
            //     TagName: "",
            //     iTagId: 0,
            //     iMasterTypeId: masteriId,

            // }));
            // setData(newRow);
        } else {
            // const initialData = {};
            // masterData.map((data, index) => {
            //     initialFormData[index] = { ...data };
            // });
            // console.log(masterData, "masterData", masteriId);
            // setFormData(masterData);
            // setData(masterData);

        }
    }, []);




    // useEffect(() => {
    //     if (formData.length > 0) {
    //         setMasters(formData)
    //     }
    // }, [formData, masteriId])



    React.useEffect(() => {
        if (newState === true) {
            setFormData([]);
            setData({})
            setNewState(false); // Move this line before the return statement
            return; // Make sure to have a return statement here
        }
    }, [newState]);



    // useEffect(() => {
    //     if (mode1 === "edit" && formDataEdit > 0 && masteriId > 0) {
    //         const getEntry = async () => {
    //             try {
    //                 setLoading(true)

    //                 const res = await GetEntryRestriction({
    //                     roleId: formDataEdit,
    //                 });
    //                 const data = JSON.parse(res.result);
    //                 console.log(data);
    //                 const formattedData = data.map(item => ({
    //                     Master: item.bMaster,
    //                     Report: item.bReport,
    //                     TagName: item.sName,
    //                     Transaction: item.bTransaction,
    //                     iTagId: item.iTagId,
    //                     iMasterTypeId: item.iMasterTypeId
    //                 }));


    //                 setData(formattedData);
    //                 setFormData(formattedData)
    //                 setLoading(false)
    //             } catch (error) {
    //                 console.log("GetEntryRestriction", error);
    //                 if (error.response.data.message) {
    //                     Swal.fire({
    //                         title: "Error!",
    //                         text: `${error.response.data.message}`,
    //                         icon: "error",
    //                         showConfirmButton: false,
    //                         timer: 1500,
    //                     });
    //                 } else {
    //                     Swal.fire({
    //                         title: "Error!",
    //                         text: `${error.message}`,
    //                         icon: "error",
    //                         showConfirmButton: false,
    //                         timer: 1500,
    //                     });
    //                 }
    //             }
    //         };
    //         getEntry();
    //     }
    // }, [masteriId]);

    useEffect(() => {
        if (mode1 === "edit" && formDataEdit > 0) {
            const getEntry = async () => {
                try {
                    setLoading(true);
        
                    const res = await GetEntryRestriction({
                        roleId: formDataEdit,
                    });
                    const data = JSON.parse(res.result);
                    
                    
                    // Create a map to hold the data grouped by iMasterTypeId
                    const groupedData = data.reduce((acc, item) => {
                        const typeId = item.iMasterTypeId; // identifier for grouping
                        if (!acc[typeId]) {
                            acc[typeId] = []; // Initialize an empty array for this type ID if it doesn't already exist
                        }
                        // Push the current item into the correct type ID array
                        acc[typeId].push({
                            bMaster: item.bMaster,
                            bReport: item.bReport,
                            TagName: item.sName,
                            bTransaction: item.bTransaction,
                            bView:item.bView,
                            iTagId: item.iTagId,
                            iMasterTypeId: typeId
                        });
                        return acc;
                    }, {});
        
                    // Convert the groupedData map back to an array format suitable for your state
                    const formattedData = Object.keys(groupedData).map(key => ({
                        [key]: groupedData[key]
                    }));
        
                    setMasters(formattedData);
                    setLoading(false);
                } catch (error) {
                    console.log("Error fetching entry restrictions:", error);
                    setLoading(false);
                }
            };
        
            getEntry();
        }
        
    }, [formDataEdit]);

    const handleAddRow = () => {
        const newRow = {
            bMaster: false,
            bReport: false,
            bTransaction: false,
            bView: false,
            TagName: "",
            iTagId: 0,
            iMasterTypeId: masteriId,

        };
        const newData = Array.isArray(Data) ? [...Data, newRow] : [newRow];
        const newFormData = Array.isArray(formData) ? [...formData, newRow] : [newRow];
        // Update the Data state with the new row
        setData(newData);
        setFormData(newFormData)
    }





    const handleRowClick = (row) => {
        setSelectedRow(row);
        setAutocompleteOpen((prevState) => ({
            ...prevState,
            [row.id]: true,
        }));
    };

    const handleAutocompleteClose = (id) => {
        setAutocompleteOpen((prevState) => ({
            ...prevState,
            [id]: false,
        }));
    };

    //SHERIKUM ULLLA AUTOCOMPLETE CODE----------------------------------------------------------------------------------------------------

    // const handleAutocompleteChange = (value, index) => {
    //     setFormData((prevData) => {
    //         const newData = [...prevData];
    //         newData[index] = {
    //             ...newData[index],
    //             iTagId: value ? value.iId : '',
    //             TagName: value ? value.sName : '',
    //             iMasterTypeId: masteriId,
    //             bMaster: false,
    //             bReport: false,
    //             bTransaction: false,
    //             bView: false,
    //         };
    //         return newData;
    //     });
    // };
    const handleAutocompleteChange = (value, index) => {
      
        const updatedFormData = [...formData];
        if (updatedFormData[index]) {
            updatedFormData[index].iTagId = value.iId;
            updatedFormData[index].TagName = value.sName;
        }
        setFormData(updatedFormData);
        
    };


    // const handleAutocompleteChange = (value, index) => {
    //     setFormData((prevData) => {
    //         const masterId = masteriId; // Assuming iMasterTypeId is the identifier for masteriId
    //         const newData = [...prevData];
    //         console.log(newData, "newData");
    //         const newDataIndex = newData.findIndex((item) => item[masterId]);

    //         const newObject = {
    //             bMaster: false,
    //             bReport: false,
    //             bTransaction: false,
    //             bView: false,
    //             TagName: value ? value.sName : '',
    //             iTagId: value ? value.iId : '',
    //             iMasterTypeId: masterId,
    //         };

    //         if (newDataIndex !== -1) { // If masterId already exists in FormData
    //             newData[newDataIndex][masterId].push(newObject);
    //         } else { // If masterId doesn't exist, create a new object
    //             newData.push({
    //                 [masterId]: [newObject]
    //             });
    //         }

    //         return newData;
    //     });
    // };


    // const handleCheckboxChange = (isChecked, index, fieldName) => {
    //     setFormData((prevData) => {
    //         const newData = [...prevData];
    //         console.log(newData, "newData");

    //         // Assuming fieldName corresponds to bMaster, bReport, bTransaction, or bView
    //         const masterId = masteriId;
    //         const masterIndex = newData.findIndex((item) => item[masterId]);

    //         if (masterIndex !== -1) {
    //             newData[masterIndex][masterId].forEach((obj) => {
    //                 obj[fieldName] = isChecked === undefined ? false : isChecked;
    //             });
    //         }

    //         return newData;
    //     });
    // };

    //SHERIKUM ULLLA CHECKBOX CODE----------------------------------------------------------------------------------------------------
    // const handleCheckboxChange = (isChecked, index, fieldName) => {
    //     setFormData((prevData) => {
    //         const newData = [...prevData];
    //         console.log(newData);

    //         newData[index] = {
    //             ...newData[index],
    //             [fieldName]: isChecked === undefined ? false : isChecked,
    //         };
    //         return newData;
    //     });
    // };

    const handleCheckboxChange = (isChecked, index, fieldName) => {
    const updatedFormData = [...formData];
    if (updatedFormData[index]) {
        updatedFormData[index][fieldName] = isChecked;
    }
    setFormData(updatedFormData);
    
};
    





    return (
        <Box sx={{ width: "95%", margin: "auto", marginTop: "30px" }}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >

                <Paper sx={{ width: "100%", mb: 2 }}>
                    <TableContainer sx={{ maxHeight: "40vh", overflow: "scroll" }}>
                        {!loading && (
                            <Table stickyHeader sx={{ minWidth: 700 }}>
                                <TableHead>
                                    <TableRow>

                                        {mode1 === "edit" && (
                                            <Button onClick={handleAddRow}>Add Row</Button>
                                        )}
                                        {mode1 === "new" && (
                                            <Button onClick={handleAddRow}>Add Row</Button>
                                        )}

                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align="center"
                                                style={{ minWidth: column.minWidth }}
                                            >
                                                {column.name}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                {mode1 === "new" ? (
                                    <TableBody>
                                        {Array.isArray(formData) && formData.map((row, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    <TableRow
                                                        key={index}
                                                        onClick={() => handleRowClick(row)}
                                                        selected={selectedRow && selectedRow.id === row.id}
                                                    >
                                                        <TableCell>{index + 1}</TableCell>
                                                        {columns.map((column) => (
                                                            <TableCell key={column.id}
                                                                sx={{
                                                                    padding: "4px",
                                                                    height: "1px",
                                                                    // border: "1px solid #ddd",
                                                                    whiteSpace: "nowrap",
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    width: "calc(100% / 5)",
                                                                    minWidth: "100px",
                                                                    maxWidth: 170,

                                                                }}
                                                                component="th"
                                                                scope="row"
                                                                padding="normal"
                                                                align="center"
                                                            >
                                                                {selectedRow && selectedRow.id === row.id && (
                                                                    column.id === 'sMaster' ? (
                                                                        <AutoComplete3
                                                                            value={formData[index]?.iMasterTypeId === masteriId ? formData[index]?.TagName : ''}
                                                                            // value={formData.iMasterTypeId === masteriId ? row.TagName : ''}

                                                                            onChangeName={(value) => handleAutocompleteChange(value, index)}
                                                                            masterId={masteriId}
                                                                            open={true} // Always show the Autocomplete for the selected row
                                                                            formData={formData}
                                                                            setFormData={setFormData}
                                                                            onClose={() => handleAutocompleteClose(row.id)}
                                                                        />
                                                                    ) : (
                                                                        <EnhancedCheckbox
                                                                            // isChecked={formData[index]?.[column.sName]}
                                                                            isChecked={formData[index]?.iMasterTypeId === masteriId ? formData[index]?.[column.sName] : false}

                                                                            onChange={(e) =>
                                                                                handleCheckboxChange(
                                                                                    !formData[index]?.[column.sName],
                                                                                    index,
                                                                                    column.sName
                                                                                )
                                                                            }
                                                                        />
                                                                    )
                                                                )}
                                                            </TableCell>
                                                        ))}

                                                    </TableRow>

                                                </React.Fragment>
                                            );
                                        })}
                                    </TableBody>
                                ) : (
                                    <TableBody>
                                        {Array.isArray(formData) && (
                                            formData.filter(row => row.iMasterTypeId === masteriId).length > 0 ? (
                                                formData.filter(row => row.iMasterTypeId === masteriId).map((row, index) => {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <TableRow
                                                                key={index}
                                                                onClick={() => handleRowClick(row)}
                                                                selected={selectedRow && selectedRow.id === row.id}
                                                            >
                                                                <TableCell>{index + 1}</TableCell>
                                                                {columns.map((column) => (
                                                                    <TableCell key={column.id}
                                                                        sx={{
                                                                            padding: "4px",
                                                                            height: "1px",
                                                                            whiteSpace: "nowrap",
                                                                            overflow: "hidden",
                                                                            textOverflow: "ellipsis",
                                                                            width: "calc(100% / 5)",
                                                                            minWidth: "100px",
                                                                            maxWidth: 150,
                                                                        }}
                                                                        component="th"
                                                                        scope="row"
                                                                        padding="normal"
                                                                        align="left">
                                                                        {column.id === 'sMaster' ? (
                                                                            <AutoComplete3
                                                                                // value={formData[index]?.TagName || ''}
                                                                                value={formData[index]?.iMasterTypeId === masteriId ? formData[index]?.TagName : ''}
                                                                                onChangeName={(value) => handleAutocompleteChange(value, index)}
                                                                                masterId={masteriId}
                                                                                open={true} // Always show the Autocomplete for the selected row
                                                                                formData={formData}
                                                                                setFormData={setFormData}
                                                                                onClose={() => handleAutocompleteClose(row.id)}
                                                                            />
                                                                        ) : (
                                                                            <EnhancedCheckbox
                                                                                // isChecked={formData[index]?.[column.sName]}
                                                                                isChecked={formData[index]?.iMasterTypeId === masteriId ? formData[index]?.[column.sName] : false}

                                                                                onChange={(e) =>
                                                                                    handleCheckboxChange(
                                                                                        !formData[index]?.[column.sName],
                                                                                        index,
                                                                                        column.sName
                                                                                    )
                                                                                }
                                                                            />
                                                                        )}
                                                                    </TableCell>
                                                                ))}
                                                            </TableRow>
                                                        </React.Fragment>
                                                    );
                                                })
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={columns.length}>
                                                        No data available.
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}


                                    </TableBody>
                                )}
                            </Table>
                        )}
                        {loading && <div>loading...</div>} {/* Display loading indicator */}
                        {(!loading && Data.length === 0) && <div>No data available.</div>} {/* Display message for empty data */}
                    </TableContainer>
                </Paper>

            </div>
        </Box>
    );
}