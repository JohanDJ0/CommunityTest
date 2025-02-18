import React, { useState, useEffect } from 'react';
import HeaderP from '../../components/Menu';
import Button from '@mui/material/Button';
import '../../css/Home.css';
import { Typography, Box, useMediaQuery,keyframes  } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ImageCarousel from "../../components/ImageCarousel";
import { Card, CardContent } from "@mui/material";
import Footer from 'components/Footer';
import Equipo from 'assets/Equipo.jpeg';
import { useAuth0 } from '@auth0/auth0-react';
import MAHL from '../../img/mahl.jpg'
import { Padding } from '@mui/icons-material';

interface ServicesProps {
  darkMode: boolean;
}
const HomePage: React.FC<ServicesProps> = ({ darkMode }) => {
  const { loginWithRedirect } = useAuth0();
  const [expanded, setExpanded] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:600px)');


  const handleSignUp = () => {
    localStorage.setItem('isSignUp', 'true');
    loginWithRedirect({
      authorizationParams: { screen_hint: 'signup' }, // Añadir screen_hint correctamente
    });
  };



  useEffect(() => {
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
  }, []);

  const handleDiscover = () => {
    setExpanded(true);
    document.body.style.overflow = 'auto';

    setTimeout(() => {
      document.getElementById('expandedContent')?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

    // Definir animación de rebote usando `keyframes` de MUI
    const bounce = keyframes`
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  `;
  return (

    <div className={`home-container min-h-screen flex flex-col ${darkMode ? 'dark' : 'light'}`}>

      <HeaderP />
      {/* Sección Hero */}
      <div style={{ marginTop: '30px' }} className={`hero-section flex flex-col items-center justify-center p-6 ${darkMode ? 'text-white' : 'text-black'} relative`}>
        <h1 className={`text-4xl md:text-5xl font-bold text-center mb-6 relative z-10 drop-shadow-lg ${darkMode ? 'text-white' : 'text-black'}`}>
          Community: Donde cada <br /> interacción cuenta
        </h1>

        {/* Botón para expandir contenido */}
        <Button
          endIcon={<KeyboardArrowDownIcon />}
          variant="contained"
          onClick={handleDiscover}
          sx={{
            borderRadius: '50px',
            backgroundColor: darkMode ? '#333' : '#000',
            color: '#fff',
            padding: '8px 16px',
            animation: `${bounce} 1s infinite`,
          }}
        >
          Descubra la comunidad
        </Button>
      </div>

      {/* Contenido expandido */}
      <div className="community-content">
        {expanded && (
          <div id="expandedContent">
            <Card
              style={{
                width: "100%",
                backgroundColor: darkMode ? '#333' : '#ffda79',
                margin: 0,
                padding: '20px',
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                minHeight: '600px',
                marginBottom: '80px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <CardContent>
                <Typography
                  variant="h3"
                  style={{
                    marginBottom: '16px',
                    fontFamily: "'Poppins', sans-serif",
                    whiteSpace: 'pre-line',
                    overflowWrap: 'break-word',
                    maxWidth: '90%',
                    color: darkMode ? '#fff' : '#000',
                    fontSize: isSmallScreen ? '1.5rem' : '2rem', // Tamaño de fuente responsivo
                  }}
                >
                  Únete a nuestra comunidad: Descubre cómo formar parte de algo más grande
                </Typography>

                <Typography
                  variant="body2"
                  style={{
                    marginBottom: '16px',
                    padding: '0 20px',
                    maxWidth: '90%',
                    fontSize: isSmallScreen ? '1rem' : '1.25rem', // Tamaño de fuente responsivo
                    color: darkMode ? '#ccc' : '#555',
                  }}
                >
                  Community es una aplicación innovadora diseñada para fomentar conexiones y promover la colaboración entre los miembros. Nuestra plataforma proporciona un espacio para que las personas participen en interacciones significativas.
                  Puedes acceder a una amplia gama de servicios que ofrecen los usuarios de la comunidad. A continuación, te presentamos una selección de estos servicios:
                </Typography>

                {/* Botón de registro */}
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button
                    style={{
                      backgroundColor: '#000',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '10px 20px',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#333')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#000')}
                    onClick={handleSignUp} // Agrega la funcionalidad de registro
                  >
                    Regístrate
                  </button>
                </div>
                <div style={{ textAlign: 'center', marginTop: '20px', color: '#555' }}>
                  <Typography
                    variant="body2"
                    style={{
                      fontSize: isSmallScreen ? '0.75rem' : '0.875rem', // Tamaño de fuente responsivo
                      fontStyle: 'italic',
                      color: darkMode ? '#ccc' : '#555',
                    }}
                  >
                    ¿Estás listo para dar el siguiente paso y formar parte de una comunidad que te inspire y te apoye?
                  </Typography>
                </div>
              </CardContent>
            </Card>


            <ImageCarousel darkMode={darkMode} />

            {/* Sección con Imagen y Texto */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 4,
                p: 4,
                bgcolor: darkMode ? '#444' : '#b1d8d9', // Cambiar color de fondo
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <Box
                component="img"
                src={Equipo} // Ruta de la imagen
                alt="Equipo"
                sx={{
                  width: 400,
                  height: 400,
                  objectFit: 'cover',
                  mr: 10,
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />

              <Box sx={{ flex: 1, maxWidth: 800 }}>
                <Typography variant="body1" align="justify" sx={{ color: darkMode ? '#ccc' : 'text.primary', lineHeight: 1.6 }}>
                  A nuestro equipo le apasiona crear tecnología que una a las personas y tenga un impacto positivo en las comunidades locales.
                  Estamos convencidos de que, al proporcionar plataformas y herramientas que faciliten la comunicación y la cooperación entre
                  individuos y grupos, podemos fortalecer el tejido social y fomentar una mayor cohesión en las comunidades.
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="h5"
              align="center"
              fontWeight="bold"
              style={{ marginBottom: '16px', color: darkMode ? '#fff' : '#000' }} // Cambiar color del texto
            >
              Conoce a los desarrolladores
            </Typography>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
              {[
                { name: "Ángel", role: "Desarrollador Full-Stack", avatar: MAHL },
                { name: "Martha", role: "UX Designer", avatar: "https://juegosmoda2049.neocities.org/Captura%20de%20pantalla%202024-11-21%20124137.png" },
                { name: "Johan De Jesus", role: "Desarrollador Full-Stack", avatar: "https://juegosmoda2049.neocities.org/IMG-20221103-WA0011.jpg" },
                { name: "Marcos", role: "Desarrollador Front-end", avatar: "https://juegosmoda2049.neocities.org/width_133.jpg" },
                { name: "Sandra", role: "Desarrollador Movil", avatar: "https://juegosmoda2049.neocities.org/width_133.png" },
              ].map((dev) => (
                <div key={dev.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img
                    src={dev.avatar}
                    alt={dev.name}
                    style={{
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      marginBottom: '8px',
                      objectFit: 'cover',
                    }}
                  />
                  <Typography variant="h6" style={{ fontWeight: 600, color: darkMode ? '#fff' : '#000' }}>
                    {dev.name}
                  </Typography>
                  <Typography variant="body2" style={{ color: darkMode ? '#ccc' : '#555' }}>
                    {dev.role}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
};

export default HomePage;
