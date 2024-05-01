import { Autocomplete, ListSubheader, TextField, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { GetMasterData, GetMasters } from "../../../api/Api";

export default function AutoComplete3({
    value,
   
    onChangeName,
    masterId,
    key,
    formData,
    setFormData,
}) {
    const CustomListBox = React.forwardRef((props, ref) => {
        const { children, ...other } = props;
        const buttonColor1 = "#1976D2"; // This is an example color value
        return (
          <ul style={{paddingTop:0}} ref={ref} {...other}>
            <ListSubheader
              style={{ backgroundColor: buttonColor1, padding: "0px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography style={{ marginRight: "auto" }}>Name</Typography>
                <Typography style={{ marginLeft: "auto" }}>Code</Typography>
              </div>
            </ListSubheader>
            {children}
          </ul>
        );
      });


    const [suggestion, setSuggestion] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [searchkey, setSearchKey] = useState({})
    const [iTypeF2ICP, setiTypeF2ICP] = useState(1);
    useEffect(() => {
        setSearchKey(value || "");
       
      }, [value]);



    useEffect(() => {
        const fetchData = async () => {
            handleOpen();
            const encodedSearchkey = encodeURIComponent(searchkey);
           
              const data = {
                masterId: masterId,
                searchCondition: encodedSearchkey,
                typeId:iTypeF2ICP
            }
            const response = await GetMasterData(data  );

            if (response?.status === "Success") {
                const myObject = JSON.parse(response?.result);
                setSuggestion(myObject);
            } else if (response?.status === "Failure") {
                setSuggestion([]);
            }
            handleClose();
            
           
        };
        fetchData();
    }, [ searchkey,iTypeF2ICP,masterId]);


    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <>
            <Autocomplete
                id={key}
                size="small"
                value={suggestion.find(option => option.sName === value) || null}
                onChange={(event, newValue) => {
                  // Pass an object containing both sName and iId to the onChangeName function
                  onChangeName({
                      sName: newValue ? newValue.sName : "",
                      iId: newValue ? newValue.iId : 0
                  });
              }}
                onInputChange={(event, newInputValue) => {
                    // Use this to trigger the API call
                    setSearchKey(newInputValue); // You might debounce this call to reduce API requests
                }}
                isOptionEqualToValue={(option, value) => option.sName === value.sName}
                options={suggestion}
                filterOptions={(options, { inputValue }) => {
                    return options.filter((option) =>
                        option.sName.toLowerCase().includes(inputValue.toLowerCase())||
                        option.sCode.toLowerCase().includes(inputValue.toLowerCase())
                    );
                }}
                autoHighlight
                getOptionLabel={(option) => option.sName || ""}
                renderOption={(props, option) => (
                    <li {...props}>
                        <div
                            className=""
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                            }}
                        >
                            <Typography
                                style={{
                                    marginRight: "auto",
                                    fontSize: "12px",
                                    fontWeight: "normal",
                                }}
                            >
                                {option.sName}
                            </Typography>
                            <Typography style={{ marginLeft: "auto", fontSize: "12px" }}>
                                {option.sCode}
                            </Typography>
                        </div>
                    </li>
                )}
                renderInput={(params) => (
                    <TextField
                    {...params}
                    label=""
                    variant="standard"
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true, // Disables the underline on the standard variant
                      style: {
                        // Overrides default styles
                        borderWidth: "1px",
                        borderColor: "#ddd",
                        borderStyle: "solid",
                        borderRadius: "10px",
                        fontSize: "12px",
                        height: "30px",
                        paddingLeft: "6px",
                      },
                      inputProps: {
                        ...params.inputProps,
                        onKeyDown: (event) => {
                          if (event.key === "F2") {
                            // Clear selected option and search key before handling F2 press
                            const updatedFormData = {
                              ...formData,
                              iId: 0,
                              sName:""
                             
                            };
                            setFormData(updatedFormData); 
                            setSearchKey("");
          
                            setiTypeF2ICP((prevType) => (prevType === 1 ? 2 : 1));
                           
                            // Prevent default F2 key action
                            event.preventDefault();
                          }
                        },
                      },
                        }}
                        sx={{
                            "& .MuiInputBase-root": {
                              "&:hover:not(.Mui-disabled):before": {
                                borderBottom: "none", // Removes the hover effect
                              },
                              "&:before": {
                                borderBottom: "none", // Removes the default bottom border
                              },
                              "&:after": {
                                borderBottom: "none", // Removes the focus effect
                              },
                            },
                          }}
                    />
                )}
                ListboxComponent={CustomListBox}

                style={{ width: `auto` }}
            />
            {/* <Loader open={open} handleClose={handleClose} /> */}
        </>
    );
}
