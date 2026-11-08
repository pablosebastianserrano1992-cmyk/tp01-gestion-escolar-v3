// ==========================================
// REGISTRO DE IA Y CONFIGURACIÓN INICIAL
// ==========================================

// Credenciales ficticias de acceso
const USUARIO_VALIDO = "admin";
const CLAVE_VALIDA = "1234";

let cursos = [
    { anio: 3, division: "1°", turno: "Mañana", especialidad: "Informática" },
    { anio: 4, division: "2°", turno: "Tarde", especialidad: "Electromecánica" }
];

let alumnos = [
    { legajo: "ALB-101", nombre: "Sofía", apellido: "Martínez", fechaNacimiento: "2010-05-12", curso: "3° 1° · Mañana" }
];

let docentes = [
    { legajo: "DOC-01", nombre: "Carlos", apellido: "Pérez", email: "carlos.perez@escuela.edu.ar" }
];

let asignaciones = [
    { docente: "DOC-01", curso: "3° 1° · Mañana", materia: "Programación I", horasSemanales: 4 }
];

let cursoEditandoIndice = null;
let alumnoEditandoIndice = null;
let docenteEditandoIndice = null;
let asignacionEditandoIndice = null;

// ==========================================
// FUNCIONES DE CONTROL DE AUTENTICACIÓN
// ==========================================

function verificarSesion() {
    let sesionIniciada = localStorage.getItem("sesionIniciada");
    let pantallaLogin = document.getElementById("pantalla-login");
    let contenedorSistema = document.getElementById("contenedor-sistema");

    if (sesionIniciada === "true") {
        pantallaLogin.style.display = "none";
        contenedorSistema.style.display = "block";
    } else {
        pantallaLogin.style.display = "flex";
        contenedorSistema.style.display = "none";
    }
}

function iniciarSesion(usuario, clave) {
    let mensajeError = document.getElementById("mensaje-error-login");
    
    if (usuario === USUARIO_VALIDO && clave === CLAVE_VALIDA) {
        localStorage.setItem("sesionIniciada", "true");
        if (mensajeError) mensajeError.style.display = "none";
        verificarSesion();
    } else {
        if (mensajeError) mensajeError.style.display = "block";
    }
}

function cerrarSesion() {
    localStorage.removeItem("sesionIniciada");
    verificarSesion();
}

// ==========================================
// FUNCIONES GENERALES Y LOCALSTORAGE
// ==========================================

function guardarDatos() {
    let datosEscuela = {
        cursos: cursos,
        alumnos: alumnos,
        docentes: docentes,
        asignaciones: asignaciones
    };
    localStorage.setItem("escuela-datos", JSON.stringify(datosEscuela));
    actualizarContadores();
}

function cargarDatos() {
    let datosGuardados = localStorage.getItem("escuela-datos");
    if (datosGuardados) {
        let datosEscuela = JSON.parse(datosGuardados);
        cursos = datosEscuela.cursos || [];
        alumnos = datosEscuela.alumnos || [];
        docentes = datosEscuela.docentes || [];
        asignaciones = datosEscuela.asignaciones || [];
    } else {
        guardarDatos();
    }
}

function mostrarSeccion(idSeccion) {
    let secciones = document.querySelectorAll("main section");
    secciones.forEach(function(seccion) {
        seccion.style.display = "none";
    });
    let seccionActiva = document.getElementById(idSeccion);
    if (seccionActiva) {
        seccionActiva.style.display = "flex";
    }
}

function actualizarContadores() {
    document.getElementById("contador-cursos").textContent = cursos.length;
    document.getElementById("contador-alumnos").textContent = alumnos.length;
    document.getElementById("contador-docentes").textContent = docentes.length;
    document.getElementById("contador-asignaciones").textContent = asignaciones.length;
}

function nombreCurso(cursoOIndice) {
    let curso = typeof cursoOIndice === 'number' ? cursos[cursoOIndice] : cursoOIndice;
    if (!curso) return "";
    return curso.anio + "° " + curso.division + " · " + curso.turno;
}

function cargarSelectoresDinamicos() {
    let selectCursoAlumno = document.getElementById('alumno-curso');
    if (selectCursoAlumno) {
        selectCursoAlumno.innerHTML = '<option value="">Seleccione un curso</option>';
        cursos.forEach(function(curso, indice) {
            let opcion = document.createElement('option');
            let texto = nombreCurso(indice);
            opcion.value = texto;
            opcion.textContent = texto;
            selectCursoAlumno.appendChild(opcion);
        });
    }

    let selectDocenteAsig = document.getElementById('asignacion-docente');
    let selectCursoAsig = document.getElementById('asignacion-curso');
    
    if (selectDocenteAsig) {
        selectDocenteAsig.innerHTML = '<option value="">Seleccione docente</option>';
        docentes.forEach(function(docente) {
            let op = document.createElement('option');
            op.value = docente.legajo;
            op.textContent = docente.apellido + ", " + docente.nombre;
            selectDocenteAsig.appendChild(op);
        });
    }

    if (selectCursoAsig) {
        selectCursoAsig.innerHTML = '<option value="">Seleccione curso</option>';
        cursos.forEach(function(curso, indice) {
            let op = document.createElement('option');
            let texto = nombreCurso(indice);
            op.value = texto;
            op.textContent = texto;
            selectCursoAsig.appendChild(op);
        });
    }
}

// ==========================================
// GESTIÓN DE CURSOS
// ==========================================
function mostrarListaCursos() {
    let contenedor = document.getElementById('lista-cursos');
    if (!contenedor) return;
    contenedor.innerHTML = cursos.length === 0 ? "<p>No hay cursos registrados.</p>" : "";

    cursos.forEach(function(curso, indice) {
        let tarjeta = document.createElement('div');
        tarjeta.className = "elemento-lista";
        tarjeta.innerHTML = `
            <div><strong>${nombreCurso(indice)}</strong><br><small>Especialidad: ${curso.especialidad}</small></div>
            <div>
                <button onclick="prepararEdicionCurso(${indice})">✏️</button>
                <button onclick="eliminarCurso(${indice})">🗑️</button>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });
}

function prepararEdicionCurso(indice) {
    let curso = cursos[indice];
    document.getElementById('curso-anio').value = curso.anio;
    document.getElementById('curso-division').value = curso.division;
    document.getElementById('curso-turno').value = curso.turno;
    document.getElementById('curso-especialidad').value = curso.especialidad;
    cursoEditandoIndice = indice;
    document.querySelector('#formulario-curso button[type="submit"]').textContent = "Actualizar Curso";
}

function eliminarCurso(indice) {
    let curso = cursos[indice];
    let nombreTxt = nombreCurso(indice);
    let tieneAlumnos = alumnos.some(a => a.curso === nombreTxt);
    let tieneAsignaciones = asignaciones.some(asig => asig.curso === nombreTxt);

    if (tieneAlumnos || tieneAsignaciones) {
        alert("No se puede eliminar el curso porque tiene alumnos o asignaciones asociadas.");
        return;
    }

    if (confirm("¿Eliminar curso " + nombreTxt + "?")) {
        cursos.splice(indice, 1);
        guardarDatos();
        mostrarListaCursos();
        cargarSelectoresDinamicos();
    }
}

// ==========================================
// GESTIÓN DE ALUMNOS
// ==========================================
function mostrarListaAlumnos() {
    let contenedor = document.getElementById('lista-alumnos');
    if (!contenedor) return;
    contenedor.innerHTML = alumnos.length === 0 ? "<p>No hay alumnos registrados.</p>" : "";

    alumnos.forEach(function(alumno, indice) {
        let tarjeta = document.createElement('div');
        tarjeta.className = "elemento-lista";
        tarjeta.innerHTML = `
            <div><strong>${alumno.apellido}, ${alumno.nombre}</strong> (Legajo: ${alumno.legajo})<br><small>Curso: ${alumno.curso}</small></div>
            <div>
                <button onclick="prepararEdicionAlumno(${indice})">✏️</button>
                <button onclick="eliminarAlumno(${indice})">🗑️</button>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });
}

function prepararEdicionAlumno(indice) {
    let alumno = alumnos[indice];
    document.getElementById('alumno-legajo').value = alumno.legajo;
    document.getElementById('alumno-nombre').value = alumno.nombre;
    document.getElementById('alumno-apellido').value = alumno.apellido;
    document.getElementById('alumno-fecha-nacimiento').value = alumno.fechaNacimiento;
    document.getElementById('alumno-curso').value = alumno.curso;
    alumnoEditandoIndice = indice;
    document.querySelector('#formulario-alumno button[type="submit"]').textContent = "Actualizar Alumno";
}

function eliminarAlumno(indice) {
    if (confirm("¿Seguro que deseas eliminar este alumno?")) {
        alumnos.splice(indice, 1);
        guardarDatos();
        mostrarListaAlumnos();
    }
}

// ==========================================
// GESTIÓN DE DOCENTES
// ==========================================
function mostrarListaDocentes() {
    let contenedor = document.getElementById('lista-docentes');
    if (!contenedor) return;
    contenedor.innerHTML = docentes.length === 0 ? "<p>No hay docentes registrados.</p>" : "";

    docentes.forEach(function(docente, indice) {
        let tarjeta = document.createElement('div');
        tarjeta.className = "elemento-lista";
        tarjeta.innerHTML = `
            <div><strong>${docente.apellido}, ${docente.nombre}</strong> (${docente.legajo})<br><small>${docente.email}</small></div>
            <div>
                <button onclick="prepararEdicionDocente(${indice})">✏️</button>
                <button onclick="eliminarDocente(${indice})">🗑️</button>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });
}

function prepararEdicionDocente(indice) {
    let docente = docentes[indice];
    document.getElementById('docente-legajo').value = docente.legajo;
    document.getElementById('docente-nombre').value = docente.nombre;
    document.getElementById('docente-apellido').value = docente.apellido;
    document.getElementById('docente-email').value = docente.email;
    docenteEditandoIndice = indice;
    document.querySelector('#formulario-docente button[type="submit"]').textContent = "Actualizar Docente";
}

function eliminarDocente(indice) {
    let docente = docentes[indice];
    let tieneAsignaciones = asignaciones.some(asig => asig.docente === docente.legajo);
    if (tieneAsignaciones) {
        alert("No se puede eliminar el docente porque tiene asignaciones activas.");
        return;
    }
    if (confirm("¿Eliminar docente?")) {
        docentes.splice(indice, 1);
        guardarDatos();
        mostrarListaDocentes();
        cargarSelectoresDinamicos();
    }
}

// ==========================================
// GESTIÓN DE ASIGNACIONES
// ==========================================
function mostrarListaAsignaciones() {
    let contenedor = document.getElementById('lista-asignaciones');
    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (asignaciones.length === 0) {
        contenedor.innerHTML = "<p>No hay asignaciones registradas.</p>";
        return;
    }

    asignaciones.forEach(function(asignacion, indice) {
        let docenteObj = docentes.find(function(d) {
            return d.legajo === asignacion.docente;
        });
        let nombreDocenteTexto = docenteObj ? docenteObj.apellido + ", " + docenteObj.nombre : asignacion.docente;

        let tarjeta = document.createElement('div');
        tarjeta.className = "elemento-lista";
        
        tarjeta.innerHTML = `
            <div>
                <strong>${asignacion.materia}</strong> (${asignacion.horasSemanales} hs)<br>
                <small>Docente: ${nombreDocenteTexto} | Curso: ${asignacion.curso}</small>
            </div>
            <div>
                <button onclick="prepararEdicionAsignacion(${indice})">✏️</button>
                <button onclick="eliminarAsignacion(${indice})">🗑️</button>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });
}

function prepararEdicionAsignacion(indice) {
    let asignacion = asignaciones[indice];
    document.getElementById('asignacion-docente').value = asignacion.docente;
    document.getElementById('asignacion-curso').value = asignacion.curso;
    document.getElementById('asignacion-materia').value = asignacion.materia;
    document.getElementById('asignacion-horas').value = asignacion.horasSemanales;

    asignacionEditandoIndice = indice;
    let botonSubmit = document.querySelector('#formulario-asignacion button[type="submit"]');
    if (botonSubmit) {
        botonSubmit.textContent = "Actualizar Asignación";
    }
    document.getElementById('formulario-asignacion').scrollIntoView({ behavior: 'smooth' });
}

function eliminarAsignacion(indice) {
    if (confirm("¿Estás seguro de que querés eliminar esta asignación de materia?")) {
        asignaciones.splice(indice, 1);
        guardarDatos();
        mostrarListaAsignaciones();
    }
}

// ==========================================
// EVENT LISTENERS E INICIALIZACIÓN
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    verificarSesion();
    cargarDatos();
    mostrarSeccion("seccion-inicio");
    mostrarListaCursos();
    mostrarListaAlumnos();
    mostrarListaDocentes();
    mostrarListaAsignaciones();
    cargarSelectoresDinamicos();
    actualizarContadores();

    // Evento de Login
    let formularioLogin = document.getElementById("formulario-login");
    if (formularioLogin) {
        formularioLogin.addEventListener("submit", function(e) {
            e.preventDefault();
            let us = document.getElementById("login-usuario").value.trim();
            let cl = document.getElementById("login-clave").value.trim();
            iniciarSesion(us, cl);
        });
    }

    // Cerrar sesión
    let btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", cerrarSesion);
    }

    // Navegación
    document.getElementById("btn-menu-inicio").addEventListener("click", () => mostrarSeccion("seccion-inicio"));
    document.getElementById("btn-menu-cursos").addEventListener("click", () => mostrarSeccion("seccion-cursos"));
    document.getElementById("btn-menu-alumnos").addEventListener("click", () => mostrarSeccion("seccion-alumnos"));
    document.getElementById("btn-menu-docentes").addEventListener("click", () => mostrarSeccion("seccion-docentes"));
    document.getElementById("btn-menu-asignaciones").addEventListener("click", () => mostrarSeccion("seccion-asignaciones"));

    // Formulario Cursos
    document.getElementById('formulario-curso').addEventListener('submit', function(e) {
        e.preventDefault();
        let anio = document.getElementById('curso-anio').value.trim();
        let division = document.getElementById('curso-division').value.trim();
        let turno = document.getElementById('curso-turno').value;
        let especialidad = document.getElementById('curso-especialidad').value.trim();

        let duplicado = cursos.some((c, idx) => cursoEditandoIndice !== idx && c.anio == anio && c.division.toLowerCase() === division.toLowerCase() && c.turno === turno);
        if (duplicado) {
            alert("Ya existe un curso con el mismo año, división y turno.");
            return;
        }

        let obj = { anio: Number(anio), division, turno, especialidad };
        if (cursoEditandoIndice === null) {
            cursos.push(obj);
        } else {
            cursos[cursoEditandoIndice] = obj;
            cursoEditandoIndice = null;
            this.querySelector('button[type="submit"]').textContent = "Guardar Curso";
        }
        guardarDatos();
        this.reset();
        mostrarListaCursos();
        cargarSelectoresDinamicos();
    });

    // Formulario Alumnos
    document.getElementById('formulario-alumno').addEventListener('submit', function(e) {
        e.preventDefault();
        let legajo = document.getElementById('alumno-legajo').value.trim();
        let nombre = document.getElementById('alumno-nombre').value.trim();
        let apellido = document.getElementById('alumno-apellido').value.trim();
        let fechaNacimiento = document.getElementById('alumno-fecha-nacimiento').value;
        let curso = document.getElementById('alumno-curso').value;

        if (new Date(fechaNacimiento) > new Date()) {
            alert("La fecha de nacimiento no puede ser futura.");
            return;
        }

        let duplicado = alumnos.some((a, idx) => alumnoEditandoIndice !== idx && a.legajo.toLowerCase() === legajo.toLowerCase());
        if (duplicado) {
            alert("Ya existe un alumno con ese legajo.");
            return;
        }

        let obj = { legajo, nombre, apellido, fechaNacimiento, curso };
        if (alumnoEditandoIndice === null) {
            alumnos.push(obj);
        } else {
            alumnos[alumnoEditandoIndice] = obj;
            alumnoEditandoIndice = null;
            this.querySelector('button[type="submit"]').textContent = "Guardar Alumno";
        }
        guardarDatos();
        this.reset();
        mostrarListaAlumnos();
    });

    // Formulario Docentes
    document.getElementById('formulario-docente').addEventListener('submit', function(e) {
        e.preventDefault();
        let legajo = document.getElementById('docente-legajo').value.trim();
        let nombre = document.getElementById('docente-nombre').value.trim();
        let apellido = document.getElementById('docente-apellido').value.trim();
        let email = document.getElementById('docente-email').value.trim();

        let duplicado = docentes.some((d, idx) => docenteEditandoIndice !== idx && d.legajo.toLowerCase() === legajo.toLowerCase());
        if (duplicado) {
            alert("Ya existe un docente con ese legajo.");
            return;
        }

        let obj = { legajo, nombre, apellido, email };
        if (docenteEditandoIndice === null) {
            docentes.push(obj);
        } else {
            docentes[docenteEditandoIndice] = obj;
            docenteEditandoIndice = null;
            this.querySelector('button[type="submit"]').textContent = "Guardar Docente";
        }
        guardarDatos();
        this.reset();
        mostrarListaDocentes();
        cargarSelectoresDinamicos();
    });

    // Formulario Asignaciones
    document.getElementById('formulario-asignacion').addEventListener('submit', function(e) {
        e.preventDefault();
        let docenteLegajo = document.getElementById('asignacion-docente').value;
        let cursoNombre = document.getElementById('asignacion-curso').value;
        let materiaIngresada = document.getElementById('asignacion-materia').value.trim();
        let horasIngresadas = document.getElementById('asignacion-horas').value.trim();

        if (!docenteLegajo || !cursoNombre || !materiaIngresada || !horasIngresadas) {
            alert("Por favor, completá todos los campos de la asignación.");
            return;
        }

        let nuevaAsignacionObj = {
            docente: docenteLegajo,
            curso: cursoNombre,
            materia: materiaIngresada,
            horasSemanales: Number(horasIngresadas)
        };

        if (asignacionEditandoIndice === null) {
            asignaciones.push(nuevaAsignacionObj);
        } else {
            asignaciones[asignacionEditandoIndice] = nuevaAsignacionObj;
            asignacionEditandoIndice = null;
            this.querySelector('button[type="submit"]').textContent = "Guardar Asignación";
        }

        guardarDatos();
        this.reset();
        mostrarListaAsignaciones();
    });

    // Exportar Datos
    document.getElementById('btn-exportar').addEventListener('click', function() {
        let datos = localStorage.getItem('escuela-datos');
        let blob = new Blob([datos], { type: 'application/json' });
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = 'escuela.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Importar Datos
    document.getElementById('archivo-importar').addEventListener('change', function(evento) {
        let archivo = evento.target.files[0];
        if (!archivo) return;
        let lector = new FileReader();
        lector.onload = function(e) {
            try {
                let json = JSON.parse(e.target.result);
                if (json.cursos && json.alumnos && json.docentes) {
                    localStorage.setItem('escuela-datos', JSON.stringify(json));
                    cargarDatos();
                    mostrarListaCursos();
                    mostrarListaAlumnos();
                    mostrarListaDocentes();
                    mostrarListaAsignaciones();
                    cargarSelectoresDinamicos();
                    actualizarContadores();
                    alert("Datos importados con éxito.");
                } else {
                    alert("El archivo no tiene el formato válido.");
                }
            } catch (err) {
                alert("Error al procesar el archivo JSON.");
            }
        };
        lector.readAsText(archivo);
    });
});