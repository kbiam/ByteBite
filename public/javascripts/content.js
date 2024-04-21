// Update the event listener for lesson clicks to redirect to the new route
document.querySelectorAll('.lesson').forEach(lesson => {
    lesson.addEventListener('click', function() {
      const lessonName = this.dataset.lessonName;
      window.location.replace(`/lesson/${encodeURIComponent(lessonName)}`);
    });
  });
  