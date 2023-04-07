import { Text, View, Image } from 'react-native';
import { MathJaxSvg } from 'react-native-mathjax-html-to-svg';

function OfflineCardDetailScreen({ route }) {

    const { id, elements, imageUrl } = route.params;
    const titleElement = elements.find(element => element.tipo === 'titulo')
    const title = titleElement?.texto?.esp;
    const paragraphElement = elements.find(element => element.tipo === 'parrafo')
    const paragraph = paragraphElement?.texto.esp;
    
    return (
        <View
            className='flex justify-center items-center mt-5'
        >
            {title &&
                <Text
                    className='text-xl font-bold'
                >
                    {title}
                </Text>
            }
            {paragraph &&
                <MathJaxSvg
                    fontSize={16}
                    fontCache={true}
                    style={
                        {
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: 20,
                            marginTop: 80
                        }}
                >
                    {`${paragraph}`}
                </MathJaxSvg>
            }

            {imageUrl &&
                <Image
                    source={{ uri: imageUrl }}
                    className={`w-64 h-64 rounded-xl mt-20`}
                    resizeMode="cover"
                />

            }
        </View>
    );
}

export default OfflineCardDetailScreen;