# 🎛️ CRT Album Display - Live Control System

Real-time control system for adjusting CRT display parameters with instant visual feedback.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the WebSocket Server

```bash
npm start
```

You should see:
```
🚀 WebSocket server running on ws://localhost:8080
📡 Waiting for connections...
```

### 3. Open the Display

Open `index.html` on your CRT display device (or any browser):
```bash
open index.html
```

### 4. Open the Control Panel

Open `control-panel.html` on your computer:
```bash
open control-panel.html
```

## 🎮 How to Use

### Control Panel Features

The control panel provides separate settings for each view:
- **Default View** - The normal full album display
- **Top Left (TL)** - Zoomed top-left quadrant
- **Top Right (TR)** - Zoomed top-right quadrant
- **Bottom Right (BR)** - Zoomed bottom-right quadrant
- **Bottom Left (BL)** - Zoomed bottom-left quadrant

### Adjustable Parameters

#### For All Views:
- **Horizontal Scale** - Adjust width scaling (for CRT aspect ratio correction)
- **Vertical Scale** - Adjust height scaling
- **Position X** - Horizontal nudge in pixels
- **Position Y** - Vertical nudge in pixels

#### Default View Only:
- **Size Factor** - Overall size of the album art (0.5 to 1.5)

### Real-time Updates

1. Move any slider on the control panel
2. Changes appear **instantly** on your display
3. All connected displays update simultaneously
4. Settings are auto-saved to `crt-config.json`

### Saving Configuration

Click **"💾 Save Configuration"** to persist your settings permanently to the config file.

### Reset to Defaults

Click **"🔄 Reset to Defaults"** to restore original settings.

## ⌨️ Keyboard Controls (Display)

- **C** - Toggle calibration mode (shows current view settings)
- **K** - Manually cycle through zoom states
- **Arrow Keys** (in calibration mode):
  - **←/→** - Nudge position left/right
  - **↑/↓** - Nudge position up/down
  - **Shift + ←/→** - Adjust horizontal scale
  - **Shift + ↑/↓** - Adjust size factor (default view only)

## 📁 Files

- `server.js` - WebSocket server for real-time communication
- `control-panel.html` - Web-based control interface
- `index.html` - CRT display (modified with WebSocket client)
- `crt-config.json` - Persistent configuration storage
- `package.json` - Node.js dependencies

## 🔧 Architecture

```
┌─────────────────┐         WebSocket          ┌─────────────────┐
│ Control Panel   │◄──────────────────────────►│  Display (CRT)  │
│ (Your Computer) │      ws://localhost:8080   │                 │
└────────┬────────┘                             └─────────────────┘
         │                                                ▲
         │                                                │
         │         ┌─────────────────┐                    │
         └────────►│ WebSocket Server│────────────────────┘
                   │   (server.js)   │
                   └────────┬────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │ crt-config.json │
                   │ (Persistent)    │
                   └─────────────────┘
```

## 🎯 Workflow

1. **Start Server** - Runs in background, manages connections
2. **Open Display** - Connects to server, loads config
3. **Open Control Panel** - Connects to server, loads current settings
4. **Adjust Settings** - Move sliders on control panel
5. **See Live Updates** - Display updates in real-time
6. **Save** - Click save button to persist to file
7. **Done!** - Settings are stored permanently

## 🌐 Network Setup

### Same Computer
Both display and control panel on same machine = works automatically

### Different Devices (e.g., CRT on TV, control on laptop)
1. Find server computer's IP address: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)
2. Edit `control-panel.html` and `index.html`
3. Change `ws://localhost:8080` to `ws://YOUR_IP:8080`
4. Ensure firewall allows port 8080

## ⚡ Tips

- **Live Preview** - Adjust while music plays to see real-time effects
- **Per-View Settings** - Each zoom state has independent controls
- **Calibration Mode** - Press 'C' on display to see current view parameters
- **Auto-Reconnect** - If connection drops, both clients auto-reconnect
- **Fallback** - Display works offline using localStorage

## 🐛 Troubleshooting

### "Disconnected" status
- Ensure server is running (`npm start`)
- Check WebSocket URL is correct
- Check firewall isn't blocking port 8080

### Changes not appearing
- Verify display is connected (check browser console)
- Try clicking "Save Configuration" on control panel
- Reload display page

### Server won't start
- Make sure Node.js is installed
- Run `npm install` first
- Check port 8080 isn't in use

## 📝 Notes

- Config file is JSON - can be edited manually if needed
- Server logs all changes to console
- Multiple displays can connect simultaneously
- Press Ctrl+C to stop server

Enjoy your perfectly calibrated CRT display! 🎨✨
