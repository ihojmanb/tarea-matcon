import React from 'react';
import { View, Alert } from 'react-native';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useEffect } from 'react';
import firebaseConfig from '../../firebaseCredentials.json'
import CardScreen from '../components/CardScreen';
import { insertContent } from '../utils/downloadFilesUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
