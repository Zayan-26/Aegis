import * as Notifications from 'expo-notifications';

export async function registerForPushNotificationsAsync(userId: string) {
  const expoPushToken = await Notifications.getExpoPushTokenAsync({
   projectId: '2be93e56-c851-40c9-ad08-bc35a757e00f',
  });
  console.log(expoPushToken)
}
