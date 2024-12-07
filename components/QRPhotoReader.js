import React, { useState } from 'react';
import { View, Image, StyleSheet, Linking } from 'react-native';
import { Button, Card, Text, Snackbar, ActivityIndicator } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import RNQRGenerator from 'rn-qr-generator';

const QRPhotoReader = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [qrCodeValue, setQRCodeValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image Picker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri;
        setSelectedImage(imageUri);
        detectQRCode(imageUri);
      }
    });
  };

  const detectQRCode = (uri) => {
    setLoading(true);
    RNQRGenerator.detect({ uri })
      .then((response) => {
        const { values } = response;
        if (values && values.length > 0) {
          const isValidUrl = /^(http|https):\/\//.test(values[0]);

          if (!isValidUrl) {
            if (values[0].toLowerCase().startsWith('www.')) {
              values[0] = `http://${values[0]}`;
            } else {
              setQRCodeValue(`Geçersiz URL: ${values[0]}`);
              setSnackbarVisible(true);
              return;
            }
          }
          setQRCodeValue(values[0]);
          Linking.openURL(values[0]).catch((err) => {
            setQRCodeValue('Bağlantı açılamadı: ' + err.message);
            setSnackbarVisible(true);
          });
        } else {
          setQRCodeValue('Resimde QR kod bulunamadı.');
          setSnackbarVisible(true);
        }
      })
      .catch((error) => {
        console.log('Cannot detect QR code in image', error);
        setQRCodeValue('QR kod algılama sırasında bir hata oluştu.');
        setSnackbarVisible(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="QR Kod Okuyucu" subtitle="Resimlerden QR kod tarayın" />
        <Card.Content>
          <Button
            mode="contained"
            onPress={selectImage}
            icon="image"
            style={styles.button}
            disabled={loading}
          >
            Fotoğraf Seç
          </Button>
          {loading && <ActivityIndicator animating size="large" style={styles.loader} />}
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.image} />
          )}
          {qrCodeValue && (
            <Text style={styles.qrCodeText}>{qrCodeValue}</Text>
          )}
        </Card.Content>
      </Card>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {qrCodeValue}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    width:'100%'
  },
  card: {
    elevation: 4,
    borderRadius: 12,
  },
  button: {
    marginVertical: 16,
  },
  loader: {
    marginVertical: 16,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 16,
    resizeMode: 'contain',
  },
  qrCodeText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    color: '#6200ee',
  },
});

export default QRPhotoReader;
