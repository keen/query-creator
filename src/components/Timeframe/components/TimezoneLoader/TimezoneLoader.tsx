import React, { FC } from 'react';
import { Loader } from '@keen.io/ui-core';

import { Container } from './TimezoneLoader.styles';

type Props = {};

const TimezoneLoader: FC<Props> = () => (
  <Container>
    <Loader width={20} height={30} />
  </Container>
);

export default TimezoneLoader;
