import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Autocomplete } from "@mui/material";

import { colourTheme } from "../../config";
import sangImage from "../../assets/images/sangsolution.png"
import Loader from "../Loader/Loader";
import { getLogin, getLoginCompany } from "../../api/Api";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import createTheme from "@mui/material/styles/createTheme";


const defaultTheme = createTheme()


function LoginPage() {
  const navigate = useNavigate();
  const [sLoginName, setLoginName] = React.useState();
  const [sPassword, setSPassword] = React.useState();
  const [sDatabaseName, setDatabaseName] = React.useState("1");
  const [email, setEmail] = React.useState(false);
  const [password, setPassword] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState();
  const [loader, setLoader] = useState(false)
  const [suggestionCompany, setSuggestionCompany] = useState([]);
  const [company, setCompany] = useState("");
  const [scompany, setScompany] = React.useState(false);

  console.log(company.Company, "company");

  useEffect(() => {
    const fetchData = async () => {
      const response = await getLoginCompany()
      console.log(response);
      if (response.statusCode === 200) {
        const myObject = JSON.parse(response.result);
        setSuggestionCompany(myObject);
      }
    };
    fetchData();
  }, []);



  const handleSubmit = async (event) => {
    event.preventDefault()
    // Check if email is not present or is falsy
    if (!sLoginName) {
      setEmail(true)
    } else {
      setEmail(false)
    }
    // Check if password is not present or is falsy
    if (!sPassword) {
      setPassword(true);
    } else {
      setPassword(false);
    }
    // Check if password is not present or is falsy
    if (!company.Company) {
      setScompany(true);
    } else {
      setScompany(false);
    }
    try {
      if (sPassword && sLoginName && company.Company) {
        handleLoaderOpen();
        const res = await getLogin({
          username: sLoginName,
          password: sPassword,
          database: company.Company,
        })
        console.log(res.message, "login api response----------------------------------");
        console.log(res);
        if (res.message == "Login successful") {
          // localStorage.setItem("userId", res.data.iId);
  
          localStorage.setItem("accessToken", res?.tokens?.accessToken);
          localStorage.setItem("refreshToken", res?.tokens?.refreshToken);
          navigate('/home')
        } else {
          setMessage(`${res.message}`)
          handleClick();
        }
        handleLoaderClose();
      }
    } catch (error) {
      console.log("login error", error.response.data.message);
      setMessage(`${error.response.data.message}`)
      handleClick();
      handleLoaderClose();

    }
    // If both email and password are present, proceed with the login call
    
  }

  const handleLoaderClose = () => {
    setLoader(false);
  };

  const handleLoaderOpen = () => {
    setLoader(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(true);
  };
  return (
    <ThemeProvider
      theme={defaultTheme}
    >
      <Grid sx={{ backgroundColor: colourTheme }}
        container
        component="main"
        justifyContent="center"
        alignItems="center"
        height="100vh">
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          borderRadius={2}
          component={Paper}
          elevation={6}
          square
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
            <img src={sangImage} style={{ width: "80px" }} />
            <Typography component="h1" variant="h5">
              LOGIN
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ marginTop: 1 }}
            >
              <TextField
                error={email}
                onChange={(e) => setLoginName(e.target.value)}
                margin="normal"
                required
                fullWidth
                id="email"
                label="UserName"
                autoComplete="email"
                helperText=""
                autoFocus
              />
              <TextField
                error={password}
                onChange={(e) => setSPassword(e.target.value)}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              // onKeyDown={handleKeyPress}
              />
              <Autocomplete
                id={`size-small-filled-assetType`}
                size="small"
                value={company}
                onChange={(event, newValue) => {
                  setCompany(newValue);
                }}
                options={suggestionCompany.map((data) => ({
                  Company: data.sDatabase,
                  Id: data?.iId,
                }))}
                filterOptions={(options, { inputValue }) => {
                  return options.filter((option) =>
                    option && option.Company && option.Company.toLowerCase().includes(inputValue.toLowerCase())
                  );
                }}
                autoHighlight
                getOptionLabel={(option) =>
                  option && option.Company ? option.Company : ""
                }
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
                        {option.Company}
                      </Typography>
                    </div>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    error={scompany}
                    margin="normal"
                    required
                    label="Company"
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "off",
                      style: {
                        borderWidth: "1px",
                        borderColor: "#ddd",
                        borderRadius: "10px",
                        fontSize: "15px",
                        height: "35px",
                        paddingLeft: "6px",
                        paddingTop: "6px",
                      },
                    }}
                  />
                )}
                style={{ width: `auto` }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                LOGIN
              </Button>
            </Box>
          </Box>

        </Grid>

      </Grid>
      <ErrorMessage open={open} handleClose={handleClose} message={message} />
      <Loader open={loader} handleClose={handleLoaderClose} />
    </ThemeProvider>
  )
}

export default LoginPage