import { Button } from '@rneui/base';
import { Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback } from 'react';
import { downloadSelectedResources, readRegisteredIds } from '../utils/downloadFilesUtils';
function DownloadButton({ resourcesList, resourcesSelected, setRegisteredIds }) {
    
  const handleDownload = useCallback(
    async (resourcesList, resourcesSelected) => {
      await downloadSelectedResources(resourcesList, resourcesSelected)
      let listOfRegisteredIds = await readRegisteredIds();
      setRegisteredIds(listOfRegisteredIds);
    },
     []);

  if (resourcesSelected.length > 0) {
    return (
      <Button
        onPress={()=> {
          handleDownload(resourcesList, resourcesSelected)
          Alert.alert('Los recursos seleccionados están siendo descargados. Podrás revisarlos en la pestaña "Offline" ')
        }}
        title="Info"
        color="#fff"
      >
        <Ionicons name="download-outline" size={28} color="black" />
      </Button>

    )
  }
  else {
    return (
      <Button
        onPress={() => { }}
        title="Info"
        color="#fff"
      >
        <Ionicons name="download-outline" size={28} color="grey" />
      </Button>

    )
  }
};
export default DownloadButton;