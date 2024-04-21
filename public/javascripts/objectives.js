document.getElementById('continue').addEventListener('click', function() {
    const selectedCourses = document.querySelectorAll('.course.selected');
    if (selectedCourses.length > 0) {
        const selectedCourseNames = Array.from(selectedCourses).map(course => course.textContent.trim());
        localStorage.setItem('selectedCourses', JSON.stringify(selectedCourseNames));
        
        // Send the selected course names to the server
        fetch('/courseenrollment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ courses: selectedCourseNames })
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '/content';
            } else {
                throw new Error('Failed to send course names to the server.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to send course names to the server. Please try again.');
        });
    } else {
        alert('Please select at least one course.');
    }
});


document.querySelectorAll('.course').forEach(course => {
    course.addEventListener('click', function() {
        const isSelected = this.classList.contains('selected');
        const selectedCourses = document.querySelectorAll('.course.selected');
        const selectedCount = selectedCourses.length;

        if (!isSelected && selectedCount < 3) {
            this.classList.add('selected');
        } else if (isSelected) {
            this.classList.remove('selected');
        } else {
            alert('You can only select up to three courses.');
        }
    });
});
