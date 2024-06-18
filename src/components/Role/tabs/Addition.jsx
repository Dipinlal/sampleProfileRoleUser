import React, { useEffect, useState } from "react";
import { Button, Stack, Box, Zoom, Typography, FormGroup, FormControlLabel, Checkbox, MenuItem, Menu, IconButton } from "@mui/material";


import { TreeView, TreeItem } from '@mui/x-tree-view';
import SvgIcon from '@mui/material/SvgIcon';
import { GetMenuData, GetRoleActions } from "../../../api/Api";

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
//////////////////////////////////////////////////////

function Addition({ formDataEdit, setAdditions, setNewState,newState,additions }) {
  const [menu, setMenu] = React.useState([]);
  const [ActionButton, setActionButton] = React.useState([]);
  const [SelectActionButton, setSelectActionButton] = React.useState([]);
  const [menuId, setMenuId] = React.useState([]);

  // const dataArray = SelectActionButton.flatMap(item => {
  //   const combinedIds = item.combinedIds;
  //   return combinedIds.map(combinedId => {
  //     const [iMenu, iAction] = combinedId.split('_');
  //     return {
  //       iMenu: parseInt(iMenu),
  //       iAction: parseInt(iAction)
  //     };
  //   });
  // });

useEffect(()=>{
  setSelectActionButton(additions)
},[])

  useEffect(() => {
    setAdditions(SelectActionButton)
  }, [SelectActionButton])

  React.useEffect(() => {
    if (newState === true) {
      setSelectActionButton([]);
        setNewState(false); // Move this line before the return statement
        return; // Make sure to have a return statement here
    }
}, [newState]);


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


  const ProfileId = JSON.parse(localStorage.getItem('profileId'));

  const handleClickEvents = async (thirdMenu) => {
    setActionButton([])
    try {
      const response = await GetRoleActions({
        menuId: thirdMenu.iId,
        profileId: ProfileId
      })
      const data = JSON.parse(response.result)
      const uncheckedIds = [];
      for (const item of data) {
        if (item.isChecked === 0) {
          uncheckedIds.push(item);
        }
      }
      if (uncheckedIds.length > 0) {
        const combinedIdsMap = new Map(); // Use a map to group combinedIds by menuId
        uncheckedIds.forEach(actionItem => {
          const key = thirdMenu.iId
          const combinedId = `${thirdMenu.iId}_${actionItem.iActionId}`;

          if (combinedIdsMap.has(key)) {
            combinedIdsMap.get(key).push(combinedId);
          } else {
            combinedIdsMap.set(key, [combinedId]);
          }
        })

        const selectActionButton = Array.from(combinedIdsMap).map(([menuId, combinedIds]) => ({
          menuId: menuId,
          combinedIds: combinedIds
        }));
        setActionButton(uncheckedIds);
        // setSelectActionButton(selectActionButton);

      } else {
        console.log("All states are checked.");
      }

      setMenuId(thirdMenu.iId)
    } catch (error) {
      console.log("Get Actions ", error)
    }
  };

  const ClickEvents = async (subMenu) => {
    try {
      const response = await GetRoleActions({
        menuId: subMenu.iId,
        profileId: ProfileId
      })
      const data = JSON.parse(response.result)
      const uncheckedIds = [];

      for (const item of data) {
        if (item.isChecked === 0) {
          uncheckedIds.push(item);
        }
      }
      if (uncheckedIds.length > 0) {
        const combinedIdsMap = new Map(); // Use a map to group combinedIds by menuId
        uncheckedIds.forEach(actionItem => {
          const key = subMenu.iId
          const combinedId = `${subMenu.iId}_${actionItem.iActionId}`;

          if (combinedIdsMap.has(key)) {
            combinedIdsMap.get(key).push(combinedId);
          } else {
            combinedIdsMap.set(key, [combinedId]);
          }
        })

        const selectActionButton = Array.from(combinedIdsMap).map(([menuId, combinedIds]) => ({
          menuId: menuId,
          combinedIds: combinedIds
        }));
        setActionButton(uncheckedIds);
        // setSelectActionButton(selectActionButton);

      } else {
        console.log("All states are checked. value 1");
      }
      setMenuId(subMenu.iId)
    } catch (error) {
      console.log("Get Actions ", error)
    }
  }



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


  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>


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
                        onClick={() => ClickEvents(subMenu, menuList)}

                      >
                        {menu
                          .filter((thirdMenu) => thirdMenu.iParentId === subMenu.iId)
                          .map((thirdMenu) => (
                            <StyledTreeItem
                              key={thirdMenu.iId}
                              nodeId={thirdMenu.iId.toString()}
                              labelText={thirdMenu.sName}

                              onClick={() => handleClickEvents(thirdMenu)}
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
  )
}

export default Addition