

import React, { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  Typography,
  ListSubheader,
  Paper,
} from "@mui/material";
import { colourTheme } from "../../config";
import { GetRoles } from "../../api/Api";

const GetRoleAutocomplete = ({
  apiKey,
  formData,
  setFormData,
  label,
  autoId,
  formDataName,
  formDataiId,
}) => {
  const [iTypeF2, setiTypeF2] = useState(1);
  const [searchkey, setsearchkey] = useState("");
  const [Menu, setMenu] = useState([]);



  // Effect to sync state with prop changes
  useEffect(() => {
    setsearchkey(formData[formDataName] || '');
  }, [formData, formDataName]);

  const handleAutocompleteChange = (event, newValue) => {
    const updatedFormData = {
      ...formData,
      [formDataName]: newValue ? newValue.sRoleName : "",
      [formDataiId]: newValue ? newValue.iRoleId : 0,
    };
    setFormData(updatedFormData); // This will now update the parent's state
    setiTypeF2(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const response = await GetRoles();
        const myObject = JSON.parse(response?.result);
        setMenu(myObject);

      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [iTypeF2, searchkey]);

  const CustomListBox = React.forwardRef((props, ref) => {
    const { children, ...other } = props;
    return (
      <ul style={{ paddingTop: 0 }} ref={ref} {...other}>
        <ListSubheader style={{ backgroundColor: colourTheme, padding: "5px" }}>
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



  return (
    <Autocomplete
      size="small"
      PaperComponent={({ children }) => (
        <Paper style={{ width: 'auto', minWidth: '150px', maxWidth: '600px' }}>{children}</Paper>
      )}
      id={autoId}
        options={Menu}
      // options={Menu.map((data) => ({
      //   sName: data?.sRoleName,
      //   iId: data?.iRoleId,
      // }))}
      getOptionLabel={(option) => option.sRoleName}
      onChange={handleAutocompleteChange}

      value={
        formData[formDataName] ? Menu.find(option => option.sRoleName === formData[formDataName]) || null : null
      }
      filterOptions={(options, { inputValue }) => {
        return options.filter(
          (option) =>
            option.sRoleName.toLowerCase().includes(inputValue.toLowerCase())
        );
      }}
      onInputChange={(event, newInputValue) => {
        // Use this to trigger the API call
        setsearchkey(newInputValue); // You might debounce this call to reduce API requests
      }}
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
              {option.sRoleName}
            </Typography>
            <Typography
              style={{
                marginLeft: "auto",
                fontSize: "12px",
                fontWeight: "normal",
              }}
            >
              {option.sCode}
            </Typography>
          </div>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          required
          label="Select Role"
          {...params}
          inputProps={{
            ...params.inputProps,
            autoComplete: "off", // disable autocomplete and autofill
            style: {
              borderWidth: "1px",
              borderColor: "#ddd",
              borderRadius: "10px",
              fontSize: "15px",
              height: "20px",
              paddingLeft: "6px",
            },
          }}
        />
      )}
      ListboxComponent={CustomListBox}
      style={{ width: " auto" }}
    />
  );
};

export default GetRoleAutocomplete;


