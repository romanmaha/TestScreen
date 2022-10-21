import React from 'react';
import {Alert, Platform, PermissionsAndroid, Button} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
const resolve = require('path').resolve;
const TestScreen = () => {
  const fileUrl = RNFetchBlob.fs.asset(
    resolve('../../android/app/src/main/assets/test.pdf'),
  );

  const checkPermission = async () => {
    // Function to check the platform
    // If Platform is Android then check for permissions.

    if (Platform.OS === 'ios') {
      downloadFile();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          downloadFile();
          console.log('Storage Permission Granted.');
        } else {
          // If permission denied then show alert
          Alert.alert('Error', 'Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.log('++++' + err);
      }
    }
  };

  const downloadFile = () => {
    // Get today's date to add the time suffix in filename
    let FILE_URL = fileUrl;
    // Function to get extention of the file url
    let file_ext = getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];

    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const {config, fs} = RNFetchBlob;
    let pathToFile = fs.dirs.DownloadDir + `/test.pdf`;
    let options = {
      addAndroidDownloads: {
        fileCache: true,
        path: pathToFile,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch('GET', FILE_URL, 60000)
      .then(res => {
        // Alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
      });
  };

  const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };
  return <Button title="Donload" onPress={checkPermission} />;
};

export default TestScreen;
