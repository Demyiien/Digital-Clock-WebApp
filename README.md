# Digital Clock App

A modern, responsive web-based digital clock application with timer, stopwatch, and alarm functionality. Features a beautiful glassmorphism design with dark/light theme support.

## Features

### 🕐 Digital Clock
- Real-time clock display with hours, minutes, and seconds
- Current date and day of the week
- 24-hour format
- Updates every second

### ⏰ Timer
- Set custom countdown timer with hours, minutes, and seconds
- Start, pause, and reset functionality
- Visual countdown display
- Audio notification when timer completes
- Input validation for time values

### ⏱️ Stopwatch
- High-precision stopwatch with centisecond accuracy
- Start, pause, and reset controls
- Lap time recording functionality
- Scrollable lap times list
- Real-time display updates

### 🔔 Alarm
- Set multiple alarms with custom times
- Option for daily repeating alarms
- Visual and audio notifications
- Persistent alarm storage (saved in browser)
- Easy alarm management with delete functionality

### 🌓 Theme Toggle
- Switch between light and dark themes
- Theme preference saved in browser storage
- Automatic theme persistence across sessions
- Smooth theme transition animations

## How to Use

### Getting Started
1. Open `index.html` in your web browser
2. The application will load with the clock tab active by default
3. Use the tab navigation to switch between different features
4. Toggle between light and dark themes using the theme switch in the header

### Clock
- The clock displays automatically and updates every second
- Shows current time, date, and day of the week
- No user interaction required

### Timer
1. Navigate to the Timer tab
2. Enter the desired time in the hours, minutes, and seconds fields
3. Click "Start" to begin the countdown
4. Use "Pause" to temporarily stop the timer
5. Use "Reset" to clear the timer and inputs
6. When the timer reaches zero, you'll get a notification and audio alert

### Stopwatch
1. Navigate to the Stopwatch tab
2. Click "Start" to begin timing
3. Use "Pause" to temporarily stop the stopwatch
4. Use "Lap" to record the current time while continuing
5. Use "Reset" to clear the stopwatch and lap times
6. Lap times are displayed in a scrollable list below the controls

### Alarm
1. Navigate to the Alarm tab
2. Set the desired alarm time using the time picker
3. Check "Repeat Daily" if you want the alarm to repeat every day
4. Click "Set Alarm" to create the alarm
5. Active alarms are displayed in the list below
6. Click the trash icon to delete an alarm
7. When an alarm triggers, a modal will appear with an audio alert

### Theme Customization
- Click the sun/moon icon in the header to toggle between light and dark themes
- Your theme preference is automatically saved and restored on future visits
- The theme switch provides smooth visual transitions

## Technical Details

### Technologies Used
- **HTML5**: Semantic structure and modern elements
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **JavaScript (ES6+)**: Interactive functionality and real-time updates
- **Font Awesome**: Icons for better user experience
- **Google Fonts**: Orbitron font for digital display aesthetics

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (responsive design)

### Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Local Storage**: Alarms and theme preferences are saved in the browser's local storage
- **Audio Notifications**: Built-in audio alerts for timers and alarms
- **Keyboard Shortcuts**: Press Escape to dismiss notifications
- **Modern UI**: Glassmorphism design with smooth animations
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Theme Support**: Light and dark theme options with automatic persistence

### File Structure
```
digital-clock-app/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md          # This file
```

## Customization

### Colors
The application uses a purple gradient theme with support for both light and dark modes. You can customize colors by modifying the CSS variables in `styles.css`:

```css
/* Light theme */
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --background: #f8f9fa;
    --text-color: #333;
}

/* Dark theme */
[data-theme="dark"] {
    --primary-gradient: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    --background: #1a1a1a;
    --text-color: #ffffff;
}
```

### Font
The application uses the Orbitron font for a digital clock aesthetic. You can change this by modifying the font-family in the CSS.

### Audio
The alarm sound is generated using the Web Audio API. You can modify the frequency and duration in the `playAlarmSound()` function in `script.js`.

## Browser Permissions

The application may request permission to play audio when you first interact with timers or alarms. This is normal and required for the audio notifications to work.

## Local Storage

The application uses browser local storage to save:
- **Alarm settings**: All configured alarms persist between browser sessions
- **Theme preference**: Your light/dark theme choice is remembered
- **Data is specific to your browser and device**
- **Clearing browser data will remove saved settings**

## Troubleshooting

### Audio Not Working
- Make sure your browser allows audio playback
- Try clicking on the page first to enable audio context
- Check that your system volume is not muted

### Alarms Not Triggering
- Ensure the browser tab is open or the page is active
- Check that the alarm time is set correctly
- Verify that the current time matches the alarm time

### Display Issues
- Try refreshing the page
- Clear browser cache if needed
- Ensure JavaScript is enabled in your browser

### Theme Not Saving
- Check that local storage is enabled in your browser
- Try clearing browser data and setting the theme again
- Ensure you're not in private/incognito mode

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the application.

---

**Enjoy your digital clock app!** ⏰ 