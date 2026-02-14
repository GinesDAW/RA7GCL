document.addEventListener('DOMContentLoaded', () => {

    //EJERCICIO 1: USUARIOS
    const inputBuscador = document.getElementById('buscadorNombre'); //input para escribir el nombre en el buscador
    const tablaContainer = document.getElementById('tabla-usuarios-container'); //div para crear la tabla despues
    let todosLosUsuarios = []; //array para guardar los usuarios 

    function crearTablaUsuarios(usuarios) {
        if (!usuarios || usuarios.length === 0) {
            tablaContainer.innerHTML = '<p class="error">No se encontraron usuarios</p>'; //error si no se encuentran usuairos
            return;
        }

        let tablaHTML = ` 
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Calle</th>
                        <th>Ciudad</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        usuarios.forEach(usuario => { //recorremos cada usuario con el foreach, añadiendo una fila por usuario
            tablaHTML += `
                <tr>
                    <td>${usuario.name}</td>
                    <td>${usuario.address.street}</td>
                    <td>${usuario.address.city}</td>
                </tr>
            `;
        });
        
        tablaHTML += '</tbody></table>';
        tablaContainer.innerHTML = tablaHTML; //insertamos la tabla en el DOM 
    }

    function filtrarUsuarios(texto) {
        if (!texto) {
            crearTablaUsuarios(todosLosUsuarios);
        } else {
            const filtrados = todosLosUsuarios.filter(usuario =>
                usuario.name.toLowerCase().includes(texto.toLowerCase())
            );
            crearTablaUsuarios(filtrados);
        }
    }

    //Cargar usuarios
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json()) //convertimos la respuesta a json
        .then(usuarios => {
            todosLosUsuarios = usuarios;
            crearTablaUsuarios(usuarios);
        })
        .catch(error => {
            console.error('Error:', error);
            tablaContainer.innerHTML = '<p class="error">Error al cargar usuarios</p>';
        });

    inputBuscador.addEventListener('input', (e) => { //cuando se escribe cualquier cosa, tecla a tecla, se dispara el evento y nos va mostrando resultados coincidentes
        filtrarUsuarios(e.target.value);
    });

    //EJERCICIO 2: BICICLETAS
    const selectCategoria = document.getElementById('categoria'); //elegir categoría
    const bicicletasContainer = document.getElementById('bicicletas-container'); //div para las cards de las bicis

    //Función para obtener imagen de Unsplash por categoría
    function getImagenFallbackPorCategoria(categoria) {
        const imagenes = {
            'carretera': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop',
            'gravel': 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400&h=300&fit=crop',
            'mtb': 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=400&h=300&fit=crop',
            'default': 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&h=300&fit=crop'
        };
        
        const catLower = categoria.toLowerCase();
        return imagenes[catLower] || imagenes['default'];
    }

    // Función para pintar bicicletas con los campos de la api
    function pintarBicicletas(bicicletas) {
        if (!bicicletas || bicicletas.length === 0) {
            bicicletasContainer.innerHTML = '<p class="error">No hay bicicletas disponibles</p>';
            return;
        }

        let html = '';
        bicicletas.forEach(bici => {
            //campos de la api
            const codigo = bici.cod || 'N/A';
            const nombre = bici.nom || 'Bicicleta sin nombre';
            const descripcion = bici.des || '';
            const categoria = bici.cat || 'Sin categoría';
            
            //Precio
            const precios = [1200, 1800, 2200, 2800, 3500, 4200];
            const precio = precios[Math.floor(Math.random() * precios.length)];
            
           
            // URL de la imagen por codigo de artículo
            const imagenProfesor = `http://api.raulserranoweb.es/imagenes_art/${codigo}`;
            
            //Imagen de fallback por categoría
            const imagenFallback = getImagenFallbackPorCategoria(categoria);

            html += `
                <div class="bici-card">
                    <div class="bici-img-container">
                        <img src="${imagenProfesor}" 
                             alt="${nombre}" 
                             class="bici-img"
                             loading="lazy"
                             onerror="this.onerror=null; this.src='${imagenFallback}';">
                    </div>
                    <div class="bici-info">
                        <h3>${nombre}</h3>
                        <p><span class="etiqueta">Categoría:</span> ${categoria}</p>
                        <p><span class="etiqueta">Descripción:</span> ${descripcion}</p>
                        <p class="bici-precio"><span class="etiqueta">Precio:</span> ${precio} €</p>
                        <p class="bici-codigo">Código: ${codigo}</p>
                    </div>
                </div>
            `;
        });
        
        bicicletasContainer.innerHTML = html;
    }

    function cargarBicicletas(categoria = 'todas') {
        bicicletasContainer.innerHTML = '<p class="cargando">Cargando bicicletas desde la API...</p>';

        //Usamos el proxy para evitar CORS
        let url = 'proxy.php';
        if (categoria !== 'todas') {
            url += `?cat=${encodeURIComponent(categoria)}`;
        }

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Datos recibidos de la API:', data);
                
                const bicicletas = Array.isArray(data) ? data : [];
                
                if (bicicletas.length === 0) {
                    bicicletasContainer.innerHTML = '<p class="error">No hay bicicletas en esta categoría</p>';
                    return;
                }
                
                pintarBicicletas(bicicletas);
            })
            .catch(error => {
                console.error('Error:', error);
                bicicletasContainer.innerHTML = `
                    <div class="error">
                        <p><strong>Error al cargar bicicletas:</strong></p>
                        <p>${error.message}</p>
                        <p style="margin-top: 15px;">Comprueba que el proxy.php funciona correctamente.</p>
                    </div>
                `;
            });
    }

    // Cargar bicicletas al inicio
    cargarBicicletas('todas');

    selectCategoria.addEventListener('change', (e) => {
        cargarBicicletas(e.target.value);
    });

});