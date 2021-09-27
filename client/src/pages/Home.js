import PlacesSearch from './../components/address/PlacesSearch';
import Text from './../components/address/Text.js';
import { useHistory } from 'react-router';

import { Fragment } from 'react';
const Home = () => {
  const history = useHistory();

  const suggestionHandler = async (result, lat, lng, text) => {
    localStorage.setItem(
      'search-address',
      JSON.stringify({
        result,
      })
    );
    history.push(`/restaurants/address/${lat}/${lng}`);
  };
  return (
    <Fragment>
      <Text>
        <PlacesSearch onSearch={suggestionHandler} />
      </Text>
    </Fragment>
  );
};

export default Home;
