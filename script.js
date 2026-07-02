document.addEventListener('DOMContentLoaded', function() {
    
    const calendar = document.getElementById('calendarDays');
    const monthElement = document.getElementById('currentMonth');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const calendarContainer = document.querySelector('.calendar-container');
    const heroBanner = document.getElementById('hero-banner');
    const calendarSection = document.querySelector('.calendar-section');
    const ctaButton = document.querySelector('.cta-button');
    const eventsSection = document.querySelector('.events-section');
    const eventDateInput = document.getElementById('eventDate');
    
    if (ctaButton && calendarSection) {
        ctaButton.addEventListener('click', function() {
            calendarSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeBtn = document.querySelector('.close');
    const loginForm = document.getElementById('loginForm');
    

const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navItems = document.querySelector('.nav-items');

mobileMenuToggle.addEventListener('click', () => {
    navItems.classList.toggle('active');
});


    loginBtn.addEventListener('click', function() {
        loginModal.style.display = 'block';
    });
    
    closeBtn.addEventListener('click', function() {
        loginModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });
    
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        
       
        console.log('Login submitted:', { name, email });
        
        
        loginModal.style.display = 'none';
        
      
        loginForm.reset();
    });
    
    
    const monthImages = {
        0: document.getElementById('jan-img'),
        1: document.getElementById('feb-img'),
        2: document.getElementById('mar-img'),
        3: document.getElementById('apr-img'),
        4: document.getElementById('may-img'),
        5: document.getElementById('jun-img'),
        6: document.getElementById('jul-img'),
        7: document.getElementById('aug-img'),
        8: document.getElementById('sep-img'),
        9: document.getElementById('oct-img'),
        10: document.getElementById('nov-img'),
        11: document.getElementById('dec-img')
    };
    
    
    if (heroBanner) {
        
        const randomMonth = Math.floor(Math.random() * 12);
        if (monthImages[randomMonth] && monthImages[randomMonth].complete) {
            const imgSrc = monthImages[randomMonth].src;
            heroBanner.style.backgroundImage = `linear-gradient(135deg, rgba(233, 165, 241, 0.7), rgba(57, 39, 245, 0.7)), url('${imgSrc}')`;
            heroBanner.style.backgroundSize = 'cover';
            heroBanner.style.backgroundPosition = 'center';
        }
    }
    
    
    let date = new Date();
    let currentMonth = date.getMonth();
    let currentYear = date.getFullYear();
    
    
    let selectedDate = null;
    
    
    function formatDate(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    
    
    function initCalendar() {
        
        Promise.all(Array.from(document.querySelectorAll('.month-images img')).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve;
            });
        })).then(() => {
            renderCalendar();
            
            
            prevMonthBtn.addEventListener('click', function() {
                currentMonth--;
                if (currentMonth < 0) {
                    currentMonth = 11;
                    currentYear--;
                }
                renderCalendar();
            });
            
            nextMonthBtn.addEventListener('click', function() {
                currentMonth++;
                if (currentMonth > 11) {
                    currentMonth = 0;
                    currentYear++;
                }
                renderCalendar();
            });
        });
    }
    
    
    function renderCalendar() {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
        
        
        monthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        
        calendar.innerHTML = '';
        
        
        if (monthImages[currentMonth] && monthImages[currentMonth].complete) {
            const imgSrc = monthImages[currentMonth].src;
            calendarContainer.style.backgroundImage = `linear-gradient(rgba(210, 88, 70, 0.3), rgba(255, 255, 255, 0.6)), url('${imgSrc}')`;
            calendarContainer.style.backgroundSize = 'cover';
            calendarContainer.style.backgroundPosition = 'center';
            calendarContainer.style.backgroundRepeat = 'no-repeat';
        }
        
        
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('empty');
            calendar.appendChild(emptyDay);
        }
        
        
        const today = new Date();
        for (let i = 1; i <= lastDate; i++) {
            const day = document.createElement('div');
            day.textContent = i;
            
            const dateToCheck = new Date(currentYear, currentMonth, i);
            
            
            if (i === today.getDate() && 
                currentMonth === today.getMonth() && 
                currentYear === today.getFullYear()) {
                day.classList.add('today');
            }
            
            
            if (selectedDate && 
                i === selectedDate.getDate() && 
                currentMonth === selectedDate.getMonth() && 
                currentYear === selectedDate.getFullYear()) {
                day.classList.add('selected');
            }
            
            
            day.addEventListener('click', function() {
                document.querySelectorAll('.days div.selected').forEach(function(selected) {
                    selected.classList.remove('selected');
                });
                
                day.classList.add('selected');
                selectedDate = new Date(currentYear, currentMonth, i);
                
                
                if (eventDateInput) {
                    eventDateInput.value = formatDate(selectedDate);
                }
                
                
                if (eventsSection) {
                    setTimeout(() => {
                        eventsSection.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                }
            });
            
            calendar.appendChild(day);
        }
    }
    
    
    initCalendar();
    
    
    const addEventForm = document.getElementById('addEventForm');
    let eventsList = document.getElementById('eventsList');
    let events = []; 
    let currentEditId = null; 
    
    
    if (!eventsList) {
        console.error('Events list not found by ID. Trying alternative selector...');
        eventsList = document.querySelector('.events-list');
    }
    
    
    const allElementsWithId = {};
    document.querySelectorAll('[id]').forEach(el => {
        if (allElementsWithId[el.id]) {
            console.error(`Duplicate ID found: ${el.id}`);
        }
        allElementsWithId[el.id] = (allElementsWithId[el.id] || 0) + 1;
    });
    
    if (addEventForm) {
        console.log('Event form found:', addEventForm);
        console.log('Events list element:', eventsList);
        
        
        function resetEventsList() {
            if (eventsList) {
                if (events.length > 0) {
                    eventsList.style.display = 'block';
                    eventsList.classList.add('show');
                } else {
                    eventsList.style.display = 'none';
                    eventsList.classList.remove('show');
                }
            }
        }
        
        
        resetEventsList();
        
        addEventForm.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log('Form submitted');
            
            
            const eventName = document.getElementById('eventName').value;
            const eventDate = document.getElementById('eventDate').value;
            const eventTime = document.getElementById('eventTime').value;
            const eventType = document.getElementById('eventType').value;
            const attendees = document.getElementById('attendees').value;
            const userName = document.getElementById('userName').value;
            const email = document.getElementById('userEmail').value;
            const phone = document.getElementById('userPhone').value;
            const eventLocation = document.getElementById('eventLocation').value;
            const notes = document.getElementById('notes').value;
            
            console.log('Form data:', { eventName, eventDate, eventTime, eventType, userName, email });
            
            if (currentEditId !== null) {
                
                const eventIndex = events.findIndex(e => e.id === currentEditId);
                if (eventIndex !== -1) {
                    events[eventIndex] = {
                        id: currentEditId,
                        eventName, eventDate, eventTime, eventType, attendees,
                        userName, email, phone, eventLocation, notes
                    };
                    
                    
                    currentEditId = null;
                    document.querySelector('.submit-btn').textContent = 'Add Event';
                }
            } else {
                
                const newEvent = {
                    id: Date.now(), 
                    eventName, eventDate, eventTime, eventType, attendees,
                    userName, email, phone, eventLocation, notes
                };
                
                events.push(newEvent);
                console.log('Added new event:', newEvent);
                console.log('Events array now has', events.length, 'events');
            }
            
            
            if (eventsList) {
                eventsList.style.display = 'block';
                eventsList.classList.add('show');
                console.log('Showing events list');
            } else {
                console.error('Events list element not found!');
            }
            
            
            renderEventsList();
            
            
            addEventForm.reset();
            
            
            const message = currentEditId !== null ? 'Event updated successfully!' : 'Event added successfully!';
            showNotification(message);
        });
    } else {
        console.error('Add Event Form not found in the DOM');
    }
    
    
    function renderEventsList() {
        console.log('Rendering events list. Events count:', events.length);
        
        if (!eventsList) {
            console.error('Cannot render events list - element not found');
            return;
        }
        
        
        eventsList.innerHTML = '';
        
        if (events.length === 0) {
            console.log('No events to display');
            eventsList.innerHTML = '<p>No events yet. Add your first event above!</p>';
            return;
        }
        
        
        events.forEach((event, index) => {
            console.log(`Adding event ${index + 1}:`, event.eventName);
            const eventItem = document.createElement('div');
            eventItem.classList.add('event-item');
            eventItem.dataset.id = event.id;
            
            eventItem.innerHTML = `
                <h4>${event.eventName || 'Unnamed Event'}</h4>
                <div class="event-details">
                    <span><i class="fas fa-calendar"></i> ${event.eventDate || 'No date'}</span>
                    <span><i class="fas fa-clock"></i> ${event.eventTime || 'No time'}</span>
                    <span><i class="fas fa-tag"></i> ${event.eventType || 'No type'}</span>
                    <span><i class="fas fa-users"></i> ${event.attendees || '0'} attendees</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${event.eventLocation || 'No location'}</span>
                </div>
                <div class="event-actions">
                    <button class="update-btn" data-id="${event.id}"><i class="fas fa-edit"></i> Update</button>
                    <button class="delete-btn" data-id="${event.id}"><i class="fas fa-trash"></i> Delete</button>
                </div>
            `;
            
            eventsList.appendChild(eventItem);
        });
        
        
        document.querySelectorAll('.update-btn').forEach(button => {
            button.addEventListener('click', handleUpdateEvent);
        });
        
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDeleteEvent);
        });
        
        console.log('Events list rendering complete');
    }
    
    
    function handleUpdateEvent(e) {
        const eventId = parseInt(e.target.dataset.id || e.target.parentElement.dataset.id);
        const event = events.find(event => event.id === eventId);
        
        if (event) {
            
            document.getElementById('eventName').value = event.eventName;
            document.getElementById('eventDate').value = event.eventDate;
            document.getElementById('eventTime').value = event.eventTime;
            document.getElementById('eventType').value = event.eventType;
            document.getElementById('attendees').value = event.attendees;
            document.getElementById('userName').value = event.userName;
            document.getElementById('userEmail').value = event.email;
            document.getElementById('userPhone').value = event.phone;
            document.getElementById('eventLocation').value = event.eventLocation;
            document.getElementById('notes').value = event.notes || '';
            
            
            currentEditId = eventId;
            
            
            document.querySelector('.submit-btn').textContent = 'Update Event';
            
            
            document.querySelector('.add-event-form').scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    
    function handleDeleteEvent(e) {
        const eventId = parseInt(e.target.dataset.id || e.target.parentElement.dataset.id);
        
        if (confirm('Are you sure you want to delete this event?')) {
            
            events = events.filter(event => event.id !== eventId);
            
            
            renderEventsList();
            
            
            showNotification('Event deleted successfully!');
            
            
            if (events.length === 0) {
                setTimeout(() => {
                    eventsList.classList.remove('show');
                }, 1000);
            }
        }
    }
    
    
    function showNotification(message) {
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
            </div>
        `;
        document.body.appendChild(notification);
        
        
        if (events.length > 0 && eventsList) {
            eventsList.style.display = 'block';
            eventsList.classList.add('show');
        }
        
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
});
