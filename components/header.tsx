import Link from "next/link";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";

// type HeaderProps = {};

const Header = () => {
  return (
    <Box component="header" sx={{ mb: 5 }}>
      <AppBar position="static">
        <Toolbar>
          <Button
            component={Link}
            passHref
            href="/"
            sx={{ color: "white", marginInlineEnd: "auto" }}
          >
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              BooksApp
            </Typography>
          </Button>
          <Button
            component={Link}
            passHref
            href="/add"
            variant="outlined"
            sx={{ color: "white" }}
          >
            Add Book
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
