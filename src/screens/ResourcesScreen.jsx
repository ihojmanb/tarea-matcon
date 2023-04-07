import React from 'react';
import { View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from 'react';
import firebaseConfig from '../../firebaseCredentials.json'
import CardScreen from '../components/CardScreen';
import { insertContent } from '../utils/downloadFilesUtils';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


function ResourcesScreen({
    navigation,
    resourcesList,
    setResourcesList,
    resourcesSelected,
    setResourcesSelected
}) {

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
        const getResourcesList = async () => {
            let docs = await getDocs(collection(db, "Situaciones"));
            let docsArray = [];
            docs.forEach((doc) => {
                let docObject = {}
                docObject['id'] = doc.id;
                docObject['elements'] = doc.data().elementos;
                docsArray.push(docObject);
            })
            setResourcesList(docsArray);
        };
        getResourcesList();
    }, []);

    /**
     * Si hay alguna actualización en Firebase debe actualizar lo que ya se ha descargado.
     */
    const updateDownloadedContent = () => {

    }
    /**
     *  updates or inserts content into local storage.
     * if content exists:
     *      if its the same: don't save it.
     *      else: replace it.
     * else: save it.
     */
    // useEffect(() => {
    //     const upsertContentIfChanged = async () => {
    //         if (resourcesList && resourcesList.length > 0) {
    //             resourcesList.forEach(async resource => {
    //                 try {
    //                     const contentString = await getContentFromStorage(resource);
    //                     const contentExists = contentString !== null;
    //                     if (contentExists) {
    //                         const sameContent = checkSameContent(resource, contentString);
    //                         if (!sameContent) {
    //                             await updateContent(resource);
    //                         }
    //                         else {
    //                             console.log('content is equal')
    //                         }
    //                     }
    //                     else {
    //                         console.log('content does not exist: saving it');
    //                         // create resource directory, if not already existent
    //                         await createResourceDirectory(resource);
    //                         // insert content in storage
    //                         await insertContent(resource);
    //                     }
    //                 } catch (error) {
    //                     console.log(error)
    //                 }
    //             })
    //         }
    //     };
    //     upsertContentIfChanged();
    // }, [resourcesList])

    return (
        <View
            className='flex justify-center items-center mt-5 mb-5'
        >
            {resourcesList && resourcesList.map((card) => {
                const imageElement = card.elements.find(element => element.tipo === 'imagen')
                const imageUrl = imageElement?.url.universal
                return (
                    <CardScreen
                        navigation={navigation}
                        card={card} key={card.id}
                        imageUrl={imageUrl}
                        resourcesSelected={resourcesSelected}
                        setResourcesSelected={setResourcesSelected}
                    />
                )
            })}
        </View>
    );
}

export default ResourcesScreen;
