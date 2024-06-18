import { Box, Button, Checkbox, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Toolbar, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import PropTypes from "prop-types";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useLocation, useNavigate } from "react-router-dom";
import { DeleteProfile, GetProfileSummary } from '../../api/Api';
import { CheckBox, TextFields } from '@mui/icons-material';
import Modal from './Modal';
import Swal from "sweetalert2";
import CloseIcon from "@mui/icons-material/Close";
import Header from '../Header/Header';
import Loader from '../Loader/Loader';
import { visuallyHidden } from "@mui/utils";


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
    const {
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
        rows,
        setDisplay,
        display,
    } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    return (
        <TableHead
            style={{
                background: `#1976d2`,
                position: "sticky",
                top: 0,
                zIndex: "5",
            }}
        >
            <TableRow>
                <TableCell
                    sx={{
                        padding: "4px",
                        border: "1px solid #ddd",
                        whiteSpace: "nowrap",
                        width: '10px'
                    }}
                    padding="checkbox"
                >
                    {/* <Checkbox
                        color="default"
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            "aria-label": "select all desserts",
                        }}
                    /> */}
                </TableCell>
                {rows.map((header, index) => {
    if (header !== "iProfileId") {
        const displayName =
            header === "sProfileName" ? "ProfileName" :
            header === "iCreatedBy" ? "CreatedBy" :
            header === "iModifiedBy" ? "ModifiedBy" :
            header === "iCreatedDate" ? "CreatedDate" :
            header === "iModifiedDate" ? "ModifiedDate" :
            header; // Use the header itself if it doesn't match the conditions

        return (
            <TableCell
                onClick={() => setDisplay(!display)}
                sx={{ border: "1px solid #ddd" }}
                key={`${index}-${header}`}
                align="center" // Set the alignment to left
                padding="normal"
                sortDirection={orderBy === header ? order : false}
            >
                <TableSortLabel
                    sx={{ color: "#fff" }}
                    active={orderBy === header}
                    direction={orderBy === header ? order : "asc"}
                    onClick={createSortHandler(header)}
                >
                    {displayName === "sDocNo" || displayName === "sLocation"
                        ? displayName.slice(1)
                        : displayName}
                    {orderBy === header ? (
                        <Box component="span" sx={visuallyHidden}>
                            {order === "desc" ? "sorted descending" : "sorted ascending"}
                        </Box>
                    ) : null}
                </TableSortLabel>
            </TableCell>
        );
    }
})}

            </TableRow>
        </TableHead>
    );

}
EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar({ searchTerm, handleSearch }) {
    // const { name,searchTerm,handleSearch } = props;
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
            }} >
            <Typography
                sx={{ flex: "1 1 100%" }}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                Profile
            </Typography>
            <input
                placeholder="Search"
                value={searchTerm}
                className="attendanceTableSearch"
                onChange={handleSearch}
                variant="outlined"
            />
        </Toolbar>
    )
}
EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};


function RoleSummary() {
    const token = Number(localStorage.getItem("accessToken"));
    const location = useLocation();
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState(0);
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(true);
    const [rowsPerPage, setRowsPerPage] = React.useState(15);
    const [data, setData] = React.useState([]);
    const [display, setDisplay] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [edit, setEdit] = React.useState(0)
    const [direction, setDirection] = React.useState(false)

    const [newOpen, setnewOpen] = React.useState(false); //new modal
    const [mode, setMode] = React.useState("new");
    const [changesTriggered, setchangesTriggered] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [filteredRows, setFilteredRows] = React.useState([]);
    const [searchKey, setsearchKey] = React.useState("");
const navigate=useNavigate()

    const buttonStyle = {
        textTransform: "none", // Set text transform to none for normal case
        color: `primary`, // Set text color
        backgroundColor: `#1976d2`, // Set background color
        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
        fontSize: "12px",
        padding: "6px 10px",
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setEdit(0)
        setIsModalOpen(false);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    const fetchData = async () => {
        handleOpen();
        setSelected([]);
        const response = await GetProfileSummary();
        if (response?.status === "Success") {
            const myObject = JSON.parse(response?.result);
            setData(myObject);
        }
        handleClose();
        resetChangesTrigger()
        setSelected([])

    };
    React.useEffect(() => {
        fetchData(); // Initial data fetch
        setPage(0);
    }, [token, changesTriggered, searchKey]);


    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = visibleRows.map((n) => n.iTransId);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };
    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const transformData = (rows) => {
        return rows.map((row) => {
            const transformedRow = { ...row };
            Object.keys(row).forEach((key) => {
                if (!isNaN(row[key]) && key !== "id") {
                    // assuming 'id' should not be converted
                    transformedRow[key] = Number(row[key]);
                }
            });
            return transformedRow;
        });
    };

    useEffect(() => {
        if (searchTerm) {
            const filteredData = data.filter((row) =>
        Object.values(row).some((val) =>
          typeof val === "string" || typeof val === "number"
            ? val.toString().toLowerCase().includes(searchTerm.toLowerCase())
            : false
        )
      );
            const transformedRows = transformData(filteredData);
            setFilteredRows(filteredData);
        } else {
            const transformedRows = transformData(data);
            setFilteredRows(data);
        }
    }, [searchTerm, data])


    const visibleRows = React.useMemo(
        () =>
            stableSort(filteredRows, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
            ),
        [order, orderBy, page, rowsPerPage, filteredRows]
    );


    const handleEdit = () => {

        setEdit(selected.join())
        handleOpenModal()
        setnewOpen(true);
        setMode("edit"); //
    }

    const handleNew = () => {
        setEdit(0)
        handleOpenModal()
        setMode("new");
        setnewOpen(true);
    }

    const handleSubmit = () => {
        fetchData()
    }

    const handlePage = () => {
        // setDirection(true)
        navigate("/home")

    }
    const handleNewClose = () => {
        setnewOpen(false);
        setSelected([])
        setchangesTriggered(true);
    };

    const resetChangesTrigger = () => {
        setchangesTriggered(false);
    };

    const handleDelete = async () => {
        const data12 = selected.join(',');

        try {
            const shouldDelete = await Swal.fire({
                title: 'Are you sure?',
                text: "You are about to delete .",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel it'
            });
            if (shouldDelete.isConfirmed) {
                const res = await DeleteProfile({ profileId: data12 });
                // Add success message here if needed
                Swal.fire('Deleted!', 'The profile has been deleted.', 'success');
            } 
            setchangesTriggered(true);
        } catch (error) {
            console.log("delete----------", error);
            // Add error message here if needed
            Swal.fire('Error', `${error.message}`, 'error');
            setchangesTriggered(true);
        }

    }

    const handleSearchKeyChange = (newSearchKey) => {
        setsearchKey(newSearchKey);
    }
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
        handleSearchKeyChange(event.target.value);
    };
    return (
        <>
              <Header/>
            <Box
                sx={{
                    margin: 0,
                    background: `primary`,
                    height: "200px",
                    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.5)",
                }} >
                <Box
                    sx={{
                        width: "auto",
                        paddingLeft: 2,
                        paddingRight: 2,
                        paddingBottom: 5,
                        zIndex: 1,
                        minHeight: "590px",
                        height: "100px",

                    }}
                >
                    {direction ? (<>
                        <TextFields />
                    </>) : (
                        <>
                            <Stack direction="row"
                                spacing={1}
                                padding={1}
                                justifyContent="flex-end">
                                <Button
                                    onClick={handleNew}
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    style={buttonStyle}
                                >
                                    New
                                </Button>

                                <Button
                                    onClick={handleEdit}
                                    disabled={selected.length !== 1}
                                    variant="contained"
                                    style={buttonStyle}
                                    startIcon={<EditIcon />}
                                >
                                    Edit
                                </Button>
                                <Button
                                    onClick={handleDelete}
                                    disabled={!(selected.length >= 1)}
                                    variant="contained"
                                    style={buttonStyle}
                                    startIcon={<DeleteIcon />}
                                >
                                    Delete
                                </Button>
                                <Button
                                    onClick={handlePage}

                                    variant="contained"
                                    style={buttonStyle}
                                    startIcon={<CloseIcon />}
                                >
                                    Close
                                </Button>
                            </Stack>

                            <Paper
                                sx={{
                                    width: "100%",
                                    mb: 2,
                                    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
                                }}>
                                <EnhancedTableToolbar

                                    numSelected={selected.length} // Provide the numSelected prop
                                    searchTerm={searchTerm}
                                    handleSearch={handleSearch}
                                />


                                {data.length > 0 && (
                                    <TableContainer
                                        style={{
                                            display: "block",
                                            maxHeight: "calc(100vh - 250px)",
                                            overflowY: "auto",
                                            scrollbarWidth: "thin",
                                            scrollbarColor: "#888 #f5f5f5",
                                            scrollbarTrackColor: "#f5f5f5",
                                        }}
                                    >
                                        <Table
                                            sx={{ minWidth: 200 }}
                                            aria-labelledby="tableTitle"
                                            size={dense ? "small" : "medium"}
                                        >
                                            <EnhancedTableHead
                                                numSelected={Object.keys(selected).length}
                                                order={order}
                                                orderBy={orderBy}
                                                onSelectAllClick={handleSelectAllClick}
                                                onRequestSort={handleRequestSort}
                                                rowCount={data.length}
                                                rows={Object.keys(data[0])}
                                                setDisplay={setDisplay}
                                                display={display}
                                            />

                                            <TableBody>
                                                {filteredRows.map((row, index) => {
                                                    const isItemSelected = isSelected(row.iProfileId);
                                                    const labelId = `enhanced-table-checkbox-${index}`;
                                                    const handleRowDoubleClick = async (event, iProfileId) => {
                                                        handleOpen();
                                                        setSelected([iProfileId]);
                                                        handleOpenModal()
                                                        handleClose();
                                                        setEdit(selected.join())
                                                        setnewOpen(true);
                                                        setMode("edit"); //
                                                    };

                                                    return (
                                                        <TableRow
                                                            hover
                                                            className={`table-row `}
                                                            onClick={(event) =>
                                                                handleClick(event, row.iProfileId)
                                                            }
                                                            onDoubleClick={(event) =>
                                                                handleRowDoubleClick(event, row.iProfileId)
                                                            }
                                                            role="checkbox"
                                                            aria-checked={isItemSelected}
                                                            tabIndex={-1}
                                                            key={row.iProfileId}
                                                            selected={isItemSelected}
                                                            sx={{ cursor: "pointer" }}
                                                        >
                                                            <TableCell padding="checkbox">
                                                                <Checkbox
                                                                    color="primary"
                                                                    checked={isItemSelected}
                                                                    inputProps={{
                                                                        "aria-labelledby": labelId,
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            {Object.keys(data[0]).map((column, index) => {
                                                                if (
                                                                    column !== "iProfileId" 
                                                                ) {
                                                                    return (
                                                                        <>
                                                                            {display ? (
                                                                                <TableCell
                                                                                    sx={{
                                                                                        padding: "4px",
                                                                                        border: "1px solid #ddd",
                                                                                        whiteSpace: "nowrap",
                                                                                    }}
                                                                                    key={row[column]}
                                                                                    component="th"
                                                                                    id={labelId}
                                                                                    scope="row"
                                                                                    padding="normal"
                                                                                    align="center"
                                                                                >
                                                                                    {row[column]}
                                                                                </TableCell>
                                                                            ) : (
                                                                                <TableCell
                                                                                    sx={{
                                                                                        padding: "4px",
                                                                                        border: "1px solid #ddd",
                                                                                        whiteSpace: "nowrap",
                                                                                        overflow: "hidden",
                                                                                        textOverflow: "ellipsis",
                                                                                        minWidth: "100px",
                                                                                        maxWidth: 150,
                                                                                    }}
                                                                                    key={row[column]}
                                                                                    component="th"
                                                                                    id={labelId}
                                                                                    scope="row"
                                                                                    padding="normal"
                                                                                    align="center"
                                                                                >
                                                                                    {row[column]}
                                                                                </TableCell>
                                                                            )}
                                                                        </>
                                                                    );
                                                                }
                                                            })}
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>

                                    </TableContainer>
                                )}
                                <TablePagination
                                    rowsPerPageOptions={[15, 25, 50, 100]}
                                    component="div"
                                    count={data.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    sx={{
                                        display: "flex", // Use flexbox for the container
                                        justifyContent: "space-between", // Space between the elements
                                        alignItems: "center", // Center the elements vertically
                                        ".MuiTablePagination-toolbar": {
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            width: "100%", // Ensure the toolbar takes the full width
                                        },
                                        ".MuiTablePagination-spacer": {
                                            flex: "1 1 100%", // Force the spacer to take up all available space
                                        },
                                        ".MuiTablePagination-selectLabel": {
                                            margin: 0, // Adjust or remove margin as needed
                                        },
                                        ".MuiTablePagination-select": {
                                            textAlign: "center", // Center the text inside the select input
                                        },
                                        ".MuiTablePagination-selectIcon": {},
                                        ".MuiTablePagination-displayedRows": {
                                            textAlign: "left", // Align the "1-4 of 4" text to the left
                                            flexShrink: 0, // Prevent the text from shrinking
                                            order: -1, // Place it at the beginning
                                        },
                                        ".MuiTablePagination-actions": {
                                            flexShrink: 0, // Prevent the actions from shrinking
                                        },
                                        // Add other styles as needed
                                    }}
                                />
                            </Paper>
                        </>
                    )}
                </Box>
                <Loader open={open} handleClose={handleClose} />
                {newOpen && (
                    <Modal
                        isOpen={newOpen}
                        handleNewClose={handleNewClose}
                        mode={mode}
                        action={handleSubmit}
                        formDataEdit={
                            mode === "edit" ? selected[0] : 0
                        }
                        resetChangesTrigger={resetChangesTrigger}
                    />
                )}
                {/* <Modal isOpen={isModalOpen} handleCloseModal={handleCloseModal} edit={edit} action={handleSubmit} iProfilId={selected} /> */}
            </Box>


        </>
    )
}

export default RoleSummary