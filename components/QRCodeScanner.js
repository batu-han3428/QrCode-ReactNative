import React, { useEffect, useState } from 'react';
import { View, Platform, PermissionsAndroid, Linking, StyleSheet } from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import { Snackbar, Text, Button, Dialog, Portal, Card } from 'react-native-paper';

const QRScanner = () => {
  const [scanned, setScanned] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Kamera İzni Gerekli',
          message: 'Bu uygulama kameranızı kullanmak için izin gerektirir.',
          buttonNeutral: 'Daha Sonra',
          buttonNegative: 'İptal',
          buttonPositive: 'Tamam',
        }
      );
      setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
    } else {
      setHasPermission(true);
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const onBarcodeScan = (event) => {
    try {
      if (!scanned) {
        setScanned(true);
        let scannedData = event.nativeEvent.codeStringValue;
        const isValidUrl = /^(http|https):\/\//.test(scannedData);
        if (!isValidUrl) {
          if (scannedData.toLowerCase().startsWith('www.')) {
            scannedData = `http://${scannedData}`;
          } else {
            setDialogMessage('Geçersiz URL: Lütfen geçerli bir bağlantı girin.');
            setDialogVisible(true);
            setScanned(false);
            return;
          }
        }
        Linking.openURL(scannedData).catch(() => {
          setDialogMessage('Bağlantı açılamadı: Geçerli bir URL sağladığınızdan emin olun.');
          setDialogVisible(true);
        });
        setScanned(false);
      }
    } catch (error) {
      setErrorVisible(true);
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Card style={styles.card}>
          <Card.Title title="Qr Tarayıcı" subtitle="Kamera izni gerekiyor" />
          <Card.Content>
            <Button
              mode="contained"
              onPress={requestCameraPermission}
              icon="camera"
              style={styles.button}
            >
              İzin Ver
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={{width: '100%', height: '100%'}}>
      <Camera
        style={{ width: '100%', height: '100%' }}
        cameraType={CameraType.Back}
        flashMode="auto"
        scanBarcode={!scanned}
        onReadCode={onBarcodeScan}
        showFrame={true}
        frameColor="green"
        laserColor="blue"
        focusMode="on"
      />
      <Snackbar
        visible={errorVisible}
        onDismiss={() => setErrorVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        Beklenmeyen bir hata oluştu!
      </Snackbar>
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Uyarı</Dialog.Title>
          <Dialog.Content>
            <Text>{dialogMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Tamam</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    width: '100%',
    padding: 16,
  },
  permissionText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionButton: {
    width: '60%',
  },
  snackbar: {
    backgroundColor: '#f44336',
  },
  card: {
    elevation: 4,
    borderRadius: 12,
    width:'100%'
  },
  button: {
    marginVertical: 16,
  },
});

export default QRScanner;
