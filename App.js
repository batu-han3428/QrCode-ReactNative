import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Appbar, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import QRScanner from './components/QRCodeScanner';
import QRCodeGenerator from './components/QRCodeGenerator';
import QRPhotoReader from './components/QRPhotoReader';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac6',
  },
};

const App = () => {
  const [activeMode, setActiveMode] = useState('');

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <View style={styles.container}>
          <Appbar.Header>
            <Appbar.Content title="Seçim yapın" />
          </Appbar.Header>

          <View style={styles.iconButtonContainer}>
            <IconButton
              icon="camera"
              iconColor={theme.colors.primary}
              size={40}
              onPress={() => setActiveMode('scanner')}
            />
            <IconButton
              icon="qrcode"
              iconColor={theme.colors.accent}
              size={40}
              onPress={() => setActiveMode('generator')}
            />
            <IconButton
              icon="image"
              iconColor={theme.colors.primary}
              size={40}
              onPress={() => setActiveMode('photo')}
            />
          </View>

          <View style={styles.content}>
            {activeMode === 'scanner' && <QRScanner />}
            {activeMode === 'generator' && <QRCodeGenerator />}
            {activeMode === 'photo' && <QRPhotoReader />}
          </View>
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  iconButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
