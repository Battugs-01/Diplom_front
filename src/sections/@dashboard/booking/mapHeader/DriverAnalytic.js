import PropTypes from 'prop-types';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Stack, Typography, CircularProgress, Card } from '@mui/material';
// components
import Iconify from 'src/components/iconify';
// util
import { fShortenNumber } from 'src/utils/formatNumber';

// ----------------------------------------------------------------------

const HoverableCard = styled(Card)({
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
});

DriverAnalytic.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.string,
  percent: PropTypes.number,
  total: PropTypes.number,
  onClickStatus: PropTypes.func,
};

// ----------------------------------------------------------------------

export default function DriverAnalytic({ title, total, icon, color, percent, onClickStatus }) {
  // rendering --------------------------------------------------------------------------------------------------

  return (
    <HoverableCard
      sx={{ px: 2, py: 1, background: 'none', boxShadow: 'none', border: 'none', cursor: 'pointer' }}
      onClick={() => {
        onClickStatus(title);
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ width: 1, minWidth: 100 }}>
        <Stack alignItems="center" justifyContent="center" sx={{ position: 'relative' }}>
          <Iconify icon={icon} width={24} sx={{ color, position: 'absolute' }} />

          <CircularProgress
            variant="determinate"
            value={percent}
            size={40}
            thickness={4}
            sx={{ color, opacity: 0.48 }}
          />

          <CircularProgress
            variant="determinate"
            value={100}
            size={40}
            thickness={4}
            sx={{
              top: 0,
              left: 0,
              opacity: 0.48,
              position: 'absolute',
              color: (theme) => alpha(theme.palette.grey[500], 0.16),
            }}
          />
        </Stack>

        <Stack sx={{ ml: 1 }}>
          <Typography variant="subtitle2">{title}</Typography>

          <Typography variant="subtitle2">{fShortenNumber(total)}</Typography>
        </Stack>
      </Stack>
    </HoverableCard>
  );
}
