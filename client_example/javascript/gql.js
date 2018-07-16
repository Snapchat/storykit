import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';

const exampleGeoFilter = {
  geotype: 'CIRCLE',
  circle: {
    center: {
      latitude: 37.7975529,
      longitude: -122.4034846,
    },
    radius_in_meters: 10000,
  },
};

const largeGeoFilter = {
  geotype: 'CIRCLE',
  circle: {
    center: {
      latitude: 37.7975529,
      longitude: -122.4034846,
    },
    radius_in_meters: 999999,
  },
};

const examplePaging = {
  offset: 0,
  count: 5,
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
    geo_filter: exampleGeoFilter,
    media_format_filter: {
      media_type: 'VIDEO',
      orientation_type: 'PORTRAIT',
      facing_type: 'FRONT_FACING',
    },
    order: 'REVERSE_CHRONOLOGICAL',
    paging: examplePaging,
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
    geo_filter: exampleGeoFilter,
    order: 'REVERSE_CHRONOLOGICAL',
    paging: {
      offset,
      count: 5,
    },
  }),
};

// Example query for SearchSnaps with lens filter
const SearchSnapsWithLensFilter = {
  query: print(gql`
    query ($content: [ContentFilterInput], $order: SearchResultsOrderType!, $paging: PagingInput!) {
      SearchSnaps(content: $content, order: $order, paging: $paging) {
        snaps {
          title
          embed_url
        }
      }
    }
  `),
  variables: {
    content: [
      {
        type: 'LENS',
        keyword: '18576597240',
      },
      {
        type: 'LENS',
        keyword: '19653957248',
      },
    ],
    order: 'REVERSE_CHRONOLOGICAL',
    paging: examplePaging,
  },
};

// Example query for SearchStories with geo_filter
const SearchStoriesWithGeoFilter = {
  query: print(gql`
    query ($geo_filter: GeoFilterInput, $media_format_filter: MediaFormatFilterInput, $order: SearchResultsOrderType!, $paging: PagingInput!) {
      SearchStories(geo_filter: $geo_filter, media_format_filter: $media_format_filter, order: $order, paging: $paging) {
        stories {
          id
          embed_url
          metadata {
            title
          }
        }
      }
    }
  `),
  variables: {
    geo_filter: largeGeoFilter,
    media_format_filter: {
      media_type: 'VIDEO',
      orientation_type: 'PORTRAIT',
      facing_type: 'FRONT_FACING',
    },
    order: 'REVERSE_CHRONOLOGICAL',
    paging: examplePaging,
  },
};

// Example query for SearchUserStories
const SearchUserStories = {
  query: print(gql`
    query ($user_name: String!, $caption: String, $order: SearchResultsOrderType!, $paging: PagingInput!) {
      SearchUserStories(user_name: $user_name, caption: $caption, order: $order, paging: $paging) {
        stories {
          id
          embed_url
          metadata {
            title
          }
        }
      }
    }
  `),
  variables: {
    user_name: 'kylizzlemynizzl',
    order: 'REVERSE_CHRONOLOGICAL',
    paging: examplePaging,
  },
};

export default {
  SearchSnapsWithGeoFilter,
  SearchSnapsWithOffset,
  SearchSnapsWithLensFilter,
  SearchStoriesWithGeoFilter,
  SearchUserStories,
};
