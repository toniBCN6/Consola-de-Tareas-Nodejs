const { inquirerMenu, pausa, leerInput, listadoTareasBorrar, confirmar, mostrarListadoChecklist } = require('./helpers/menuinq');
const { guardarDB, leerDB } = require('./helpers/savefile');
// const Tarea = require('./models/tarea');
const Tareas = require('./models/tareas');

require('colors');




const main = async() => {
    let opt = '';
    const tareas = new Tareas();
    const tareasDB = leerDB();

    if (tareasDB) {
      tareas.cargarTareasFromArray(tareasDB)
    }

    do {
      opt = await inquirerMenu();

      switch (opt) {
        case '1': // Crear Tarea
          const desc = await leerInput('Descripción: ');
          tareas.crearTarea( desc );
        break;

        case '2': // Listar Todas
          tareas.listarTareas()
        break;

        case '3': // Listar Completadas
          tareas.listarPendientesCompletadas(true);
        break;

        case '4': // Listar Pendientes
          tareas.listarPendientesCompletadas(false);
        break;

        case '5': // Completado | Pendientes
          const ids = await mostrarListadoChecklist( tareas.listadoArr);
          tareas.toggleCompletadas(ids);
        break;

        case '6': // Borrar
          const id = await listadoTareasBorrar( tareas.listadoArr );
          if ( id !== '0') {
            const ok = await confirmar('Estas seguro de querer borrar esta tarea?');
            if (ok) {
              tareas.borrarTarea(id);
              console.log('Tarea Borrada')
            }
          }
        break;
      }

      guardarDB(tareas.listadoArr);


      if (opt !== '0') await pausa();
    } while (opt !== '0');

}

main();