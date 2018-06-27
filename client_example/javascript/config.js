export default {
  Endpoint: 'https://kit.snap-dev.net/v1/stories/public',
  PrivateKeyFile: 'private_key.pem', // the path to your private key file
  CryptoAlgorithm: 'ES256',
  Issuer: 'dcb57664-94ba-469e-ab4c-e2468ad218b9', // <string: 3PA organization ID>
  KID: 'dcb57664-94ba-469e-ab4c-e2468ad218b9-v1', // <string: <3pa organization id>-v<key version>> // <key version> is 1, 2, etc., to support key rotation
};
