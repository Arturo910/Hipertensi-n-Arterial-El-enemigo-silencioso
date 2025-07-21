document.addEventListener('DOMContentLoaded', function() {
    // 1. Slider automático (se mantiene igual)
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    let slideInterval;
    
    function startSlider() {
        slideInterval = setInterval(nextSlide, 3000);
    }
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
        sliderContainer.addEventListener('mouseleave', startSlider);
    }
    startSlider();

    // 2. Navegación entre ciudades (se mantiene igual)
    const cityButtons = document.querySelectorAll('.city-btn');
    cityButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            cityButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.transform = '';
                btn.style.boxShadow = '';
            });
            
            this.classList.add('active');
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            
            document.querySelectorAll('.city-content').forEach(content => {
                content.classList.remove('active');
            });
            
            const cityId = this.getAttribute('data-city');
            const activeContent = document.getElementById(cityId);
            activeContent.classList.add('active');
            
            const headerHeight = document.querySelector('.main-header').offsetHeight;
            window.scrollTo({
                top: activeContent.offsetTop - headerHeight,
                behavior: 'smooth'
            });
        });
    });

    // 3. Modificación de formularios de reserva (NUEVO)
    const setupBookingForms = () => {
        const bookingForms = document.querySelectorAll('.booking-form form');
        
        bookingForms.forEach(form => {
            // Agregar campo DNI después del nombre
            const nameField = form.querySelector('input[type="text"]');
            if (nameField && !form.querySelector('input[name="dni"]')) {
                const dniField = document.createElement('div');
                dniField.className = 'form-group';
                dniField.innerHTML = `
                    <input type="text" name="dni" placeholder="DNI" required 
                           pattern="[0-9]{8}" title="Ingrese 8 dígitos numéricos">
                `;
                nameField.parentNode.insertAdjacentElement('afterend', dniField);
            }

            // Mejorar selector de tours según la región
            const select = form.querySelector('select');
            if (select) {
                const city = form.closest('.city-content').id;
                let options = '<option value="">Seleccione un tour o viaje</option>';
                
                // Opciones específicas por región
                switch(city) {
                    case 'cusco':
                        options += `
                            <option value="machu-picchu">Viaje a Machu Picchu</option>
                            <option value="valle-sagrado">Tour Valle Sagrado</option>
                            <option value="montaña-colores">Montaña de 7 Colores</option>
                            <option value="city-tour">City Tour Cusco</option>
                            <option value="tour-gastronomico">Tour Gastronómico</option>
                        `;
                        break;
                    case 'arequipa':
                        options += `
                            <option value="cañon-colca">Viaje al Cañón del Colca</option>
                            <option value="city-tour">City Tour Arequipa</option>
                            <option value="sillar">Ruta del Sillar</option>
                            <option value="volcan-misti">Tour al Volcán Misti</option>
                        `;
                        break;
                    case 'ica':
                        options += `
                            <option value="huacachina">Viaje a Huacachina</option>
                            <option value="lineas-nazca">Líneas de Nazca</option>
                            <option value="paracas">Reserva de Paracas</option>
                            <option value="bodegas-vino">Tour de Bodegas</option>
                        `;
                        break;
                    case 'puno':
                        options += `
                            <option value="titicaca">Viaje al Lago Titicaca</option>
                            <option value="islas-uros">Islas Flotantes Uros</option>
                            <option value="taquile">Isla de Taquile</option>
                            <option value="sillustani">Chullpas de Sillustani</option>
                        `;
                        break;
                }
                
                // Opciones comunes a todas las regiones
                options += `
                    <option value="tour-privado">Tour Privado Personalizado</option>
                    <option value="paquete-completo">Paquete Completo</option>
                `;
                
                select.innerHTML = options;
            }

            // Manejo del envío del formulario (actualizado)
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                const currentCity = this.closest('.city-content')
                                      .querySelector('.destination-title').textContent;
                
                // Datos actualizados con DNI
                const confirmationMessage = `
                    ¡Reserva recibida para ${currentCity}!
                    ----------------------------
                    Nombre: ${formData.get('name') || 'No proporcionado'}
                    DNI: ${formData.get('dni') || 'No proporcionado'}
                    Email: ${formData.get('email') || 'No proporcionado'}
                    Tour/Viaje: ${formData.get('tour') || 'No seleccionado'}
                    Fecha: ${formData.get('date') || 'No especificada'}
                    
                    Nos pondremos en contacto para confirmar los detalles.
                `;
                
                alert(confirmationMessage);
                this.reset();
                
                // Animación de confirmación
                const submitBtn = this.querySelector('.submit-btn');
                submitBtn.textContent = '¡Reservado!';
                submitBtn.style.backgroundColor = '#2ecc71';
                
                setTimeout(() => {
                    submitBtn.textContent = 'Reservar Ahora';
                    submitBtn.style.backgroundColor = '#e74c3c';
                }, 2000);
            });
        });
    };

    // Inicializar formularios
    setupBookingForms();

    // 4. Efecto hover en imágenes de la galería (se mantiene igual)
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.image-caption');
            
            img.style.transform = 'scale(1.1)';
            caption.style.paddingBottom = '25px';
        });
        
        item.addEventListener('mouseleave', () => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.image-caption');
            
            img.style.transform = 'scale(1)';
            caption.style.paddingBottom = '20px';
        });
    });

    // 5. Validación de formularios (actualizada para DNI)
    const formInputs = document.querySelectorAll('.booking-form input, .booking-form select');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.name === 'dni') {
                this.value = this.value.replace(/\D/g, ''); // Solo permite números
                if (this.value.length > 8) {
                    this.value = this.value.slice(0, 8);
                }
            }
            
            if (this.checkValidity()) {
                this.style.borderColor = '#2ecc71';
            } else {
                this.style.borderColor = '#e74c3c';
            }
        });
    });
});