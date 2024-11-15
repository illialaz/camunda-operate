import axios from 'axios';

import { authStorage } from '../utils/authStorage';

export const refreshToken = async () => {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('audience', process.env.REACT_APP_ZEEBE_TOKEN_AUDIENCE || '');
  params.append('client_id', process.env.REACT_APP_ZEEBE_CLIENT_ID || '');
  params.append(
    'client_secret',
    process.env.REACT_APP_ZEEBE_CLIENT_SECRET || '',
  );

  const res = await axios.post<{ access_token: string }>(
    process.env.REACT_APP_ZEEBE_AUTHORIZATION_SERVER_URL || '',
    params,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );

  authStorage.setAccess(res.data.access_token);
};
