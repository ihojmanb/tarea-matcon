import React from 'react';
import { View, TouchableOpacity, Text, Image, Alert, StyleSheet } from 'react-native';
import Checkbox from 'expo-checkbox';
import { useState } from 'react';

function CardScreen({ navigation, card, imageUrl, resourcesSelected, setResourcesSelected }) {
    const [isChecked, setChecked] = useState(false);

    const handleChecked = () => {
        const cardId = card.id;
        if(!isChecked){
            setResourcesSelected(
                [
                    ...resourcesSelected,
                    cardId
                ]
            );
        }
        else{
            setResourcesSelected(
                resourcesSelected.filter(id => id !== cardId)
            );
        }
        setChecked(!isChecked);

    }

    return (
        <View
            key={card.id}
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
            <View style={styles.footer}>
                <View style={styles.checkboxContainer}>
                    <Checkbox
                        style={styles.buttonText}
                        value={isChecked}
                        onValueChange={handleChecked}
                    />
                    <Text>Descargar recurso</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Card', { id: card.id, elements: card.elements, imageUrl })}
                    >
                        <Text style={styles.buttonText}> Ver recurso </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 3,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        margin: 10,
    },
    image: {
        width: '100%',
        height: 150,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    buttonContainer: {
        flex: 1,
        marginHorizontal: 5,
    },
    checkboxContainer: {
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        backgroundColor: 'blue',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});


export default CardScreen;