import GQL from './gql';
import Request from './request';

const SearchSnapsWithGeoFilter = () => (
  Request.run(
    GQL.SearchSnapsWithGeoFilter.query,
    GQL.SearchSnapsWithGeoFilter.variables,
  )
);

const SearchSnapsWithOffset = async () => {
  /* eslint-disable no-await-in-loop */
  const maxLoopCount = 3;
  let offset = 0;
  for (let i = 0; i < maxLoopCount; i += 1) {
    // A nextSnapOffset of value -1 indicates there is no more
    // record after the last Snap returned in this call
    if (offset === -1) {
      break;
    }
    const response = await Request.run(
      GQL.SearchSnapsWithOffset.query,
      GQL.SearchSnapsWithOffset.variables(offset),
    );
    offset = response.data.SearchSnaps.nextSnapOffset;
  }
};

const run = async () => {
  await SearchSnapsWithGeoFilter();
  await SearchSnapsWithOffset();
};
run();
