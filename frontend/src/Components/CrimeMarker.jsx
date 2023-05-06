import React, { memo } from 'react';
import { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';

const CrimeMarker = memo(({ crime }) => (
  <Marker
    coordinate={{
      latitude: parseFloat(crime.location.latitude),
      longitude: parseFloat(crime.location.longitude),
    }}
    title={crime.category}
    description={crime.month}
  >
    <Icon name="exclamation-triangle" size={30} color="orange" />
  </Marker>
));

export default CrimeMarker;