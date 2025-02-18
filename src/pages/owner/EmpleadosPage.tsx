import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { API_BASE_URL } from 'components/bdd';
import { useTranslation } from 'react-i18next';

interface Employee {
  id: number;
  name: string;
  age: number;
  email: string;
  photo: string; // Suponiendo que la foto es una URL o una cadena base64
}

interface ServicesProps {
  darkMode: boolean;
}

const EmpleadosPage: React.FC<ServicesProps> = ({ darkMode }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const isSmallScreen = window.innerWidth < 600; // Ajusta el tamaño de la pantalla según necesites
  const serviceId = localStorage.getItem('service');
  const [openModal, setOpenModal] = useState(false);
  const { t, i18n } = useTranslation("Employees");


  useEffect(() => {
    fetch(`${API_BASE_URL}/employees/${serviceId}`)
    .then((res) => res.json())
    .then((result: Employee[]) => {
      if (Array.isArray(result)) {
        setEmployees(result);
        console.log(result)
      } else {
        console.error("Formato de datos inesperado:", result);
      }
    })
    .catch((error) => {
      console.error('Error al obtener los datos:', error);
    });
    // Datos de empleados de ejemplo
    /* const defaultEmployees: Employee[] = [
      {
        id: 1,
        name: 'Juan Pérez',
        age: 30,
        email: 'juan.perez@example.com',
        photo: 'https://juegosmoda2049.neocities.org/DALL%C2%B7E%202024-01-16%2015.58.30%20-%20In%20a%20post-apocalyptic%20world,%20harpy%20eagles%20have%20evolved%20into%20the%20next%20dominant%20species%20on%20Earth,%20having%20both%20bird%20and%20humanoid%20characteristics.%20These%20e.png', 
      },
      {
        id: 2,
        name: 'María López',
        age: 25,
        email: 'maria.lopez@example.com',
        photo: 'https://w.wallhaven.cc/full/vg/wallhaven-vgk1l3.png', 
      },
      {
        id: 3,
        name: 'Carlos García',
        age: 35,
        email: 'carlos.garcia@example.com',
        photo: 'https://w.wallhaven.cc/full/rd/wallhaven-rdqk5j.jpg', 
      },
      {
        id: 4,
        name: 'Ana Torres',
        age: 28,
        email: 'ana.torres@example.com',
        photo: 'https://w.wallhaven.cc/full/47/wallhaven-472zgo.png', 
      },
    ];

    setEmployees(defaultEmployees); */
  }, []);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleDelete = (id: number) => {
    console.log(`Eliminando usuario con ID: ${id}`);

    fetch(`${API_BASE_URL}/employees/unlink/${serviceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ params: { id_employee: id } }),
    })
      .then(response => response.json())
      .then((data) => {
        if (data.result && data.result.success) {
          console.log("Se eliminó al usuario con éxito:", data.result.Message); // Mensaje de éxito
          setEmployees((prev) => prev.filter((employee) => employee.id !== id));
          handleCloseModal(); // Cerrar el modal al crear la reseña con éxito
        } else {
          console.error("Error al eliminar el usuario:", data.result?.Message || "Error desconocido");
        }
      })
      .catch((error) => {
        console.error("Error al eliminar el usuario:", error.message || "Error desconocido");
      });
  };

  return (
    <div className={`first-div ${darkMode ? 'dark' : 'light'}`}>
      <div className='second-div'>
        <div className={`box-div ${darkMode ? 'dark' : 'light'}`}>
          <div style={{
            maxHeight: isSmallScreen ? '400px' : '500px',
            overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', textAlign: 'left', paddingBottom: '10px' }}>
              <PersonIcon style={{ marginRight: '4px' }} />
              <span style={{ fontWeight: 'bold' }}>{t("Employees")}</span>
              {/* <span style={{ margin: '0 8px' }}>/</span>
              <span>Sección</span>
              <span style={{ margin: '0 8px' }}>/</span>
              <span>Subsección</span> */}
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
              margin: '10px 0',
            }}>
              {employees.length === 0 ? (
                <p>{t("Mensaje")}</p>
              ) : (
                employees.map((employee) => (
                  <Card
                    key={employee.id}
                    style={{
                      margin: '10px',
                      width: '300px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
                      color: darkMode ? '#ffffff' : '#000000',
                    }}
                  >
                    <CardMedia
                      component="img"
                      style={{ height: '150px' }}
                      image={employee.photo || 'https://via.placeholder.com/150'}
                      alt={employee.name}
                    />
                    <CardContent>
                      <Typography variant="h6">{employee.name}</Typography>
                      {/* <Typography variant="body2" color="text.secondary">
                        Edad: {employee.age}
                      </Typography> */}
                      <Typography variant="body2" color="text.secondary">
                        {employee.email}
                      </Typography>
                      <Button
                        onClick={handleOpenModal}
                        color="error"
                        variant="contained"
                        style={{ marginTop: '10px' }}
                      >
                       {t("Unsubscribe")}
                    </Button>
                    </CardContent>

                    <Dialog open={openModal} onClose={handleCloseModal}>
                      <DialogTitle>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Typography variant="h6" style={{ fontWeight: "bold" }}>
                          {t("ConfirmDeletion")}
                          </Typography>
                        </div>
                      </DialogTitle>
                      <DialogContent>
                        <Typography>
                        {t("AlertMessage")}
                        </Typography>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseModal} color="primary" variant="outlined">
                        {t("Cancel")}
                        </Button>
                        <Button
                          onClick={() => handleDelete(employee.id)}
                          color="error"
                          variant="contained"
                          style={{ color: "white" }}
                        >
                          {t("Eliminate")}
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Card>                  
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpleadosPage;
