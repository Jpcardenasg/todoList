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
    taskItem.textContent = `${newTask.value} - ${description.value} - Priority: ${priority.value}`;

    const completeButton = document.createElement( 'button' );
    completeButton.innerHTML = '<i class="fas fa-check"></i>';
    completeButton.addEventListener( 'click', moveTaskToCompleted );

    const failButton = document.createElement( 'button' );
    failButton.innerHTML = '<i class="fas fa-trash"></i>';
    failButton.addEventListener( 'click', moveTaskToFailed );

    taskDiv.appendChild( taskItem );
    taskDiv.appendChild( completeButton );
    taskDiv.appendChild( failButton );

    pendingList.appendChild( taskDiv );

    newTask.value = '';
    startDate.value = '';
    endDate.value = '';
    description.value = '';
    priority.value = 'urgent';
}

function moveTaskToCompleted( event ) {
    const taskItem = event.target.parentElement;
    completedList.appendChild( taskItem );
}

function moveTaskToFailed( event ) {
    const taskItem = event.target.parentElement;
    failedList.appendChild( taskItem );
}
