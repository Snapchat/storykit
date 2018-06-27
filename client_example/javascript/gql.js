import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';

const geoFilter = {
  geotype: 'CIRCLE',
  circle: {
    center: {
      latitude: 37.7975529,
      longitude: -122.4034846,
    },
    radius_in_meters: 10000,
  },
};

// Example query for SearchSnaps with geo_filter
const SearchSnapsWithGeoFilter = {
  query: print(gql`
    query ($geo_filter: GeoFilterInput, $media_format_filter: MediaFormatFilterInput, $order: SearchResultsOrderType!, $paging: PagingInput!) {
      SearchSnaps(geo_filter: $geo_filter, media_format_filter: $media_format_filter, order: $order, paging: $paging) {
        snaps {
          title
          embed_url
          media {
            media_type
            orientation_type
            camera_position
          }
        }
      }
    }
  `),
  variables: {
    geo_filter: geoFilter,
    media_format_filter: {
      media_type: 'VIDEO',
      orientation_type: 'PORTRAIT',
      facing_type: 'FRONT_FACING',
    },
    order: 'REVERSE_CHRONOLOGICAL',
    paging: {
      offset: 0,
      count: 5,
    },
  },
};

// Example query for SearchSnaps with offset
const SearchSnapsWithOffset = {
  query: print(gql`
    query ($geo_filter: GeoFilterInput, $order: SearchResultsOrderType!, $paging: PagingInput!) {
      SearchSnaps(geo_filter: $geo_filter, order: $order, paging: $paging) {
        snaps {
          title
          embed_url
        }
        nextSnapOffset
      }
    }
  `),
  variables: offset => ({
    geo_filter: geoFilter,
    order: 'REVERSE_CHRONOLOGICAL',
    paging: {
      offset,
      count: 5,
    },
  }),
};

export default {
  SearchSnapsWithGeoFilter,
  SearchSnapsWithOffset,
};
