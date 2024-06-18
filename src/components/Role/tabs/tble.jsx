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
    { id: "sMaster", sName: "Master", minWidth: 120 },
    { id: "Master", sName: "Master", minWidth: 50, isChecked: false },
    { id: "Transaction", sName: "Transaction", minWidth: 50, isChecked: false },
    { id: "Report", sName: "Report", minWidth: 50, isChecked: false },
    { id: "View", sName: "View", minWidth: 50, isChecked: false },
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

export default function EnhancedTable({ masteriId, setMasters, formDataEdit, mode1, setNewState, newState, masterData }) {
    const [selectedRow, setSelectedRow] = useState(null);
    const [autocompleteOpen, setAutocompleteOpen] = useState({});
    const [formData, setFormData] = useState([]);
    const [Data, setData] = useState(Array.from({ length: 30 }, () => ([]))); // Initialize Data with 30 empty objects
    const [loading, setLoading] = useState(false);
    const [MasterDatas, setMasterDatas] = useState([]);

    //     useEffect(() => {
    //     const endData = Array.isArray(masterData) ? masterData.filter(row => row && (row.iMasterTypeId === masteriId )).map((row, index) => {
    //         return row
    //     })
    
    //     setMasterDatas(endData ||Array.from({ length: 30 }, () => ([])))
    // }, [masteriId])
    

    useEffect(() => {

        setMasters(formData)
    }, [formData])

console.log(Data,"Data===============================",masteriId);


    useEffect(() => {
        if (masterData.length === 0) {
            const newRow = Array.from({ length: 30 }, () => ({
                Master: false,
                Report: false,
                Transaction: false,
                View: false,
                TagName: "",
                iTagId: 0,
                iMasterTypeId:masteriId,
            }));
            setData(newRow);
        } else {
            const initialFormData = {};
            masterData.forEach((data, index) => {
                initialFormData[index] = { ...data };
            });
            setFormData(initialFormData);
            setData(masterData);

        }
    }, [masteriId]);






    React.useEffect(() => {
        if (newState === true) {
            setFormData([]);
            setData({})
            setNewState(false); // Move this line before the return statement
            return; // Make sure to have a return statement here
        }
    }, [newState]);



    useEffect(() => {
        if (mode1 === "edit" && formDataEdit > 0 && masteriId > 0) {
            const getEntry = async () => {
                try {
                    setLoading(true)

                    const res = await GetEntryRestriction({
                        roleId: formDataEdit,
                    });
                    const data = JSON.parse(res.result);
                    const formattedData = data.map(item => ({
                        Master: item.bMaster,
                        Report: item.bReport,
                        TagName: item.sName,
                        Transaction: item.bTransaction,
                        iTagId: item.iTagId,
                        iMasterTypeId: item.iMasterTypeId
                    }));


                    setData(formattedData);
                    setFormData(formattedData)
                    setLoading(false)
                } catch (error) {
                    console.log("GetEntryRestriction", error);
                    if (error.response.data.message) {
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
            getEntry();
        }
    }, [formDataEdit, masteriId]);


    const handleAddRow = () => {
        const newRow = {
            Master: false,
            Report: false,
            Transaction: false,
            View: false,
            TagName: "",
            iTagId: 0,
        };
        const newData = Array.isArray(Data) ? [...Data, newRow] : [newRow];

        setData(newData);

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

    const handleAutocompleteChange = (value, index) => {
        setFormData((prevData) => {
            const newData = [...prevData];
            newData[index] = {
                ...newData[index],
                iTagId: value ? value.iId : '',
                TagName: value ? value.sName : '',
                iMasterTypeId: masteriId,
            };
            return newData;
        });
    };


    const handleCheckboxChange = (isChecked, index, fieldName) => {
        setFormData((prevData) => {
            const newData = [...prevData];
            newData[index] = {
                ...newData[index],
                [fieldName]: isChecked === undefined ? false : isChecked,
            };
            return newData;
        });
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
                                            <TableCell ></TableCell>
                                        )}

                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align="center"
                                                style={{ minWidth: column.minWidth }}
                                            >
                                                {column.sName}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                {mode1 === "new" ? (
                                    <TableBody>
                                        {Array.isArray(Data) &&(
                                            Data.filter(row => row.iMasterTypeId === masteriId).length > 0 ? (
                                                Data.filter(row => row.iMasterTypeId === masteriId).map((row, index) => {

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
                                                                            value={formData[index]?.TagName || ''}
                                                                            onChangeName={(value) => handleAutocompleteChange(value, index)}
                                                                            masterId={masteriId}
                                                                            open={true} // Always show the Autocomplete for the selected row
                                                                            formData={formData}
                                                                            setFormData={setFormData}
                                                                            onClose={() => handleAutocompleteClose(row.id)}
                                                                        />
                                                                    ) : (
                                                                        <EnhancedCheckbox
                                                                            isChecked={formData[index]?.[column.sName]}
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
                                ) : (
                                    <TableBody>
                                        {Array.isArray(Data) && (
                                            Data.filter(row => row.iMasterTypeId === masteriId).length > 0 ? (
                                                Data.filter(row => row.iMasterTypeId === masteriId).map((row, index) => {
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
                                                                                value={formData[index]?.TagName || ''}
                                                                                onChangeName={(value) => handleAutocompleteChange(value, index)}
                                                                                masterId={masteriId}
                                                                                open={true} // Always show the Autocomplete for the selected row
                                                                                formData={formData}
                                                                                setFormData={setFormData}
                                                                                onClose={() => handleAutocompleteClose(row.id)}
                                                                            />
                                                                        ) : (
                                                                            <EnhancedCheckbox
                                                                                isChecked={formData[index]?.[column.sName]}
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
