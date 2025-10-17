document.addEventListener('DOMContentLoaded', () => {
    // DOM element references
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Array to store tasks. Each task is an object: { id: number, text: string, completed: boolean }
    let tasks = [];

    // Function to load tasks from localStorage
    const loadTasks = () => {
        const storedTasks = localStorage.getItem('todoTasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
        }
        renderTasks(); // Render tasks after loading
    };

    // Function to save tasks to localStorage
    const saveTasks = () => {
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
    };

    // Function to render all tasks to the DOM
    const renderTasks = () => {
        taskList.innerHTML = ''; // Clear current list

        tasks.forEach(task => {
            // Create list item for each task
            const listItem = document.createElement('li');
            listItem.className = `list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'completed-task' : ''}`;
            listItem.dataset.taskId = task.id; // Store task ID for easy reference

            // Create a div for the checkbox and task text
            const taskContent = document.createElement('div');
            taskContent.className = 'form-check d-flex align-items-center';

            // Completion toggle (checkbox)
            const completeCheckbox = document.createElement('input');
            completeCheckbox.type = 'checkbox';
            completeCheckbox.className = 'form-check-input me-2';
            completeCheckbox.id = `complete-task-${task.id}`;
            completeCheckbox.checked = task.completed;
            completeCheckbox.setAttribute('aria-label', `Mark task '${task.text}' as complete`);

            // Task text label
            const taskTextLabel = document.createElement('label');
            taskTextLabel.className = 'form-check-label';
            taskTextLabel.htmlFor = `complete-task-${task.id}`;
            taskTextLabel.textContent = task.text;

            taskContent.appendChild(completeCheckbox);
            taskContent.appendChild(taskTextLabel);

            listItem.appendChild(taskContent);

            // Create a div for action buttons
            const taskActions = document.createElement('div');
            taskActions.className = 'task-actions';

            // Delete button
            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-outline-danger btn-sm';
            deleteButton.innerHTML = '&times;'; // HTML entity for multiplication sign (X)
            deleteButton.id = 'delete-task';
            deleteButton.setAttribute('aria-label', `Delete task '${task.text}'`);

            taskActions.appendChild(deleteButton);
            listItem.appendChild(taskActions);

            taskList.appendChild(listItem);
        });
    };

    // Function to add a new task
    const addTask = () => {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const newTask = {
                id: Date.now(), // Unique ID based on timestamp
                text: taskText,
                completed: false
            };
            tasks.push(newTask);
            saveTasks();
            renderTasks();
            taskInput.value = ''; // Clear input field
        }
    };

    // Function to toggle task completion status
    const toggleCompletion = (taskId) => {
        tasks = tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        saveTasks();
        renderTasks();
    };

    // Function to delete a task
    const deleteTask = (taskId) => {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
    };

    // Event Listener for Add Task button click
    addTaskBtn.addEventListener('click', addTask);

    // Event Listener for Enter key press in the input field
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Event Delegation for dynamically created elements (checkboxes and delete buttons)
    taskList.addEventListener('click', (event) => {
        const target = event.target;
        // Find the parent listItem to get the taskId
        const listItem = target.closest('li.list-group-item');
        if (!listItem) return; // If click wasn't inside a list item, do nothing

        const taskId = parseInt(listItem.dataset.taskId);

        // Handle completion toggle
        if (target.type === 'checkbox' && target.id.startsWith('complete-task-')) {
            toggleCompletion(taskId);
        }

        // Handle delete button click
        if (target.id === 'delete-task') {
            deleteTask(taskId);
        }
    });

    // Initial load of tasks when the page loads
    loadTasks();
});
