import React, { memo } from 'react';
import { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';

const CrimeMarker = memo(({ coordinate, title, description }) => (
  <Marker
    coordinate={coordinate}
    title={title}
    description={description}
    pinColor='yellow'
  >
    
  </Marker>
));

export default CrimeMarker;