import { saveTaskToFirebase, getTasksFromFirebase, updateTaskStatusInFirebase } from "../Api/task-api.js";


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

window.addEventListener( 'load', async () => {
    const tasks = await getTasksFromFirebase();
    renderTasks( tasks );
} );

async function addTask( event ) {
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
    completeButton.dataset.id = '';

    const failButton = document.createElement( 'button' );
    failButton.classList.add( 'fail-button' );
    failButton.innerHTML = '<i class="fas fa-trash"></i>';
    failButton.addEventListener( 'click', moveTask );
    failButton.dataset.id = '';

    taskDiv.appendChild( taskItem );
    taskDiv.appendChild( completeButton );
    taskDiv.appendChild( failButton );
    pendingList.appendChild( taskDiv );


    const taskDetails = {
        name: newTask.value,
        startDate: startDate.value,
        endDate: endDate.value,
        description: description.value,
        priority: priority.value,
    };

    const taskId = await saveTaskToFirebase( taskDetails );
    completeButton.dataset.id = taskId;
    failButton.dataset.id = taskId;

    const tasks = await getTasksFromFirebase();
    renderTasks( tasks );


    newTask.value = '';
    startDate.value = '';
    endDate.value = '';
    description.value = '';
    priority.value = 'urgent';

}


function renderTasks( tasks ) {
    pendingList.innerHTML = '';
    completedList.innerHTML = '';
    failedList.innerHTML = '';

    tasks.forEach( task => {
        const taskDiv = document.createElement( 'div' );
        taskDiv.classList.add( 'task' );

        const taskItem = document.createElement( 'li' );
        taskItem.innerHTML = `
            <p class="task-name">${task.name} - Priority: ${task.priority}</p>
            <p class="description">${task.description}</p>
        `;

        const completeButton = document.createElement( 'button' );
        completeButton.classList.add( 'complete-button' );
        completeButton.innerHTML = '<i class="fas fa-check"></i>';
        completeButton.addEventListener( 'click', moveTask );
        completeButton.dataset.id = task.id;

        const failButton = document.createElement( 'button' );
        failButton.classList.add( 'fail-button' );
        failButton.innerHTML = '<i class="fas fa-trash"></i>';
        failButton.addEventListener( 'click', moveTask );
        failButton.dataset.id = task.id;

        taskDiv.appendChild( taskItem );
        taskDiv.appendChild( completeButton );
        taskDiv.appendChild( failButton );


        if ( task.status === 'pending' ) {
            pendingList.appendChild( taskDiv );
        } else if ( task.status === 'completed' ) {
            completedList.appendChild( taskDiv );
        } else if ( task.status === 'failed' ) {
            failedList.appendChild( taskDiv );
        }
    } );
}

async function moveTask( event ) {
    const taskItem = event.target.parentElement;
    const taskId = event.target.dataset.id;

    if ( taskItem.parentElement === pendingList ) {
        if ( event.target.classList.contains( 'complete-button' ) ) {
            pendingList.removeChild( taskItem );
            completedList.appendChild( taskItem );
            await updateTaskStatusInFirebase( taskId, 'completed' );
        } else if ( event.target.classList.contains( 'fail-button' ) ) {
            pendingList.removeChild( taskItem );
            failedList.appendChild( taskItem );
            await updateTaskStatusInFirebase( taskId, 'failed' );
        }
    } else if ( taskItem.parentElement === completedList ) {
        if ( event.target.classList.contains( 'complete-button' ) ) {
            completedList.removeChild( taskItem );
        } else if ( event.target.classList.contains( 'fail-button' ) ) {
            completedList.removeChild( taskItem );
            failedList.appendChild( taskItem );
            await updateTaskStatusInFirebase( taskId, 'failed' );
        }
    } else if ( taskItem.parentElement === failedList ) {
        if ( event.target.classList.contains( 'complete-button' ) ) {
            failedList.removeChild( taskItem );
            completedList.appendChild( taskItem );
            await updateTaskStatusInFirebase( taskId, 'completed' );
        } else if ( event.target.classList.contains( 'fail-button' ) ) {
            failedList.removeChild( taskItem );
        }
    }
}


