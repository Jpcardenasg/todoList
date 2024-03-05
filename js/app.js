const newTask = document.querySelector( '#new-task' );
const startDate = document.querySelector( '#start-date' );
const endDate = document.querySelector( '#end-date' );
const description = document.querySelector( '#description' );
const priority = document.querySelector( '#priority' );
const submitBtn = document.querySelector( '#submit-btn' );
const pendingList = document.querySelector( '#pending-list' );
const completedList = document.querySelector( '#completed-list' );
const failedList = document.querySelector( '#failed-list' );


submitBtn.addEventListener( 'click', addTask );

function addTask( event ) {
    event.preventDefault();

    const taskDiv = document.createElement( 'div' );
    taskDiv.classList.add( 'task' );

    const taskItem = document.createElement( 'li' );
    taskItem.innerHTML = `
    <p class="task-name">${newTask.value} - Priority: ${priority.value}</p>
    <p class="description">${description.value}</p>
    `;

    const completeButton = document.createElement( 'button' );
    completeButton.classList.add( 'complete-button' );
    completeButton.innerHTML = '<i class="fas fa-check"></i>';
    completeButton.addEventListener( 'click', moveTask );

    const failButton = document.createElement( 'button' );
    failButton.classList.add( 'fail-button' );
    failButton.innerHTML = '<i class="fas fa-trash"></i>';
    failButton.addEventListener( 'click', moveTask );

    taskDiv.appendChild( taskItem );
    taskDiv.appendChild( completeButton );
    taskDiv.appendChild( failButton );
    pendingList.appendChild( taskDiv );


    const taskDetails = {
        name: newTask.value,
        startDate: startDate.value,
        endDate: endDate.value,
        description: description.value,
        priority: priority.value
    };


    saveTask( taskDetails );
    saveTaskToFirebase( taskDetails );


    newTask.value = '';
    startDate.value = '';
    endDate.value = '';
    description.value = '';
    priority.value = 'urgent';

}

function saveTask( taskDetails ) {
    let tasks = JSON.parse( localStorage.getItem( 'tasks' ) ) || [];

    tasks.push( taskDetails );

    localStorage.setItem( 'tasks', JSON.stringify( tasks ) );
}


function moveTask( event ) {
    const taskItem = event.target.parentElement;

    if ( taskItem.parentElement === pendingList ) {
        if ( event.target.classList.contains( 'complete-button' ) ) {
            pendingList.removeChild( taskItem );
            completedList.appendChild( taskItem );
        } else if ( event.target.classList.contains( 'fail-button' ) ) {
            pendingList.removeChild( taskItem );
            failedList.appendChild( taskItem );
        }
    } else if ( taskItem.parentElement === completedList ) {
        if ( event.target.classList.contains( 'complete-button' ) ) {
            completedList.removeChild( taskItem );
        } else if ( event.target.classList.contains( 'fail-button' ) ) {
            completedList.removeChild( taskItem );
            failedList.appendChild( taskItem );
        }
    } else if ( taskItem.parentElement === failedList ) {
        if ( event.target.classList.contains( 'complete-button' ) ) {
            failedList.removeChild( taskItem );
            completedList.appendChild( taskItem );
        } else if ( event.target.classList.contains( 'fail-button' ) ) {
            failedList.removeChild( taskItem );
        }
    }
}

const database = firebase.database();

function saveTaskToFirebase( taskDetails ) {
    // Generar una referencia a una ubicación específica en la base de datos de Firebase
    const newTaskRef = database.ref( 'tasks' ).push();

    // Guardar los detalles de la tarea en la ubicación generada
    newTaskRef.set( taskDetails )
        .then( () => {
            console.log( 'Tarea guardada en Firebase correctamente.' );
        } )
        .catch( ( error ) => {
            console.error( 'Error al guardar la tarea en Firebase:', error );
        } );
}

// Llamada a la función saveTaskToFirebase con los detalles de la tarea
