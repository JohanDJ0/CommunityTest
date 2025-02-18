import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import GradeIcon from '@mui/icons-material/Grade';
import ShareIcon from '@mui/icons-material/Share';
import BackHandIcon from '@mui/icons-material/BackHand';
import Rating from '@mui/material/Rating';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import { useAuth0 } from '@auth0/auth0-react'; // Importar useAuth0
import AddIcon from '@mui/icons-material/Add';
import { useMediaQuery } from '@mui/material';
import AutoModeSharpIcon from '@mui/icons-material/AutoModeSharp'; // Importa el ícono
import noImage from '../../assets/NoImagen.png';
import { followService } from 'components/followService';
import StoreIcon from '@mui/icons-material/Store';
import { API_BASE_URL } from 'components/bdd';
import ShareModal from '../../components/ShareModal';//compartir 

interface Review {
  name: string; // Nombre de la reseña
  description: string; // Comentario
  rating: number; // Calificación
  written_by: string; // Usuario
}


interface ServiceReviewProps {
  id: number;
  name: string; // Nombre del servicio
  image: string | null | false;
  qualification: number;
  reviews: Review[]; // Reseñas
  is_following: boolean;
}


interface ServicesProps {
  darkMode: boolean;
}


const ServiceReviewsPage: React.FC<ServicesProps> = ({ darkMode }) => {
  const token = localStorage.getItem("token");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0(); // Obtener el usuario autenticado
  const [service, setService] = useState<ServiceReviewProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceName, setServiceName] = useState<string | null>(null); // Para almacenar el nombre del servicio
  const [fade, setFade] = useState(false); // Estado para manejar la transición
  const [openModal, setOpenModal] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [isFollowing, setIsFollowing] = useState(false); // Hook para el follow del servicio
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);// modal


  const [newReview, setNewReview] = useState<Review>({
    name: '',
    description: '',
    rating: 0,
    written_by: (isAuthenticated && user && user.name) || '',
  });

  // Función para obtener reseñas
  const fetchReviews = () => {
    fetch(`${API_BASE_URL}/reviews/${id}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Error en la respuesta del servidor');
      })
      .then((responseData) => {
        console.log('Datos de la API:', responseData);
        setService(prevService => ({
          ...prevService!,
          reviews: responseData,
        }));
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener las reseñas del servicio:', error);
        setError('No se pudo cargar la información del servicio.');
        setLoading(false);
      });
  };


  // Llama a esta función en el evento correspondiente, por ejemplo, al hacer clic en un botón
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
 
    const fetchServiceData = async () => {
      try {
        const reviewsResponse = await fetch(`${API_BASE_URL}/reviews/${id}`);
        const reviewsData = await reviewsResponse.json();
 
        const serviceResponse = await fetch(`${API_BASE_URL}/services/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ params: { token } }),
        });
        const serviceData = await serviceResponse.json();
 
        if (isMounted) {
          setService({
            id: Number(id),
            name: serviceData.result?.name || 'Nombre no disponible',
            image: serviceData.result?.image || null,
            qualification: serviceData.result?.qualification || 0,
            reviews: reviewsData || [],
            is_following: serviceData.result?.is_following || false,
          });
          setServiceName(serviceData.result?.name || 'Nombre no disponible');
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error al obtener los datos:', error);
          setError('No se pudo cargar la información del servicio.');
          setLoading(false);
        }
      }
    };
 
    fetchServiceData();
 
    // Establece un intervalo para actualizar las reseñas
    const intervalId = setInterval(() => {
      if (isMounted) {
        fetchReviews();
      }
    }, 5000);
 
    return () => {
      isMounted = false;
      clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
    };
  }, [id, token]);

  const handleNovedadesClick = () => {
    navigate(`/MyService`); // Cambia a una ruta relativa
  };


  const handleCreateReviewClick = () => {
    navigate(`/reviews/create`); // Redirige a la URL para crear una reseña
  };


  // Manejar la transición de desvanecimiento al cargar el nombre
  useEffect(() => {
    if (serviceName) {
      const timer = setTimeout(() => {
        setFade(true); // Cambiar a verdadero cuando hay un nuevo nombre
      }, 0); // Iniciar la transición inmediatamente


      return () => clearTimeout(timer);
    }
  }, [serviceName]);


  const handleFollow = async () => {
    if (!service) return; // Evita errores si service no está cargado
    // Se creó un nuevo componente que recibe dos parametros, el id y el token
    const success = await followService(service.id, token || '');
    if (success) {
      setIsFollowing(true);
    }
  };


  if (loading) {
    return <p>Cargando datos del servicio...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }
  if (!service) {
    return <p>No se encontró el servicio.</p>;
  }
 


  return (
    <div className='first-div'>
      <div className='second-div'>
        <div className={`box-div ${darkMode ? 'dark' : 'light'}`} style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', textAlign: 'left', paddingBottom: '10px' }}>
              <StoreIcon style={{ marginRight: '4px' }} />
              <span onClick={() => navigate(`/MyService`)} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>Mi negocio</span>
              <span style={{ margin: '0 8px' }}>/</span>
              <span style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>{service.name}</span>
              <span style={{ margin: '0 8px' }}>/</span>
              <span style={{ fontWeight: 'bold' }}>Reseñas</span>
              {/* <span style={{ margin: '0 8px' }}>/</span>
              <span>Subsección</span> */}
          </div>
          <Card style={{ maxHeight: isSmallScreen ? '400px' : '500px', overflowY: 'auto' }}>
            <Box position="relative" width="100%" height={isSmallScreen ? '200px' : '300px'}>
              <CardMedia
                component="img"
                height="300"
                image={service.image ? `data:image/jpg;base64,${atob(service.image)}` :  noImage}
                alt={service.name}
                style={{ filter: 'brightness(0.7)' }}
              />

              <Typography
                variant="h1"
                className={`fade ${fade ? 'fade-in' : ''}`}
                style={{
                  position: 'absolute',
                  bottom: '30px',
                  left: '10px',
                  color: 'white',
                  padding: '5px',
                  transition: 'opacity 1s ease', // Transición para la aparición
                  opacity: fade ? 1 : 0, // Controla la opacidad
                }}
              >
                {serviceName || 'Cargando nombre...'}
              </Typography>
              <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'white', // Asegura que el texto y estrellas sean visibles
                    padding: '5px',
                  }}
                >
                  <Rating
                    name="read-only"
                    value={service.qualification || 0}
                    precision={0.5}
                    readOnly
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    style={{ marginLeft: '10px' ,fontWeight: 'bold', color: 'white'}}
                  >
                    {service.qualification ? service.qualification.toFixed(1) : '0.0'}
                  </Typography>
                </div>
            </Box>


            <CardContent>
              <Stack spacing={2} direction="row">
                <Button variant="contained" startIcon={<AutoModeSharpIcon />} onClick={handleNovedadesClick}>Novedades</Button>
                {/* <Button variant="contained" startIcon={<GradeIcon />} onClick={() => navigate(`/services/${id}/reviews`)}>Reseñas</Button> */}
                <Button variant="contained" startIcon={<BackHandIcon />} onClick={() => navigate(`/MyProposals/${id}`)}>Propuestas</Button>
                <Button variant="outlined" startIcon={<ShareIcon />} onClick={() => setIsShareModalOpen(true)}>Compartir</Button>
              </Stack>
              <CardContent>
                <Typography variant="h5" align="left" paddingTop="10px">
                  Reseñas de usuarios
                </Typography>
               


                {service.reviews.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {service.reviews.map((review, index) => (
                      <Card key={index} sx={{ padding: 2, borderRadius: 2, boxShadow: 2, width: '100%' }}>


                        <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 1, textAlign: 'left' }}>
                          {review.written_by}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ marginBottom: 1 }}>
                          <Rating value={review.rating} readOnly sx={{ textAlign: 'left' }} />
                          <Typography variant="subtitle1" fontWeight="bold" sx={{ textAlign: 'left' }}>
                            {review.name}
                          </Typography>




                        </Stack>


                        <Typography variant="body2" sx={{ textAlign: 'left' }}>
                          {review.description}
                        </Typography>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ textAlign: 'left' }}>No hay reseñas disponibles.</Typography>
                )}
              </CardContent>
            </CardContent>
          </Card>
          <ShareModal open={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
        </div>
      </div>
    </div>
  );
};


export default ServiceReviewsPage;