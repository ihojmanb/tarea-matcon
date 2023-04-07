import React from 'react';
import { View, TouchableOpacity, Text, Image, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getResourceFromStorage } from '../utils/downloadFilesUtils';
import OfflineCardScreen from '../components/OfflineCardScreen';

function OfflineResource({ navigation, resource }) {
    let [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        const getImageUrl = async () => {
            try {
                let resourceImageStorageKey = `@recurso_${resource.id}_image`;
                const value = await AsyncStorage.getItem(resourceImageStorageKey)
                if (value !== null) {
                    setImageUrl(value);
                }
            } catch (e) {
                console.log(e);
            }
        }
        getImageUrl();
    }, []);

    return (
        <OfflineCardScreen
            navigation={navigation}
            card={resource}
            key={resource.id}
            imageUrl={imageUrl}
        />
    )
}

function OfflineResourcesScreen({
    navigation,
    registeredIds
}) {
    let [offlineResources, setOfflineResources] = useState([]);

    useEffect(() => {
        const lookupOfflineResources = async () => {
            if (registeredIds.length > 0) {
                let resources =await Promise.all (registeredIds.map(async id => {
                    let resourceFromStorage = await getResourceFromStorage(id);
                    return resourceFromStorage
                }));
                resources.sort((a, b) => parseInt(a.id) - parseInt(b.id));
                setOfflineResources(resources);
            }
        };
        lookupOfflineResources();
    }, [registeredIds])


    if (offlineResources.length > 0) {
        return (
            <View
                className='flex justify-center items-center mt-5 mb-5'
            >
                {offlineResources.map(resource => {
                    const resourceId = resource.id;
                    return (
                        <OfflineResource
                            navigation={navigation}
                            key={resourceId}
                            resource={resource}
                        />
                    )
                })}
            </View>
        )
    } else {
        return (
            <View
                className='flex justify-center items-center mt-5 mb-5'
            >
                <Text>
                    nothing downloaded
                </Text>
            </View>
        )
    }
};

export default OfflineResourcesScreen;