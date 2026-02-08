# Professional Installation Guide for Blling POS

## 1. Prerequisites (Client PC)
Before installing, ensure the PC has:
- **Node.js Installed**: Download and install the latest LTS version from [nodejs.org](https://nodejs.org/).
- **Google Chrome**: For best performance (or Edge).
- **Internet Connection**: Required for initial setup and Mobile Upload (P2P).

## 2. Installation Steps
1. **Copy the `Blling` Folder**: Copy the entire project folder to the Client's PC (e.g., `C:\Blling`).
2. **Open Terminal**: Go into the folder, right-click and select "Open Terminal" or Command Prompt.
3. **Install Server**: Run the following command once:
   ```bash
   npm install
   ```
   (Wait for it to finish. This downloads necessary tools).

## 3. How to Run (Daily Usage)

### Standard Mode (Offline / PC Only)
- Double-click `start_pos.bat`.
- This will open the POS system in the browser instantly.
- No internet required (except for social media simulation).

### Remote Mode (For Mobile Uploads)
- Double-click `start_online.bat`.
- This will open a black window showing a **Public URL** (e.g., `https://cold-apple-42.loca.lt`).
- **Copy that URL** and paste it into your browser.
- Now, when you generate a QR code for Mobile Upload:
  1. The QR code will use this public URL.
  2. Scan it with your phone (using 4G or Wi-Fi).
  3. Since it's a public link, it will connect securely!

## 4. Setting up Auto-Start (Optional)
To make the system start automatically when the PC turns on:
1. Press `Win + R`, type `shell:startup`, and press Enter.
2. Right-click inside the folder > `New` > `Shortcut`.
3. Browse to the `start_pos.bat` file in your Blling folder.
4. Now the POS will auto-launch on startup.

## 5. Troubleshooting
- If the Mobile Upload doesn't work: Make sure you opened the POS using the **Cloud/Public URL**, not `localhost`.
- If images are slow: Ensure both devices have internet access. Peer-to-Peer connects directly but needs internet to find each other initially.
