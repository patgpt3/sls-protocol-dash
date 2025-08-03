import { ReactNode } from 'react';

// @mui material components
import Grid from '@mui/material/Grid';
import { keyframes, Theme } from '@mui/material/styles';

// Waev Dashboard components
import MDBox from 'components/Elements/MDBox';

// Waev Dashboard examples components
import { PageLayout } from 'components/LayoutContainers/PageLayout';

// Waev Dashboard page layout routes
// import pageRoutes from "page.routes";

// Declaring props types for BasicLayout
interface Props {
  image: string;
  children: ReactNode;
}

const bgKeyframes = () => keyframes`
0% {
  opacity: 0;
  transform: translateY(20px);
}
100% {
  opacity: 1;
  transform: translateY(0);
}
`;

export function BasicLayout({ image, children }: Props): JSX.Element {
  return (
    <PageLayout>
      {/* <DefaultNavbar
        routes={pageRoutes}
        action={{
          type: "external",
          route: "https://creative-tim.com/product/material-dashboard-2-pro-react-ts",
          label: "buy now",
          color: "info",
        }}
        transparent
        light
      /> */}
      <MDBox
        position="absolute"
        width="100%"
        minHeight="100vh"
        sx={{
          backgroundImage: ({
            functions: { linearGradient, rgba },
            palette: { gradients },
          }: Theme) =>
            image &&
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          animation: `3s ease-out ${bgKeyframes()}`,
        }}
      />
      <MDBox px={1} width="100%" height="100vh" mx="auto">
        <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
          <Grid
            item
            xs={11}
            sm={9}
            md={6}
            lg={6}
            xl={4}
            sx={{ paddingLeft: '0 !important', paddingTop: '0 !important' }}
          >
            {children}
          </Grid>
        </Grid>
      </MDBox>
      {/* <Footer light /> */}
    </PageLayout>
  );
}
