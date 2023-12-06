// @mui
import { styled } from '@mui/material/styles';
import { Stack, Typography, Box, Card, Container } from '@mui/material';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// hooks
import useResponsive from 'src/hooks/useResponsive';
// components
import Image from 'src/components/image';
// sections
import AuthLoginForm from './AuthLoginForm';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 1024,
  display: 'flex',
  flexDirection: 'center',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const mdUp = useResponsive('up', 'md');

  return (
    <RootStyle>
      {mdUp && (
        <SectionStyle>
          <Image visibleByDefault disabledEffect src="/assets/illustrations/Sysco.png" alt="login" />
        </SectionStyle>
      )}

      <Container maxWidth="xs">
        <ContentStyle>
          <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                Нэвтрэх
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>Нэвтрэх мэдээллээ оруулна уу.</Typography>
            </Box>
          </Stack>

          <AuthLoginForm />
        </ContentStyle>
      </Container>
    </RootStyle>
    // <LoginLayout>

    //   <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
    //     <Typography variant="h4">Sign in to Minimal</Typography>

    //     <Stack direction="row" spacing={0.5}>
    //       <Typography variant="body2">New user?</Typography>

    //       <Link component={NextLink} href={PATH_AUTH.register} variant="subtitle2">
    //         Create an account
    //       </Link>
    //     </Stack>

    //     <Tooltip title={method} placement="left">
    //       <Box
    //         component="img"
    //         alt={method}
    //         src={`/assets/icons/auth/ic_${method}.png`}
    //         sx={{ width: 32, height: 32, position: 'absolute', right: 0 }}
    //       />
    //     </Tooltip>
    //   </Stack>

    //   <Alert severity="info" sx={{ mb: 3 }}>
    //     Use email : <strong>demo@minimals.cc</strong> / password :<strong> demo1234</strong>
    //   </Alert>

    //   <AuthLoginForm />

    //   <AuthWithSocial />
    // </LoginLayout>
  );
}
