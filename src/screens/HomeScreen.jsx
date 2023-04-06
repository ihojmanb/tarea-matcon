import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from 'react';
import firebaseConfig from '../../firebaseCredentials.json'
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

function HomeScreen({ navigation }) {
    let [situacionesArray, setSituacionesArray] = useState()

    useEffect(() => {
        const getSituacionesArray = async () => {
            let docs = await getDocs(collection(db, "Situaciones"));
            let docsArray = []
            docs.forEach((doc) => {
                let docObject = {}
                docObject['id'] = doc.id;
                docObject['elements'] = doc.data().elementos;
                docsArray.push(docObject)
            })
            setSituacionesArray(docsArray)
        };
        getSituacionesArray()
    }, []);

    useEffect(() => {

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
