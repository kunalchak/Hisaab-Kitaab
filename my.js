
// Get a reference to the Firebase Realtime Database
const database = firebase.database();

// Function to handle form submission
const handleSubmit = (event) => {
  event.preventDefault(); // Prevent form submission

  // Get the form inputs
  const firstName = document.getElementById('Fname').value;
  const lastName = document.getElementById('Lname').value;
  const usn = document.getElementById('usn').value;
  const amt = document.getElementById('amt').value;
  

  // Create a new student object
  const student = {
    firstName,
    lastName,
    usn,
    amt
  };

  // Save the student data to Firebase
  saveStudentData(student);

  // Clear the form inputs
  document.getElementById('Fname').value = '';
  document.getElementById('Lname').value = '';
  document.getElementById('usn').value = '';
  document.getElementById('amt').value = '';
};

// Function to save the student data to Firebase
const saveStudentData = (student) => {
  // Generate a unique key for the student
  const studentKey = database.ref().child('students').push().key;

  // Create the data to be saved
  const updates = {};
  updates[`/students/${studentKey}`] = student;

  // Save the data to Firebase
  return database.ref().update(updates);
};

// Function to delete a student
const deleteStudent = (studentKey) => {
  // Remove the student from Firebase
  return database.ref(`/students/${studentKey}`).remove();
};

// Function to update a student
const updateStudent = (studentKey, updatedStudent) => {
  // Update the student in Firebase
  return database.ref(`/students/${studentKey}`).update(updatedStudent);
};

// Function to load the student data from Firebase
const loadStudentData = () => {
  // Get a reference to the "students" node in the database
  const studentsRef = database.ref('students');

  // Listen for changes to the student data
  studentsRef.on('value', (snapshot) => {
    // Get the updated student data from the snapshot
    const data = snapshot.val();

    // Clear the student list
    const studentList = document.querySelector('.stu-list');
    studentList.innerHTML = '';

    if (data) {
      // Iterate over each student
      Object.entries(data).forEach(([studentKey, student]) => {
        // Create a new row for the student
        const row = document.createElement('tr');

        // Create table data cells for each property
        const firstNameCell = document.createElement('td');
        firstNameCell.textContent = student.firstName;

        const lastNameCell = document.createElement('td');
        lastNameCell.textContent = student.lastName;

        const usnCell = document.createElement('td');
        usnCell.textContent = student.usn;

        const amtCell = document.createElement('td');
        amtCell.textContent = student.amt;

        const actionsCell = document.createElement('td');

        // Create edit button
        const editButton = document.createElement('a');
        editButton.href = '#';
        editButton.className = 'btn btn-warning btn-sm edit';
        editButton.textContent = 'Edit';

        // Add click event listener to edit button
        editButton.addEventListener('click', () => {
          // Populate the form inputs with the student's data
          document.getElementById('Fname').value = student.firstName;
          document.getElementById('Lname').value = student.lastName;
          document.getElementById('usn').value = student.usn;
          document.getElementById('amt').value = student.amt;

          // Save the student key in a data attribute
          document.getElementById('stu-form').setAttribute('data-student-key', studentKey);
        });

        // Create delete button
        const deleteButton = document.createElement('a');
        deleteButton.href = '#';
        deleteButton.className = 'btn btn-danger btn-sm delete';
        deleteButton.textContent = 'Delete';

        // Add click event listener to delete button
        deleteButton.addEventListener('click', () => {
          // Delete the student from Firebase
          deleteStudent(studentKey);
        });

        // Append buttons to actions cell
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);

        // Append cells to the row
        row.appendChild(firstNameCell);
        row.appendChild(lastNameCell);
        row.appendChild(usnCell);
        row.appendChild(amtCell);
        row.appendChild(actionsCell);

        // Append the row to the student list
        studentList.appendChild(row);
      });
    }
  });
};

// Event listener for form submission
document.getElementById('stu-form').addEventListener('submit', handleSubmit);

// Load the student data when the page loads
document.addEventListener('DOMContentLoaded', loadStudentData);

