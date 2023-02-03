import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// next
import NextLink from 'next/link';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Link } from '@mui/material';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  // OR using local (public folder)
  // -------------------------------------------------------
  // const logo = (
  //   <Box
  //     component="img"
  //     src="/logo/logo_single.svg" => your path
  //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
  //   />
  // );

  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 40,
        height: 40,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      {/* <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 512 512">
        <defs>
          <linearGradient id="BG1" x1="100%" x2="50%" y1="9.946%" y2="50%">
            <stop offset="0%" stopColor={PRIMARY_DARK} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>

          <linearGradient id="BG2" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY_LIGHT} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>

          <linearGradient id="BG3" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY_LIGHT} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>
        </defs>

        <g fill={PRIMARY_MAIN} fillRule="evenodd" stroke="none" strokeWidth="1">
          <path
            fill="url(#BG1)"
            d="M183.168 285.573l-2.918 5.298-2.973 5.363-2.846 5.095-2.274 4.043-2.186 3.857-2.506 4.383-1.6 2.774-2.294 3.939-1.099 1.869-1.416 2.388-1.025 1.713-1.317 2.18-.95 1.558-1.514 2.447-.866 1.38-.833 1.312-.802 1.246-.77 1.18-.739 1.111-.935 1.38-.664.956-.425.6-.41.572-.59.8-.376.497-.537.69-.171.214c-10.76 13.37-22.496 23.493-36.93 29.334-30.346 14.262-68.07 14.929-97.202-2.704l72.347-124.682 2.8-1.72c49.257-29.326 73.08 1.117 94.02 40.927z"
          />
          <path
            fill="url(#BG2)"
            d="M444.31 229.726c-46.27-80.956-94.1-157.228-149.043-45.344-7.516 14.384-12.995 42.337-25.267 42.337v-.142c-12.272 0-17.75-27.953-25.265-42.337C189.79 72.356 141.96 148.628 95.69 229.584c-3.483 6.106-6.828 11.932-9.69 16.996 106.038-67.127 97.11 135.667 184 137.278V384c86.891-1.611 77.962-204.405 184-137.28-2.86-5.062-6.206-10.888-9.69-16.994"
          />
          <path
            fill="url(#BG3)"
            d="M450 384c26.509 0 48-21.491 48-48s-21.491-48-48-48-48 21.491-48 48 21.491 48 48 48"
          />
        </g>
      </svg> */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        width="100%"
        height="100%"
        viewBox="0 0 1200 1200"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform="translate(0.000000,1143.000000) scale(0.100000,-0.100000)" fill={PRIMARY_MAIN} stroke="none">
          <path d="M5590 11224 c-36 -2 -144 -8 -240 -14 -1964 -121 -3725 -1292 -4594 -3055 -410 -830 -609 -1768 -566 -2669 28 -606 136 -1142 337 -1684 282 -760 698 -1408 1272 -1982 289 -289 529 -485 861 -705 1456 -965 3308 -1178 4945 -569 1803 669 3117 2207 3494 4089 72 361 103 679 103 1070 1 489 -45 867 -163 1344 -145 590 -405 1182 -744 1696 -410 622 -947 1158 -1571 1568 -824 542 -1791 858 -2759 901 -235 11 -309 13 -375 10z m334 -2069 c405 -47 790 -218 1095 -485 l93 -83 -118 -118 -117 -118 -32 27 c-17 15 -61 51 -96 81 -191 162 -447 284 -719 343 -92 19 -133 22 -330 22 -195 0 -239 -3 -326 -22 -306 -67 -587 -211 -795 -409 l-45 -44 -117 118 -116 118 42 43 c23 24 78 72 122 107 421 330 943 480 1459 420z m76 -530 c186 -41 384 -124 527 -221 86 -59 213 -165 213 -179 0 -6 -52 -62 -114 -125 l-115 -114 -48 45 c-136 127 -344 230 -548 270 -91 18 -329 18 -420 0 -204 -40 -412 -143 -548 -270 l-48 -45 -117 115 c-64 63 -118 115 -121 117 -7 4 89 87 177 154 156 117 398 221 607 259 128 24 437 20 555 -6z m-82 -519 c153 -38 344 -139 427 -225 l29 -32 -116 -116 -116 -115 -53 42 c-114 90 -237 132 -384 132 -147 0 -292 -51 -395 -139 l-42 -36 -116 116 -116 116 29 31 c70 73 224 163 353 205 143 46 358 55 500 21z m-80 -535 c57 -20 152 -80 152 -96 0 -6 -64 -74 -143 -153 l-142 -142 -148 148 -148 149 55 38 c30 21 79 46 108 56 71 24 195 24 266 0z m4288 -639 c203 -105 159 -393 -68 -443 -96 -22 -215 50 -258 157 -27 65 -23 113 12 181 59 116 201 163 314 105z m-5831 -152 c253 -37 411 -107 568 -250 116 -106 217 -276 257 -433 77 -303 34 -651 -116 -943 -69 -134 -87 -163 -457 -701 l-311 -453 -418 0 c-230 0 -418 2 -418 6 0 4 450 653 598 863 l45 63 -44 -7 c-77 -14 -279 -8 -359 10 -121 27 -248 94 -336 177 -160 152 -247 337 -275 583 -30 264 45 529 205 732 161 203 377 317 676 356 149 20 236 19 385 -3z m-1765 -1425 l0 -1355 -370 0 -370 0 0 1045 0 1045 -204 2 -204 3 77 110 c43 61 139 199 215 308 l137 197 360 0 359 0 0 -1355z m4858 1058 l-3 -298 -501 -3 -502 -2 -22 -123 c-12 -67 -26 -140 -30 -162 -5 -22 -8 -41 -6 -42 1 -1 33 3 71 9 101 16 377 3 490 -22 246 -55 444 -223 543 -461 87 -210 84 -512 -8 -732 -117 -282 -381 -517 -670 -597 -291 -80 -678 -74 -950 16 -88 29 -306 133 -336 160 l-22 19 29 305 c15 168 28 313 28 323 1 14 11 17 64 17 l63 0 59 -61 c174 -176 360 -259 582 -259 140 0 256 38 356 116 96 75 147 194 148 344 0 99 -5 127 -36 190 -120 240 -604 316 -938 148 -52 -26 -67 -28 -135 -26 -76 3 -77 3 -74 28 4 23 275 1337 287 1388 l5 22 755 0 755 0 -2 -297z m1866 267 c399 -108 685 -424 751 -831 22 -140 22 -936 -1 -1070 -70 -409 -358 -725 -752 -825 -463 -118 -938 101 -1154 531 -47 93 -84 214 -98 317 -8 56 -10 247 -8 569 4 484 4 484 30 580 47 174 128 317 253 448 145 151 313 245 525 292 116 26 339 21 454 -11z m-7091 -3030 c36 -40 35 -60 -3 -60 -19 0 -33 7 -40 20 -13 24 -71 28 -89 6 -15 -18 -6 -24 73 -51 77 -26 104 -59 90 -111 -25 -101 -179 -110 -227 -14 l-17 35 27 6 c19 4 32 0 40 -10 28 -36 35 -41 61 -41 32 0 52 16 52 42 0 13 -15 22 -55 34 -73 21 -108 51 -108 92 0 87 131 122 196 52z m127 -1 c0 -27 -3 -30 -27 -27 -22 2 -29 9 -31 31 -3 24 0 27 27 27 28 0 31 -3 31 -31z m975 6 c27 -26 33 -71 14 -108 -6 -12 -30 -41 -52 -64 l-41 -43 52 0 c51 0 52 -1 52 -30 l0 -30 -101 0 c-88 0 -100 2 -95 16 3 9 6 20 6 25 0 5 30 41 66 80 52 56 65 75 62 97 -4 35 -52 45 -63 13 -4 -15 -15 -21 -36 -21 -32 0 -35 7 -18 44 23 50 113 63 154 21z m197 14 c29 -16 48 -70 48 -139 0 -76 -20 -124 -59 -144 -42 -22 -56 -20 -93 13 -31 28 -33 33 -36 110 -4 89 7 132 42 156 24 18 69 19 98 4z m232 -19 c61 -73 40 -239 -34 -270 -81 -34 -145 64 -126 194 10 65 47 106 96 106 30 0 44 -6 64 -30z m246 0 c0 -30 -1 -30 -55 -30 -48 0 -55 -2 -55 -20 0 -16 7 -20 34 -20 38 0 82 -37 93 -78 14 -58 -62 -138 -122 -127 -28 5 -85 55 -85 74 0 5 12 11 27 14 20 4 31 0 41 -14 7 -10 24 -19 37 -19 28 0 41 33 31 75 -5 20 -13 25 -36 25 -16 0 -32 -5 -35 -10 -6 -9 -41 -5 -53 5 -3 3 16 117 24 143 2 8 27 12 79 12 l75 0 0 -30z m-1650 -160 l0 -110 -30 0 -30 0 0 110 0 110 30 0 30 0 0 -110z m100 100 c0 -7 6 -7 19 0 30 15 82 12 103 -7 15 -13 18 -32 18 -110 l0 -93 -30 0 -30 0 0 79 c0 83 -12 107 -44 95 -25 -9 -36 -46 -36 -115 0 -59 0 -59 -30 -59 l-30 0 0 110 0 110 30 0 c17 0 30 -5 30 -10z m347 -12 c30 -28 29 -44 -1 -50 -16 -3 -30 2 -40 14 -20 23 -31 23 -56 -2 -22 -22 -25 -46 -10 -84 12 -32 54 -36 69 -7 13 24 61 17 61 -9 0 -21 -42 -58 -75 -66 -34 -8 -92 21 -109 55 -29 54 -13 135 31 160 33 19 105 13 130 -11z m195 11 c21 -11 48 -66 48 -99 0 -18 -6 -20 -70 -20 -55 0 -70 -3 -70 -15 0 -8 9 -19 19 -25 21 -10 51 -4 51 11 0 5 14 9 30 9 34 0 40 -19 13 -42 -52 -45 -103 -46 -146 -2 -69 69 -27 194 65 194 22 0 48 -5 60 -11z" />
          <path d="M9957 6895 c-76 -26 -117 -88 -117 -175 0 -28 5 -61 11 -73 17 -32 60 -77 91 -93 42 -22 122 -18 171 8 l42 23 -30 3 c-23 3 -38 15 -65 55 -21 31 -44 53 -57 55 -20 3 -22 -2 -25 -50 -3 -50 -5 -53 -30 -56 l-28 -3 0 135 0 136 88 0 c80 0 91 -2 110 -23 32 -34 29 -81 -7 -108 l-29 -21 33 -44 c18 -23 35 -49 38 -56 12 -32 57 65 57 122 0 34 -32 100 -61 127 -31 28 -91 53 -126 53 -15 -1 -45 -7 -66 -15z" />
          <path d="M9980 6780 c0 -31 0 -31 48 -28 43 3 47 5 47 28 0 23 -4 25 -47 28 -48 3 -48 3 -48 -28z" />
          <path d="M4006 6204 c-136 -43 -229 -159 -257 -318 -22 -130 17 -265 107 -365 139 -155 409 -140 526 29 149 212 75 547 -140 642 -59 27 -173 32 -236 12z" />
          <path d="M8940 6109 c-108 -21 -217 -107 -263 -207 -22 -46 -22 -57 -25 -573 -3 -514 -2 -528 18 -583 26 -68 100 -152 167 -188 181 -98 412 -20 501 170 l27 57 0 530 0 530 -27 55 c-57 115 -150 187 -272 209 -66 12 -64 12 -126 0z" />
          <path d="M3392 3618 c-12 -12 -17 -143 -6 -172 10 -25 43 -19 54 10 6 14 10 47 10 74 0 83 -25 121 -58 88z" />
          <path d="M3606 3614 c-9 -24 -7 -157 3 -172 5 -8 17 -12 27 -10 31 6 41 103 18 181 -7 21 -40 22 -48 1z" />
          <path d="M2858 3549 c-33 -19 -21 -39 22 -39 43 0 49 9 24 34 -18 19 -23 19 -46 5z" />
        </g>
      </svg>
    </Box>
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={NextLink} href="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default Logo;