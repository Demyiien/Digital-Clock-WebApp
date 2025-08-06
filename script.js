// Global variables
let currentTab = 'clock';
let timerInterval = null;
let stopwatchInterval = null;
let alarmInterval = null;
let alarms = JSON.parse(localStorage.getItem('alarms')) || [];
let currentTheme = localStorage.getItem('theme') || 'light';
let alarmAudioContext = null;
let alarmOscillator = null;
let alarmGainNode = null;
let isAlarmPlaying = false;

// DOM elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const currentTimeElement = document.getElementById('current-time');
const currentDateElement = document.getElementById('current-date');
const currentDayElement = document.getElementById('current-day');

// Timer elements
const timerDisplay = document.getElementById('timer-display');
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const startTimerBtn = document.getElementById('start-timer');
const pauseTimerBtn = document.getElementById('pause-timer');
const resetTimerBtn = document.getElementById('reset-timer');

// Stopwatch elements
const stopwatchDisplay = document.getElementById('stopwatch-display');
const startStopwatchBtn = document.getElementById('start-stopwatch');
const resetStopwatchBtn = document.getElementById('reset-stopwatch');
const lapStopwatchBtn = document.getElementById('lap-stopwatch');
const lapTimesContainer = document.getElementById('lap-times');

// Alarm elements
const alarmTimeInput = document.getElementById('alarm-time');
const alarmRepeatCheckbox = document.getElementById('alarm-repeat');
const setAlarmBtn = document.getElementById('set-alarm');
const alarmList = document.getElementById('alarm-list');
const noAlarmsElement = document.getElementById('no-alarms');

// Modal elements
const notificationModal = document.getElementById('notification-modal');
const notificationTitle = document.getElementById('notification-title');
const notificationMessage = document.getElementById('notification-message');
const dismissNotificationBtn = document.getElementById('dismiss-notification');
const stopAlarmBtn = document.getElementById('stop-alarm');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeTabs();
    initializeClock();
    initializeTimer();
    initializeStopwatch();
    initializeAlarms();
    loadAlarms();
    startAlarmCheck();
});

// Theme functionality
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.checked = currentTheme === 'dark';
    
    // Theme toggle event listener
    themeToggle.addEventListener('change', function() {
        currentTheme = this.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
    });
}

// Tab functionality
function initializeTabs() {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Remove active class from all tabs and panes
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabPanes.forEach(pane => pane.classList.remove('active'));
    
    // Add active class to selected tab and pane
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    // Force hide stopwatch tab if switching to other tabs
    if (tabName !== 'stopwatch') {
        const stopwatchTab = document.getElementById('stopwatch');
        if (stopwatchTab) {
            stopwatchTab.style.display = 'none';
            stopwatchTab.style.visibility = 'hidden';
            stopwatchTab.style.opacity = '0';
            stopwatchTab.style.position = 'absolute';
            stopwatchTab.style.left = '-9999px';
            stopwatchTab.style.top = '-9999px';
        }
    } else {
        // Show stopwatch tab when switching to it
        const stopwatchTab = document.getElementById('stopwatch');
        if (stopwatchTab) {
            stopwatchTab.style.display = 'flex';
            stopwatchTab.style.visibility = 'visible';
            stopwatchTab.style.opacity = '1';
            stopwatchTab.style.position = 'static';
            stopwatchTab.style.left = 'auto';
            stopwatchTab.style.top = 'auto';
        }
    }
    
    currentTab = tabName;
}

// Clock functionality
function initializeClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    
    // Update time
    const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    currentTimeElement.textContent = timeString;
    
    // Update date
    const dateString = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    currentDateElement.textContent = dateString;
    
    // Update day
    const dayString = now.toLocaleDateString('en-US', { weekday: 'long' });
    currentDayElement.textContent = dayString;
}

// Timer functionality
function initializeTimer() {
    let timerSeconds = 0;
    let isTimerRunning = false;
    let originalTime = 0;
    
    startTimerBtn.addEventListener('click', startTimer);
    pauseTimerBtn.addEventListener('click', pauseTimer);
    resetTimerBtn.addEventListener('click', resetTimer);
    
    // Add focus event listeners to clear placeholder zeros
    hoursInput.addEventListener('focus', function() {
        if (this.value === '0') this.value = '';
    });
    minutesInput.addEventListener('focus', function() {
        if (this.value === '0') this.value = '';
    });
    secondsInput.addEventListener('focus', function() {
        if (this.value === '0') this.value = '';
    });
    
    // Add input validation for minutes and seconds (max 60)
    minutesInput.addEventListener('input', function() {
        let value = parseInt(this.value) || 0;
        if (value > 60) {
            this.value = '60';
        } else if (value < 0) {
            this.value = '0';
        }
    });
    
    secondsInput.addEventListener('input', function() {
        let value = parseInt(this.value) || 0;
        if (value > 60) {
            this.value = '60';
        } else if (value < 0) {
            this.value = '0';
        }
    });
    
    function startTimer() {
        if (!isTimerRunning) {
            // Always get time from inputs when starting
            const hours = parseInt(hoursInput.value) || 0;
            let minutes = parseInt(minutesInput.value) || 0;
            let seconds = parseInt(secondsInput.value) || 0;
            
            // Validate minutes and seconds
            if (minutes > 60) {
                alert('Minutes cannot exceed 60!');
                minutesInput.value = '60';
                minutes = 60;
            }
            if (seconds > 60) {
                alert('Seconds cannot exceed 60!');
                secondsInput.value = '60';
                seconds = 60;
            }
            
            timerSeconds = hours * 3600 + minutes * 60 + seconds;
            originalTime = timerSeconds;
            
            if (timerSeconds === 0) {
                alert('Please set a timer duration!');
                return;
            }
            
            isTimerRunning = true;
            startTimerBtn.disabled = true;
            pauseTimerBtn.disabled = false;
            
            // Update display immediately
            updateTimerDisplay();
            
            timerInterval = setInterval(() => {
                timerSeconds--;
                updateTimerDisplay();
                
                if (timerSeconds <= 0) {
                    clearInterval(timerInterval);
                    isTimerRunning = false;
                    startTimerBtn.disabled = false;
                    pauseTimerBtn.disabled = true;
                    showNotification('Timer Complete!', 'Your timer has finished.');
                    playAlarmSound();
                }
            }, 1000);
        }
    }
    
    function pauseTimer() {
        if (isTimerRunning) {
            clearInterval(timerInterval);
            isTimerRunning = false;
            startTimerBtn.disabled = false;
            pauseTimerBtn.disabled = true;
        }
    }
    
    function resetTimer() {
        clearInterval(timerInterval);
        isTimerRunning = false;
        timerSeconds = 0;
        originalTime = 0;
        updateTimerDisplay();
        startTimerBtn.disabled = false;
        pauseTimerBtn.disabled = true;
        
        // Reset inputs
        hoursInput.value = '';
        minutesInput.value = '';
        secondsInput.value = '';
    }
    
    function updateTimerDisplay() {
        const hours = Math.floor(timerSeconds / 3600);
        const minutes = Math.floor((timerSeconds % 3600) / 60);
        const seconds = timerSeconds % 60;
        
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timerDisplay.textContent = timeString;
    }
}

// Stopwatch functionality
function initializeStopwatch() {
    let stopwatchSeconds = 0;
    let isStopwatchRunning = false;
    let lapTimes = [];
    let lapCounter = 1;
    
    startStopwatchBtn.addEventListener('click', toggleStopwatch);
    resetStopwatchBtn.addEventListener('click', resetStopwatch);
    lapStopwatchBtn.addEventListener('click', recordLap);
    
    function startStopwatch() {
        if (!isStopwatchRunning) {
            isStopwatchRunning = true;
            lapStopwatchBtn.disabled = false;
            
            // Update button text
            startStopwatchBtn.innerHTML = '<i class="fas fa-stop"></i> Stop';
            
            stopwatchInterval = setInterval(() => {
                stopwatchSeconds += 0.01;
                updateStopwatchDisplay();
            }, 10);
        }
    }
    
    function stopStopwatch() {
        if (isStopwatchRunning) {
            clearInterval(stopwatchInterval);
            isStopwatchRunning = false;
            lapStopwatchBtn.disabled = true;
            
            // Update button text
            startStopwatchBtn.innerHTML = '<i class="fas fa-play"></i> Start';
        }
    }
    
    // Toggle between start and stop
    function toggleStopwatch() {
        if (isStopwatchRunning) {
            stopStopwatch();
        } else {
            startStopwatch();
        }
    }
    
    function resetStopwatch() {
        clearInterval(stopwatchInterval);
        isStopwatchRunning = false;
        stopwatchSeconds = 0;
        lapTimes = [];
        lapCounter = 1;
        updateStopwatchDisplay();
        updateLapTimes();
        lapStopwatchBtn.disabled = true;
        
        // Reset button text
        startStopwatchBtn.innerHTML = '<i class="fas fa-play"></i> Start';
    }
    
    function recordLap() {
        const currentTime = formatStopwatchTime(stopwatchSeconds);
        lapTimes.push({
            lap: lapCounter,
            time: currentTime
        });
        lapCounter++;
        updateLapTimes();
    }
    
    function updateStopwatchDisplay() {
        stopwatchDisplay.textContent = formatStopwatchTime(stopwatchSeconds);
    }
    
    function formatStopwatchTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        const centiseconds = Math.floor((seconds % 1) * 100);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }
    
    function updateLapTimes() {
        lapTimesContainer.innerHTML = '';
        
        if (lapTimes.length === 0) {
            lapTimesContainer.innerHTML = '<div style="text-align: center; color: #888; padding: 20px;">No lap times recorded</div>';
            return;
        }
        
        lapTimes.forEach(lap => {
            const lapElement = document.createElement('div');
            lapElement.className = 'lap-time';
            lapElement.innerHTML = `
                <span>Lap ${lap.lap}</span>
                <span>${lap.time}</span>
            `;
            lapTimesContainer.appendChild(lapElement);
        });
    }
}

// Alarm functionality
function initializeAlarms() {
    setAlarmBtn.addEventListener('click', setAlarm);
    dismissNotificationBtn.addEventListener('click', dismissNotification);
    stopAlarmBtn.addEventListener('click', stopAlarmSound);
}

function setAlarm() {
    const alarmTime = alarmTimeInput.value;
    const repeat = alarmRepeatCheckbox.checked;
    
    if (!alarmTime) {
        alert('Please set an alarm time!');
        return;
    }
    
    const alarm = {
        id: Date.now(),
        time: alarmTime,
        repeat: repeat,
        active: true
    };
    
    alarms.push(alarm);
    saveAlarms();
    loadAlarms();
    
    // Clear inputs
    alarmTimeInput.value = '';
    alarmRepeatCheckbox.checked = false;
    
    alert('Alarm set successfully!');
}

function loadAlarms() {
    const alarmListContainer = alarmList.querySelector('.alarm-list-container') || alarmList;
    
    if (alarms.length === 0) {
        noAlarmsElement.style.display = 'block';
        if (alarmListContainer !== alarmList) {
            alarmListContainer.remove();
        }
        return;
    }
    
    noAlarmsElement.style.display = 'none';
    
    // Remove existing alarm list container if it exists
    const existingContainer = alarmList.querySelector('.alarm-list-container');
    if (existingContainer) {
        existingContainer.remove();
    }
    
    // Create new alarm list container
    const container = document.createElement('div');
    container.className = 'alarm-list-container';
    
    alarms.forEach(alarm => {
        const alarmElement = document.createElement('div');
        alarmElement.className = 'alarm-item';
        alarmElement.innerHTML = `
            <div>
                <div class="alarm-time">${alarm.time}</div>
                <div class="alarm-repeat">${alarm.repeat ? 'Daily' : 'Once'}</div>
            </div>
            <button class="delete-alarm" onclick="deleteAlarm(${alarm.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        container.appendChild(alarmElement);
    });
    
    alarmList.appendChild(container);
}

function deleteAlarm(alarmId) {
    alarms = alarms.filter(alarm => alarm.id !== alarmId);
    saveAlarms();
    loadAlarms();
}

function saveAlarms() {
    localStorage.setItem('alarms', JSON.stringify(alarms));
}

function startAlarmCheck() {
    setInterval(checkAlarms, 1000);
}

function checkAlarms() {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    
    alarms.forEach((alarm, index) => {
        if (alarm.active && alarm.time === currentTime) {
            triggerAlarm(alarm);
            
            if (!alarm.repeat) {
                // Remove one-time alarms
                alarms.splice(index, 1);
                saveAlarms();
                loadAlarms();
            }
        }
    });
}

function triggerAlarm(alarm) {
    showNotification('Alarm!', `It's ${alarm.time} - Time to wake up!`);
    playAlarmSound();
}

// Notification functionality
function showNotification(title, message) {
    notificationTitle.textContent = title;
    notificationMessage.textContent = message;
    notificationModal.style.display = 'block';
}

function dismissNotification() {
    notificationModal.style.display = 'none';
    stopAlarmSound();
}

// Sound functionality
function playAlarmSound() {
    if (isAlarmPlaying) return; // Prevent multiple alarms
    
    // Create audio context for continuous beep sound
    alarmAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    alarmOscillator = alarmAudioContext.createOscillator();
    alarmGainNode = alarmAudioContext.createGain();
    
    alarmOscillator.connect(alarmGainNode);
    alarmGainNode.connect(alarmAudioContext.destination);
    
    // Set up continuous alternating frequencies
    let currentTime = alarmAudioContext.currentTime;
    let frequency = 800;
    
    alarmOscillator.frequency.setValueAtTime(frequency, currentTime);
    alarmGainNode.gain.setValueAtTime(0.3, currentTime);
    
    // Create alternating frequency pattern
    const alternateFrequency = () => {
        if (!isAlarmPlaying) return;
        
        frequency = frequency === 800 ? 600 : 800;
        alarmOscillator.frequency.setValueAtTime(frequency, alarmAudioContext.currentTime);
        
        setTimeout(alternateFrequency, 200);
    };
    
    alarmOscillator.start(currentTime);
    isAlarmPlaying = true;
    
    // Start alternating frequencies after 200ms
    setTimeout(alternateFrequency, 200);
}

function stopAlarmSound() {
    if (isAlarmPlaying && alarmOscillator) {
        alarmOscillator.stop();
        alarmOscillator = null;
        alarmGainNode = null;
        alarmAudioContext = null;
        isAlarmPlaying = false;
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === notificationModal) {
        dismissNotification();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        dismissNotification();
    }
});

// Prevent form submission on Enter key
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
    }
}); 