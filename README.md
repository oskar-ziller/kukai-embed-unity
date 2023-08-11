# Kukai-embed 🔗 Unity

Folder structure:

`/unity`: contains a sample Unity Project

`/web-client`: contains a web app (react) that acts as a kukai-embed delegate

## Steps

**Run the Unity project:**

1. Create a new 3D unity project and import the existing scene in the `/unity` folder
2. Select iOS as the build target 
3. Make sure the deeplinks are registered in the iOS Player Settings: window (menu: Edit > Project Settings > Player Settings, then select iOS).
Select Other, then scroll down to Configuration.
Expand the Supported URL schemes section and, in the Element 0 field, enter `unitydl`. That allows for `unitydl://` scheme
4. Build & run for iOS (simulator/device) -- you need to start the web-client server (kukai-embed delegate) before you try it out.

**Now run the web-client**

1. In the `web-client` folder, run:
```bash
yarn
```
2. Then run the server locally:
```bash
yarn dev
```


This starts the kukai-embed delegate server at port 3000. 
The unity sample redirects to the kukai-embed delegate in Safari or the selected system browser, then that browser redirects back to Unity via a deeplink (unitydl://<data>). Unity parses the deeplink and extracts information regarding the address and the type of login.