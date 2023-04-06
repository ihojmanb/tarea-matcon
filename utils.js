import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';


// retrieve content saved in storage (cache)
export const retrieveContent = async (storageKey) => {
    try {
        const jsonValue = await AsyncStorage.getItem(storageKey);
        console.log('jsonValue: ', jsonValue)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.log(e)
    }
}

export const save = (uri) => {
    shareAsync(uri);
}

/**
 * TODO:
 * check if file already exists. 
 * if already exists and its the same, dont download.
 * if already exists but is different, replace it
 */
export const downloadFromUrl = async (url, filepath) => {
    try {
        const result = await FileSystem.downloadAsync(
            url,
            FileSystem.documentDirectory + filepath
        );
        console.log(result);
        // delete: only testing
        retrieveContent('@recurso_0');
        return result.uri;

    } catch (error) {
        console.error(error)
    }
};



