import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const useStyles = makeStyles((theme) => ({
  activeSelection: { 
    backgroundColor: theme.palette.secondary.main,
    color: 'black'
  },
}));

export default function ViewMenu({ calRef }: any) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentView, setCurrentView] = useState<string>("Month");
  const styles = useStyles();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelection = (selection: string) => {
    setCurrentView(selection);
    let api = calRef.current.getApi();

    console.log(api);
    api.changeView("dayGrid" + selection);
  }

  return (
    <div style={{marginRight: "15px"}}>
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="outlined"
        color="secondary"
        onClick={handleClick}
        endIcon={<ArrowDropDownIcon />}
      >
        { currentView }
      </Button>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleSelection("Day")}
          className={currentView === 'Day' ? styles.activeSelection : ""}>
          <ListItemText primary="Day" />
        </MenuItem>

        <MenuItem onClick={() => handleSelection("Week")}
          className={currentView === 'Week' ? styles.activeSelection : ""}>
          <ListItemText primary="Week" />
        </MenuItem>

        <MenuItem onClick={() => handleSelection("Month")}
          className={currentView === 'Month' ? styles.activeSelection : ""}>
          <ListItemText primary="Month" />
        </MenuItem>

      </StyledMenu>
    </div>
  );
}
