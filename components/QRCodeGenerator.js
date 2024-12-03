import React, { useRef, useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';

const QRCodeGenerator = () => {
  const [link, setLink] = useState('');
  const [generatedQR, setGeneratedQR] = useState(false);
  const viewShotRef = useRef(null);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Depolama İzni Gerekli',
            message: 'QR kodunu cihazınıza kaydedebilmek için depolama iznine ihtiyacımız var.',
            buttonNeutral: 'Sonra Sor',
            buttonNegative: 'Hayır',
            buttonPositive: 'Evet',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const saveQRCode = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('İzin Gerekli', 'QR kodunu kaydetmek için izin vermelisiniz.');
      return;
    }

    try {
      const uri = await viewShotRef.current.capture();
      const timestamp = new Date().getTime();
      const filePath = `${RNFS.DownloadDirectoryPath}/QRCode_${timestamp}.png`;

      await RNFS.moveFile(uri, filePath);

      if (Platform.OS === 'android') {
        await RNFS.scanFile(filePath);
      }

      Alert.alert(
        'Başarılı!',
        `QR kodu başarıyla kaydedildi: ${filePath}`
      );
    } catch (error) {
      Alert.alert('Hata', 'QR kodu kaydedilemedi.');
      console.error(error);
    }
  };

  const handleInputChange = (text) => {
    const updatedText = text.replace(/www/gi, 'www');
    setLink(updatedText);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Bağlantıyı buraya girin"
        value={link}
        onChangeText={handleInputChange}
      />
      <Button
        title="QR Kodu Oluştur"
        onPress={() => {
          if (link.trim() === '') {
            Alert.alert('Hata', 'Lütfen geçerli bir bağlantı girin.');
          } else {
            setGeneratedQR(true);
          }
        }}
      />

      {generatedQR && (
        <View style={styles.qrContainer}>
          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }}>
            <QRCode value={link} size={200} />
          </ViewShot>
          <Button title="QR Kodunu Kaydet" onPress={saveQRCode} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '100%',
    padding: 10,
    marginBottom: 20,
  },
  qrContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default QRCodeGenerator;
