import { useEffect, useState } from 'react';

import { MDBox } from 'components';

export const WordLoader = () => {
  const [vc, setVc] = useState<boolean>(false);
  const [decrypt, setDecrypt] = useState<boolean>(false);

  useEffect(() => {
    let timer1 = setTimeout(() => setVc(true), Math.floor(Math.random() * 2000) + 1000);
    let timer2 = setTimeout(() => setDecrypt(true), Math.floor(Math.random() * 3500) + 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);
  if (vc && !decrypt) {
    return (
      <MDBox
        sx={{
          whiteSpace: 'pre',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        {'Verifying Consent...'}
      </MDBox>
    );
  }
  if (decrypt) {
    return (
      <MDBox
        sx={{
          whiteSpace: 'pre',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        {'Decrypting...'}
      </MDBox>
    );
  } else {
    return (
      <MDBox
        sx={{
          whiteSpace: 'pre',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        {'Authenticating...'}
      </MDBox>
    );
  }
};
