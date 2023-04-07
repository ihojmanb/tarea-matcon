import AsyncStorage from '@react-native-async-storage/async-storage';
// import { downloadFromUrl, retrieveContent } from '../../utils';
import * as FileSystem from 'expo-file-system';
import isEqual from 'lodash/isEqual';

const downloadFromUrl = async (url, filepath) => {
    try {
        const result = await FileSystem.downloadAsync(
            url,
            FileSystem.documentDirectory + filepath
        );
        // console.log(result);
        return result.uri;

    } catch (error) {
        console.error(error)
    }
};

const getResourceImageUrl = (resource) => {
    const imageElement = resource.elements.find(element => element.tipo === 'imagen');
    const imageUrl = imageElement?.url.universal;
    return imageUrl;
};

const createResourceDirectory = async (resource) => {
    let resourceDirName = `recurso_${resource.id}`;
    const directoryFullPath = FileSystem.documentDirectory + resourceDirName;
    const metaDataDir = await FileSystem.getInfoAsync(directoryFullPath);
    const isDir = metaDataDir.isDirectory;
    if (!isDir) {
        try {
            await FileSystem.makeDirectoryAsync(directoryFullPath, { intermediates: true });

        } catch (error) {
            console.info(error);
        }
    } else {
        // console.log(`directory ${directoryFullPath} already exists.`)
    }
};
export const getResourceFromStorage = async (id) => {
    try {
        let contentString = await getContentFromStorage(id);
        return contentString != null ? JSON.parse(contentString) : null;
      } catch(e) {
        console.log(e);
      }

};

export const getContentFromStorage = async (id) => {
    let resourceStorageKey = `@recurso_${id}`;
    const contentString = await AsyncStorage.getItem(resourceStorageKey);
    return contentString;
}

const checkSameContent = (resource, contentString) => {
    let contentJsonValue = JSON.parse(contentString);
    return isEqual(contentJsonValue, resource);
}


export const getImageURIFromStorage = async (id) => {
    let resourceImageStorageKey = `@recurso_${id}_image`;
    console.log('resourceImageStorageKey: ', resourceImageStorageKey)
    let imageURI = await AsyncStorage.getItem(resourceImageStorageKey);
    console.log('imageURI: ', imageURI);
    return imageURI
}

export const insertContent = async (resource) => {
    let resourceDirName = `recurso_${resource.id}`;
    const filename = `recurso-${resource.id}.png`;
    const filepath = `${resourceDirName}/${filename}`;
    let resourceImageURL = getResourceImageUrl(resource);
    let resourceStorageKey = `@recurso_${resource.id}`;
    let resourceImageStorageKey = `@recurso_${resource.id}_image`;
    console.log('resourceImageStorageKey2: ', resourceImageStorageKey)
    // save contents to local storage: resource and downloaded image file
    // separetly
    let resourceJsonValue = JSON.stringify(resource);
    await AsyncStorage.setItem(resourceStorageKey, resourceJsonValue);
    // download image from url
    if (resourceImageURL) {
        let downloadedFilePath = await downloadFromUrl(resourceImageURL, filepath);
        console.log('downloadedFilePath: ', downloadedFilePath);
        console.log('type: ', typeof downloadedFilePath);

        await AsyncStorage.setItem(resourceImageStorageKey, downloadedFilePath);
        // await retrieveContent(resourceStorageKey);
    }
};


export const readRegisteredIds = async () => {
    const resourceIdsKey = "@registeredIds";
    try {
        const prevouslyRegisteredIds = await AsyncStorage.getItem(resourceIdsKey);
        const prevouslyRegisteredIdsObject = prevouslyRegisteredIds != null ? JSON.parse(prevouslyRegisteredIds) : null;
        if (prevouslyRegisteredIdsObject !== null) {
            const registeredIds = prevouslyRegisteredIdsObject.ids;
            return registeredIds;
        }
        else{
            return [];
        }
      } catch(e) {
        // error reading value
        console.log(e);
      }
}

const registerResourceIds = async (resourcesSelected) => {
    const resourceIds = { "ids": resourcesSelected };
    const resourceIdsKey = "@registeredIds";

    try {
        const prevouslyRegisteredIds = await AsyncStorage.getItem(resourceIdsKey);
        const prevouslyRegisteredIdsObject = prevouslyRegisteredIds != null ? JSON.parse(prevouslyRegisteredIds) : null;
        
        if (prevouslyRegisteredIdsObject !== null) {
            // we want to preserve the value previously stored
            const registeredIds = prevouslyRegisteredIdsObject.ids;
            let newregisteredIds = [...registeredIds, ...resourcesSelected];
            // delete any duplicates
            newregisteredIds = [ ... new Set(newregisteredIds)];
            const newRegister = { "ids": newregisteredIds};
            const jsonValue = JSON.stringify(newRegister);
            await AsyncStorage.setItem(resourceIdsKey, jsonValue);
        }
        else {
            const jsonValue = JSON.stringify(resourceIds);
            await AsyncStorage.setItem(resourceIdsKey, jsonValue);
        }
    } catch (e) {
        // saving error
        console.log(e);
    }

};

export const downloadSelectedResources = async (resourcesList, resourcesSelected) => {
    console.log('total resources: ', resourcesList.length)
    const resourcesToBeDownloaded = resourcesList.filter(resource => resourcesSelected.includes(resource.id));
    console.log('resourcesToBeDownloaded: ', resourcesToBeDownloaded)

    if (resourcesToBeDownloaded && resourcesToBeDownloaded.length > 0) {
        resourcesToBeDownloaded.forEach(async resource => {
            try {
                const contentString = await getContentFromStorage(resource.id);
                const contentExists = contentString !== null;
                if (contentExists) {
                    const sameContent = checkSameContent(resource, contentString);
                    if (!sameContent) {
                        await updateContent(resource);
                    }
                    else {
                        console.log('content is equal')
                    }
                }
                else {
                    console.log('content does not exist: saving it');
                    // create resource directory, if not already existent
                    await createResourceDirectory(resource);
                    // insert content in storage
                    await insertContent(resource);
                }
            } catch (error) {
                console.log(error)
            }
        })
        // register in storage the resource ids that were downloaded, in order to
        // know what can be retrieved later
        await registerResourceIds(resourcesSelected);
    }
}