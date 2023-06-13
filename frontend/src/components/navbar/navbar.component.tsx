import { useState, useContext } from "react";

import { UserContext } from "@/contexts/userContext";

import styled from "styled-components";
import { Link } from "react-router-dom";

import { signOut } from "@/api/stream";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import AdbIcon from "@mui/icons-material/Adb";
import Tooltip from "@mui/material/Tooltip";
import Container from "@mui/material/Container";

const StyledAppBar = styled(AppBar)`
  background-color: rgba(255, 255, 255, 0.15);

  a {
    color: white;
  }
`;

const StyledButton = styled(Button)`
  font-size: 1.4rem;
  text-transform: none;

  &:hover {
    background-color: rgba(0, 0, 0, 0.15);
  }
`;

const StyledTypography = styled(Typography)`
  font-size: 1.8rem;
`;

const StyledMenuIcon = styled(MenuIcon)`
  font-size: 2.2rem;
`;

const StyledAccountCircle = styled(AccountCircle)`
  font-size: 2.8rem;
`;

const StyledAdbIcon = styled(AdbIcon)`
  font-size: 2.5rem;
`;
// const pages = ["Products", "Pricing", "Blog"];
// const settings = ["Profile", "Account", "Dashboard", "Logout"];

export function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <StyledMenuIcon />
          </IconButton>
          <StyledTypography variant="h6" sx={{ flexGrow: 1 }}>
            News
          </StyledTypography>
          <StyledButton color="inherit">Sign Up</StyledButton>
          <StyledButton color="inherit">Sign In</StyledButton>
        </Toolbar>
      </StyledAppBar>
    </Box>
  );
}

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { currentUser, setCurrentUser } = useContext(UserContext);
  const { username, avatar } = currentUser || {};
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = "primary-search-account-menu";

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {/* <MenuItem onClick={handleMenuClose}>Profile</MenuItem> */}
      <MenuItem onClick={handleMenuClose}>
        <Link to={`/live/${username}`}>Stream Room</Link>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Link to={`${username}/setting`}>Stream Setting</Link>
      </MenuItem>
      <MenuItem
        onClick={async () => {
          await signOut();
          setCurrentUser(null);
          handleMenuClose();
        }}
      >
        Sign Out
      </MenuItem>
    </Menu>
  );

  const avatarUrl = avatar
    ? `${import.meta.env.VITE_API_SERVER_URL}${avatar}`
    : "";

  return (
    <StyledAppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to="/">
            <StyledAdbIcon
              sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            />
          </Link>
          <StyledTypography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Link to="/">LOGO</Link>
          </StyledTypography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              // onClick={handleOpenNavMenu}
              color="inherit"
            >
              <StyledMenuIcon />
            </IconButton>
          </Box>
          <Link to="/">
            <StyledAdbIcon
              sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
            />
          </Link>
          <StyledTypography
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Link to={`/`}>LOGO</Link>
          </StyledTypography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {/* {pages.map((page) => (
              <Button
                key={page}
                // onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))} */}
          </Box>
          {!currentUser ? (
            <>
              <StyledButton color="inherit">
                <Link to="/sign-up">Sign Up </Link>
              </StyledButton>
              <StyledButton color="inherit">
                <Link to="/sign-in">Sign In</Link>
              </StyledButton>
            </>
          ) : (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  {avatarUrl ? (
                    <Avatar alt="" src={avatarUrl} />
                  ) : (
                    <StyledAccountCircle />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Toolbar>
      </Container>
      {currentUser && renderMenu}
    </StyledAppBar>
  );
};

export default Navbar;
