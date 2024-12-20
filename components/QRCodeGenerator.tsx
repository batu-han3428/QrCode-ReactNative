import React, { useRef, useState } from 'react';
import { View, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import { TextInput, Button, Card, Paragraph, Snackbar } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import ViewShot, { CaptureOptions } from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import { useTranslation } from 'react-i18next';

const QRCodeGenerator: React.FC = () => {
  const { t } = useTranslation();
  const [link, setLink] = useState<string>('');
  const [generatedQR, setGeneratedQR] = useState<boolean>(false);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const viewShotRef = useRef<ViewShot | null>(null);

  const requestStoragePermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: t('storagePermissionRequired'),
            message: t('weNeedStoragePermissionToSaveTheQRCodeOnYourDevice'),
            buttonNeutral: t('later'),
            buttonNegative: t('cancel'),
            buttonPositive: t('ok'),
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        setSnackbarMessage(t('anUnexpectedErrorOccurred'));
        setSnackbarVisible(true);
        return false;
      }
    }
    return true;
  };

  const saveQRCode = async (): Promise<void> => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      setSnackbarMessage(t('youMustGrantPermissionToSaveTheQRCode'));
      setSnackbarVisible(true);
      return;
    }

    try {
      if (!viewShotRef.current) {
        throw new Error('ViewShot referansı mevcut değil.');
      }

      const uri: string = await viewShotRef.current.capture!() as string;
      const timestamp: number = new Date().getTime();
      const filePath: string = `${RNFS.DownloadDirectoryPath}/QRCode_${timestamp}.png`;

      await RNFS.moveFile(uri, filePath);

      if (Platform.OS === 'android') {
        await RNFS.scanFile(filePath);
      }

      setSnackbarMessage(`${t('qRCodeSavedSuccessfully')}: ${filePath}`);
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage(t('qRCodeCouldNotBeSaved'));
      setSnackbarVisible(true);
    }
  };

  const handleInputChange = (text: string): void => {
    const updatedText = text.replace(/www/gi, 'www');
    setLink(updatedText);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Paragraph style={styles.paragraph}>
            {t('enterYourLinkBelowAndGenerateQRCode')}
          </Paragraph>
          <TextInput
            mode="outlined"
            label={t("connection")}
            placeholder="https://.....com"
            value={link}
            onChangeText={handleInputChange}
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={() => {
              if (link.trim() === '') {
                setSnackbarMessage(t('pleaseEnterAValidLink'));
                setSnackbarVisible(true);
              } else {
                setGeneratedQR(true);
              }
            }}
            style={styles.button}
          >
            {t('createQRCode')}
          </Button>
          {generatedQR && (
            <View style={styles.qrContainer}>
              <ViewShot
                ref={viewShotRef}
                options={{ format: 'png', quality: 1.0 } as CaptureOptions}
              >
                <QRCode value={link} size={200} />
              </ViewShot>
              <Button
                mode="outlined"
                onPress={saveQRCode}
                style={styles.saveButton}
              >
                {t('saveQRCode')}
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    elevation: 4,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  paragraph: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
  qrCard: {
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRadius: 10,
    elevation: 4,
  },
  saveButton: {
    marginTop: 20,
  },
  qrContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default QRCodeGenerator;
