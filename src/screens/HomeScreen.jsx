import React from 'react';
import { View, TouchableOpacity, Text, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from 'react';
import firebaseConfig from '../../firebaseCredentials.json'
import { downloadFromUrl, retrieveContent } from '../../utils';
import * as FileSystem from 'expo-file-system';
import isEqual from 'lodash/isEqual';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


function HomeScreen({ navigation }) {
    let [situacionesArray, setSituacionesArray] = useState();

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
            console.log(`directory ${directoryFullPath} already exists.`)
        }
    };
    const getContentFromStorage = async (resource) => {
        let resourceStorageKey = `@recurso_${resource.id}`;
        const contentString = await AsyncStorage.getItem(resourceStorageKey);
        return contentString;
    }

    const checkSameContent = (resource, contentString) => {
        let contentJsonValue = JSON.parse(contentString);
        return isEqual(contentJsonValue, resource);
    }

    const updateContent = async (resource) => {
        console.log('updating string in storage!')
        await insertContent(resource);
        Alert.alert('Se ha actualizado el contenido de algunos recursos.')
    }


    /**
     * DEVELOPMENT FUNCTION ONLY: clears storage
     */
    // useEffect(() => {
    //     clearAll = async () => {
    //         try {
    //             await AsyncStorage.clear();
    //         } catch (e) {
    //             console.log(e);
    //         }

    //         console.log('Done.');
    //     };
    //     clearAll();
    // }, [])

    /**
     * save Firebase resources to state
     * if resource exist locally:
     *      load content from storatge
     * else:
     *      retrieve content from API
     */
    useEffect(() => {
        const getSituacionesArray = async () => {
            let docs = await getDocs(collection(db, "Situaciones"));
            let docsArray = [];
            docs.forEach((doc) => {
                let docObject = {}
                docObject['id'] = doc.id;
                docObject['elements'] = doc.data().elementos;
                docsArray.push(docObject);
            })
            setSituacionesArray(docsArray);
        };
        getSituacionesArray();
    }, []);


    const insertContent = async (resource) => {
        let resourceDirName = `recurso_${resource.id}`;
        const filename = `recurso-${resource.id}.png`;
        const filepath = `${resourceDirName}/${filename}`;
        let resourceImageURL = getResourceImageUrl(resource);
        let resourceStorageKey = `@recurso_${resource.id}`;
        let resourceImageStorageKey = `@recurso_${resource.id}_image`;
        // save contents to local storage: resource and downloaded image file
        // separetly
        let resourceJsonValue = JSON.stringify(resource);
        await AsyncStorage.setItem(resourceStorageKey, resourceJsonValue);
        // download image from url
        if (resourceImageURL) {
            let downloadedFilePath = await downloadFromUrl(resourceImageURL, filepath);
            await AsyncStorage.setItem(resourceImageStorageKey, downloadedFilePath);
            await retrieveContent(resourceStorageKey);
        }
    };


    /**
     *  updates or inserts content into local storage.
     * if content exists:
     *      if its the same: don't save it.
     *      else: replace it.
     * else: save it.
     */
    useEffect(() => {
        const upsertContentIfChanged = async () => {
            if (situacionesArray && situacionesArray.length > 0) {
                situacionesArray.forEach(async resource => {
                    try {
                        const contentString = await getContentFromStorage(resource);
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
            }
        };
        upsertContentIfChanged();
    }, [situacionesArray])




    return (
        <View
            className='flex justify-center items-center mt-5'
        >
            {situacionesArray && situacionesArray.map((card) => {
                const imageElement = card.elements.find(element => element.tipo === 'imagen')
                const imageUrl = imageElement?.url.universal
                return (
                    <TouchableOpacity
                        key={card.id}
                        onPress={() => navigation.navigate('Card', { id: card.id, elements: card.elements, imageUrl })}
                        className={
                            `
                        bg-white 
                        rounded-xl 
                        w-full 
                        max-w-xs 
                        border-gray-200 
                        rounded-lg 
                        shadow 
                        dark:bg-gray-800 
                        dark:border-gray-700 
                        mb-5
                        `
                        }
                    >
                        <Text
                            className={'p-1 font-bold'}
                        >
                            Recurso #{card.id}
                        </Text>
                        {imageUrl !== "" &&
                            <Image
                                source={{ uri: imageUrl }}
                                className={`w-full h-64 rounded-t-xl`}
                                resizeMode="cover"
                            />
                        }
                        <Text

                        >
                            Ver recurso
                        </Text>
                    </TouchableOpacity>

                )
            })}
        </View>
    );
}

export default HomeScreen;
