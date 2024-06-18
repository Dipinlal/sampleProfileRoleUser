import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { GetProfiles, GetRoleProfile } from '../../../api/Api';


function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

export default  function AssignedProfile({roleId,setNewState,newState,setAssignedProfiles,setAssignedProfilesobj,AssignedProfilesObj,AssignedProfiles}) {
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([]);
  const [right, setRight] = React.useState([]);
  const [rightObj, setRightObj] = React.useState([]);
  const [leftObj, setLeftObj] = React.useState([]);
const [totalData,setTotalData]=React.useState([]);
const [profileId,setProfileId]=React.useState([]);
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  React.useEffect(() => {
    setTotalData([...rightObj, ...leftObj]);
  }, [rightObj, leftObj]); 

  React.useEffect(() => {
    if (newState === true) {
        setRight([]);
        setNewState(false); // Move this line before the return statement
        return; // Make sure to have a return statement here
    }
}, [newState]);

React.useEffect(()=>{
  setRight(AssignedProfiles)

},[])


React.useEffect(()=>{
  setAssignedProfiles(right)
  setAssignedProfilesobj(totalData)
  // setTotalData(...totalData,AssignedProfilesObj)
},[right,totalData])



// Update local storage whenever totalData or right changes
React.useEffect(() => {
  localStorage.setItem('totalData', JSON.stringify(totalData));
  localStorage.setItem('profileId', JSON.stringify(profileId));
}, [totalData,profileId]);



  React.useEffect(() => {
    if (Array.isArray(totalData)) {
        const allProfiles = totalData.map((item) => item.sProfileName);

        if (right.every((profile) => allProfiles.includes(profile))) {
            const matchingProfiles = totalData.filter((item) =>
                right.includes(item.sProfileName)
            );

            const matchingIds = matchingProfiles.map((item) => item.iProfileId);

            const profileIds = matchingIds.join(', '); // This will result in "51, 27, 33"
            setProfileId(profileIds);
        }
    } else {
        console.log('totalData is not an array or is empty.');
    }
}, [right, totalData]);


// React.useEffect(() => {
//   console.log("allProfiles Names:"); // Changed log message for clarity

//   if (Array.isArray(totalData) && Array.isArray(profileId)) { // Check if profileId is an array
//     const allProfiles = totalData.map((item) => item.iProfileId);
//     console.log("allProfiles Names:", allProfiles); 

//     if (profileId.every((profile) => allProfiles.includes(profile))) {
//       const matchingProfiles = totalData.filter((item) => profileId.includes(item.iProfileId));
//       console.log("matchingProfiles Names:", matchingProfiles); // Changed log message for clarity

//       const matchingIds = matchingProfiles.map((item) => item.sProfileName);
//       const profileNames = matchingIds.join(', '); // Changed variable name to profileNames for clarity
//       console.log("Profile Names:", profileNames); // Changed log message for clarity
//       setRight(profileNames)
//     }
//   }
// }, []); // Added dependencies to useEffect

  React.useEffect(()=>{
    const GetRoleProfiless = async () => {
      try {
          const response = await GetRoleProfile({ roleId: roleId })
          const data = JSON.parse(response.result)
          const ProfileName = data.map((item) => item.sProfileName);
          setRightObj(data)
          setRight(ProfileName)

      } catch (error) {
          console.log("Get RoleDetails", error);

      }
  }
  const GetProfiless = async () => {
      try {
          const response = await GetProfiles({ roleId: roleId })
          const data = JSON.parse(response.result)
          const ProfileName = data.map((item) => item.sProfileName);
          setLeftObj(data)
          setLeft(ProfileName)
      } catch (error) {
          console.log("GetProfiles", error);

      }
  }

  GetRoleProfiless()
  GetProfiless()
  },[])



  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    const vv=right.concat(left)
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };


  const customList = (items) => (
    <Paper sx={{ width: 400, height: 230, overflow: 'auto' }}>
      <List dense component="div" role="list">
        {items && items.map((value) => {
          // const labelId = `transfer-list-item-${value}-label`;
          const labelId=value
          return (
            <ListItemButton
              key={value}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                  sx={{
                    // Custom styles for Checkbox size
                    '& .MuiSvgIcon-root': {
                        width: '0.8em', // Change the width
                        height: '0.8em', // Change the height
                    },
                }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value} />
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>{customList(left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleAllRight}
            disabled={left.length === 0}
            aria-label="move all right"
          >
            ≫
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleAllLeft}
            disabled={right.length === 0}
            aria-label="move all left"
          >
            ≪
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList(right)}</Grid>
    </Grid>
  );
}



