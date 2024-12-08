import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { IconButton, Appbar, Provider as PaperProvider, DefaultTheme, MD3Theme, Menu } from 'react-native-paper';
import QRScanner from './components/QRCodeScanner';
import QRCodeGenerator from './components/QRCodeGenerator';
import QRPhotoReader from './components/QRPhotoReader';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import './i18n';

type ActiveMode = 'scanner' | 'generator' | 'photo' | '';
type Language = 'en' | 'tr';

const theme: MD3Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    secondary: '#03dac6',
  },
};

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeMode, setActiveMode] = useState<ActiveMode>('');
  const [visible, setVisible] = useState<boolean>(false);
  const currentLanguage: Language = i18n.language as Language;

  const ukFlag = require('./images/uk.png');
  const trFlag = require('./images/tr.png');

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    closeMenu();
  };

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <View style={styles.container}>
          <Appbar.Header>
            <Appbar.Content title={t('select')} />
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <TouchableOpacity 
                  onPress={openMenu}
                >
                  <Image
                    source={currentLanguage === 'en' ? ukFlag : trFlag}
                    style={styles.flag}
                  />
                </TouchableOpacity>
              }
            >
              <Menu.Item onPress={() => changeLanguage('en')} title="English" />
              <Menu.Item onPress={() => changeLanguage('tr')} title="Türkçe" />
            </Menu>
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
              iconColor={theme.colors.secondary}
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
  flag: {
    width: 30,
    height: 30,
  }
});

export default App;
