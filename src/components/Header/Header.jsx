import { AppBar, Avatar, Box, Button, Container, DialogActions, DialogContent, DialogContentText, IconButton, Menu, MenuItem, Popover, Stack, Toolbar, Tooltip, Typography } from '@mui/material';
import React, { useEffect } from 'react'
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";

import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { colourTheme, secondaryColorTheme } from "../../config";
import { GetMenuData } from '../../api/Api';


function Header() {
  const navigate = useNavigate();
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");
  const LoginName = localStorage.getItem("sLoginName");
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menu, setMenu] = React.useState([]);
  const [menuId, setMenuId] = React.useState(0);
  const [activeSubMenuId, setActiveSubMenuId] = React.useState(null);
  const [anchorElLogout, setAnchorElLogout] = React.useState(null);
  const [SubMenusUrl, setSubMenusUrl] = React.useState(null);

  useEffect(() => {
    if (!accessToken) {
      navigate("/")
    }
  }, [])

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

  const handleMenuList = () => {
    setAnchorEl(null);
    setAnchorElNav(null); // This line will close the menu
    setActiveSubMenuId(null);
    setSubMenusUrl(null)
  };

  const handleSubMenu = (event, Id) => {
    if (Id === 25) {
      navigate("/home");
    } else {
      setAnchorEl(event.currentTarget);
      setMenuId(Id);
    }
  }


  const handleMobMenu = (id) => {
    if (id === 25) {
      navigate("/home");

    } else {
      setActiveSubMenuId(id);
    }
  };

  let menuItems


  if (activeSubMenuId == null) {
    // Main menu items

    menuItems = menu
      .filter((menuList) => menuList.iParentId === 0)
      .map((menuList) => (
        <MenuItem
          key={menuList.iId}
          onClick={() => handleMobMenu(menuList.iId)}
        >
          <Typography textAlign="center">{menuList.sName}</Typography>
        </MenuItem>
      ));
  } else {
    // Sub-menu items
    menuItems = [
      <MenuItem key="back" onClick={() => setActiveSubMenuId(null)}>
        <ArrowBackIcon sx={{ color: colourTheme }} />
      </MenuItem>,
      ...menu
        .filter((menuList) => menuList.iParentId === activeSubMenuId)
        .map((menuList) => (
          <MenuItem
            key={menuList.iId}
            onClick={() => handleClickEvent(menuList)}
          >
            <Typography textAlign="center">{menuList.sName}</Typography>
          </MenuItem>
        )),
    ];
  }

  const handleLogoutClick = (event) => {
    setAnchorElLogout(event.currentTarget);
  };

  const handleLogoutClose = () => {
    setAnchorElLogout(null);
  };
  const handleConfirmLogout = () => {
    handleLogoutClose();
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    navigate("/");
  };

const handleProfile=()=>{
  navigate("/Profile")
}
const handleRole=()=>{
  navigate('/Role')
}
const handleUser=()=>{
  navigate('/User')
}
  return (
    <>
      <AppBar position="static"
        style={{
          position: "sticky",
          zIndex: 100, // Adjust the z-index as needed
          top: 0,
          bgcolor: `${secondaryColorTheme}`,
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
        }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Avatar
              alt="Logo"
              src="https://th.bing.com/th/id/R.c2be529c2bc2661ca5470f03543f471b?rik=OirVRGPaFpau5A&riu=http%3a%2f%2fsangsolutions.com%2fimg%2fsangsolution.png&ehk=jkxPYwdZRZ%2fZwko9wuAvL%2bVMA2GEhTg%2fmHUvUIKFGzE%3d&risl=&pid=ImgRaw&r=0"
              sx={{ mr: 2, width: 45, height: 45 }}
            />

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                // onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                // anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                // open={Boolean(anchorElNav)}
                // onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {menuItems}
              </Menu>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              <Box sx={{
            flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center',
            justifyContent: 'start',
          }}>

<Button
              variant="#00498E"
              sx={{
                mr: 0,
                backgroundColor: secondaryColorTheme,
                color: 'white',
              }}
              onClick={handleProfile}
            >
              PROFILE
            </Button>
            <Button
              variant="#00498E"
              sx={{
                mr: 0,
                backgroundColor: secondaryColorTheme,
                color: 'white',
              }}
              onClick={handleRole}

            >
              ROLE
            </Button>
            <Button
              variant="#0583D2"
              sx={{
                mr: 0,
                backgroundColor: secondaryColorTheme,
                color: 'white',
              }}
              onClick={handleUser}
            >
              USER
            </Button>
            
          </Box>
             

              {/* {menu &&
                menu
                  .filter((menuList) => menuList.iParentId === 0)
                  .map((menuList, index) => (
                    <Button
                      key={menuList.iId}
                      aria-controls="master-menu"
                      aria-haspopup="true"
                      onClick={(e) => handleSubMenu(e, menuList.iId)}
                      variant="#00498E" // Note: This is not a valid variant, you might want to use 'contained', 'outlined', or 'text'
                      sx={{
                        mr: 0,
                        bgcolor: `#1976d2`, // Use template literal here
                        color: "white",
                      }}
                    >
                      {menuList.sName}
                    </Button>
                  ))} */}

              {/* <Menu
                id="master-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuList}
              >
                {menu &&
                  menu
                    .filter((menuList) => menuList.iParentId === menuId)
                    .map((menuList, index) => (
                      <MenuItem
                        key={menuList.iId}
                        onClick={() => handleClickEvent(menuList)}
                      >
                        {menuList.sName}
                      </MenuItem>
                    ))}
              </Menu> */}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <SettingsIcon sx={{ marginRight: "20px" }} />
              <Tooltip title="Log out">
                <IconButton
                  onClick={handleLogoutClick}
                  sx={{
                    p: 0,
                    "&:hover": { backgroundColor: "transparent !important" },
                  }}
                >
                  <PowerSettingsNewIcon
                    sx={{ marginRight: "20px", color: "#FFF" }}
                  />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton sx={{ p: 0 }}>
                  <Stack direction="row" spacing={2}>
                    <Avatar>{LoginName}</Avatar>
                  </Stack>
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
          <Popover
            open={Boolean(anchorElLogout)}
            anchorEl={anchorElLogout}
            onClose={handleLogoutClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <DialogContent>
              <DialogContentText>
                Are you sure you want to log out?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleConfirmLogout}
                style={{
                  textTransform: "none",
                  backgroundColor: secondaryColorTheme,
                  color: "white",
                }}
              >
                Logout
              </Button>
              <Button
                onClick={handleLogoutClose}
                style={{
                  textTransform: "none",
                  backgroundColor: secondaryColorTheme,
                  color: "white",
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Popover>
        </Container>
      </AppBar>
    </>
  )
}

export default Header