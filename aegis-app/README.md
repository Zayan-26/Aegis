# Mobile Application for AEGIS
*Note that this application does not contain a web version as it uses react-native-maps.*

## Run Application
1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Development Notes

### API Endpoints
API Endpoints are store in ./constants/endpoints.ts. Check the message formats in ./apis/ and change the endpoints accordingly.

### Map Rendering
If you want the application to work, a map tile server + POI server will at least need to be provided. The one running on my computer will not be on after this project concludes, check ../aegis-map/README.md for information on how to recreate the data needed. (Hoping it works)

## Testing
Individual interfacing tests are included, as the expo-jest related front-end tests are going-through a weird dependenci=y restructure.

### Authentication

The authentication system for the front-end was tested in bits via the stone-age html files included in the `api` folder.

