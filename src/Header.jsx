import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Autocomplete, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from './Logo_ustaplanet.png'; 
import { ThemeProvider, createTheme } from '@mui/material';
import './header.css';

const opciones = [
  { label: 'español' },
  { label: 'ingles' },
];

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A00E0',  // Un tono púrpura espacial
    },
    secondary: {
      main: '#8E2DE2',  // Color secundario, más vibrante como una nebulosa
    },
    background: {
      default: '#0D0D2B', // Color oscuro, como el espacio profundo
      paper: '#1B1B38',   // Fondo de los elementos como papel con un tono más claro
    },
    text: {
      primary: '#FFFFFF', // Texto en blanco, como estrellas
      secondary: '#B0A8B9' // Texto en tonos grises para el contraste
    }
  },
  typography: {
    fontFamily: "'Space Mono', monospace", // Fuente con un toque futurista
  },
});

const Header = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState('');

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar 
        position="static" 
        style={{
          background: 'linear-gradient(45deg, #1c1f4a, #2b0033)', // Degradado espacial
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.5)',
        }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="logo" onClick={handleDashboard}>
            <img 
              src={logo} 
              alt="Logo" 
              style={{ 
                width: '100px', // Tamaño ajustado
                height: '50px', // Tamaño ajustado
                borderRadius: '8px', // Bordes redondeados
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.7)', // Brillo suave alrededor del borde
                flexGrow: 1
              }} 
            />
          </IconButton>
          <Button
            onClick={() => navigate('/')}
            className='button'
            style={{ flexGrow: 1 }}
          >
            <Typography variant="h6" style={{ flexGrow: 1, textShadow: '0px 0px 10px #FFFFFF', color: '#FFFFFF' }}>
              Usta Planet
            </Typography>
          </Button>
          <Button
            onClick={() => navigate('/')}
            className='button'
            style={{ marginRight: '100px', flexGrow: 1 }}
          >
            <Typography variant="h6" style={{ flexGrow: 1, textShadow: '0px 0px 10px #FFFFFF', color: '#FFFFFF' }}>
              Explora
            </Typography>
          </Button>
          <Button
            onClick={() => navigate('/')}
            className='button'
            style={{ marginRight: '100px', flexGrow: 1 }}
          >
            <Typography variant="h6" style={{ flexGrow: 1, textShadow: '0px 0px 10px #FFFFFF', color: '#FFFFFF' }}>
              Perfil
            </Typography>
          </Button>
          <Autocomplete
            options={opciones}
            getOptionLabel={(option) => option.label || ''} // Maneja opciones vacías
            value={value}
            onChange={(event, newValue) => setValue(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Selecciona un idioma" variant="outlined" />
            )}
            fullWidth
          />
          <Button 
            variant="contained"
            color="primary"
            onClick={() => navigate('/ej1')}
            style={{ marginTop: '10px' }}
          >
            Volver
          </Button>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;