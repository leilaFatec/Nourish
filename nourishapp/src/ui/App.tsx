import {
  HostGrotesk_400Regular,
  HostGrotesk_500Medium,
  HostGrotesk_600SemiBold,
  useFonts,
} from '@expo-google-fonts/host-grotesk'

import { Greetings } from './screens/Greetings';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export function App() {
  const [isFontsloaded] =  useFonts({
    HostGrotesk_400Regular,
    HostGrotesk_500Medium,
    HostGrotesk_600SemiBold,
  });

  if (!isFontsloaded) {
    return null;
  }

  return(
    <SafeAreaProvider>
      <Greetings />
    </SafeAreaProvider>  
  );  
}

