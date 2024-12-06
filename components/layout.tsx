import Head from "next/head";
import { CssBaseline } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Header from "./header";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>Next.js with Auth0</title>
      </Head>
      <CssBaseline />
      <Header />

      <Box component="main">
        <Container>{children}</Container>
      </Box>
    </>
  );
};

export default Layout;
