import { Checkbox, FormControlLabel, Paper, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { GetMasterData, GetMasters } from '../../../api/Api';
import EnhancedTable from './Table';

const customFormGroupStyle1 = {
  border: '1px solid #ccc',
  borderRadius: '10px',
  maxHeight: '550px', // Adjust as needed
  overflowY: 'auto', // Hide vertical overflow
  overflowX: 'auto', // Allow horizontal scrolling
  padding: '10px',
  width: '30%',
  height: '450px'

};
const customFormGroupStyle2 = {
  border: '1px solid #ccc',
  borderRadius: '10px',
  maxHeight: '550px', // Adjust as needed
  overflowY: 'auto', // Hide vertical overflow
  overflowX: 'auto', // Allow horizontal scrolling
  padding: '10px',
  width: '100%',
  height: '450px'

};


export default function MasterRistriction({ formDataEdit, setMasters, mode,mode1, setNewState, newState,masterData,parentData,setParentFunc }) {
  const [master, setmaster] = React.useState([]);
  const [masteriId, setmasterId] = React.useState(null);
  const [objects, setobject] = React.useState(null);

  // const [mode1, setMode1] = useState("");
  // useEffect(() => {
  //   setMode1(mode);
  // }, [mode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetMasters()
        const data = JSON.parse(response.result)
        setmaster(data)
      } catch (error) {
        console.log("get menus", error);
      }
    }
    fetchData()
  }, [])


  const handleClickEvents = async (item) => {
    setobject(item)
    setmasterId(item.iId)
  };
 
  return (
    <div>
      <div style={{ display: 'flex' }}>


        <div style={customFormGroupStyle1}>
          <Typography sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div">
            Master
          </Typography>
          {master.map((item) => (

            <div key={item.id} style={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={<Checkbox checked={item.iId === masteriId} onChange={() => handleClickEvents(item)} sx={{ '& .MuiSvgIcon-root': { fontSize: 16 } }} />}
                label={<Typography sx={{ fontSize: '14px', paddingBottom: '5px', cursor: 'pointer', color: item.iId === masteriId ? 'blue' : 'inherit' }}>{item.sName}</Typography>}
                sx={{ height: "23px" }}
              />
            </div>
          ))}
        </div>

        <div style={customFormGroupStyle2}>
          <Paper
            sx={{
              width: "100%",
              mb: 2,
            }}>
            <Toolbar
              sx={{
                pl: { sm: 1 },
                pr: { xs: 1, sm: 1 },
              }} >
              <Typography
                sx={{ flex: "1 1 100%" }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                Role
              </Typography>
            </Toolbar>
            <EnhancedTable masteriId={masteriId}
              setMasters={setMasters}
              formDataEdit={formDataEdit}
              mode1={mode1}
              masterData={masterData}
              setNewState={setNewState}
              parentData={parentData}
              newState={newState}
              setParentFunc={setParentFunc}
              objects={objects}
            />

          </Paper>
        </div>
      </div>

    </div>
  )
}