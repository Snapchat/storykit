import jwt from 'jsonwebtoken';
import fs from 'fs';
import axios from 'axios';
import crypto from 'crypto';
import Config from './config';

/**
 * @param query for "query" field in the post body
 * @param variables for "variables" field in the post body
 * @returns {Promise<AxiosResponse<any>>} GraphQL response body
 */
const run = (query, variables) => {
  console.log('------------------------------------------------------');

  // Assemble the GraphQL POST body
  const postBody = {
    query,
    variables,
  };
  const postBodyStr = JSON.stringify(postBody);

  // Generate JWT Token
  const headers = {
    header: {
      typ: 'JWT', // This is not required. jsonwebtoken will auto add type: 'JWT' if payload is an object
      alg: Config.CryptoAlgorithm,
      kid: Config.KID,
    },
  };
  const privateKey = fs.readFileSync(Config.PrivateKeyFile);
  const payload = {
    iss: Config.Issuer,
    aud: 'PublicStoryKitAPI',
    exp: 1844975504,
    hash: crypto.createHash('sha256').update(postBodyStr).digest('hex'),
  };

  /*
    jwt.sign will convert the above content to the following JSON format:

    header = {
      alg: 'algorithm',
      typ: 'JWT',
      kid: 'xxx',
    }

    payload = {
      iss: 'xxx',
      aud: 'xxx',
      exp: 123,
      iat: 123,
      hash: 'xxx',
    }
  */
  const token = jwt.sign(
    payload,
    privateKey,
    headers,
  );

  console.log(`Generated JWT token: \n${token}`);
  console.log(`GraphQL query: \n${JSON.stringify(postBody, null, 2)}`);

  // Send a POST request to the SnapKit GraphQL endpoint
  return axios({
    method: 'POST',
    url: Config.Endpoint,
    headers: {
      'X-Snap-Kit-S2S-Auth': `Bearer ${token}`,
    },
    data: postBodyStr,
  })
    .then((response) => {
      console.log(JSON.stringify(response.data, null, 2));
      console.log(`return snaps #${response.data.data.SearchSnaps.snaps.length}`);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

export default {
  run,
};
