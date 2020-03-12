import PropTypes from 'prop-types';
import React from 'react';
import { format } from 'timeago.js';

import { microserviceType } from '../../types/microservices';
import t from '../../utils/translate';
import ProgressBar from '../ProgressBar';
import * as Styles from './MicroserviceCard.styled';

class MicroserviceCard extends React.PureComponent {
  render() {
    const {
      name: nameProp,
      displayName,
      version,
      deployed,
      deployedDate,
      state = {},
      actions = {},
    } = this.props;

    const name = displayName || nameProp;
    const deployedText = deployed
      ? t('common.deployed', { value: format(deployedDate) })
      : t('common.notDeployed');

    const deployedTextAlt = deployed ? deployedDate : undefined;
    const isActive = !!Object.values(state).filter(Boolean).length;

    return (
      <Styles.Wrapper>
        <Styles.Name title={nameProp}>
          {!deployed && <Styles.ErrorIcon />}
          <span>{name}</span>
        </Styles.Name>
        <Styles.Version>{version}</Styles.Version>
        <Styles.Date title={deployedTextAlt}>{deployedText}</Styles.Date>
        <ProgressBar isActive={isActive} />
        <Styles.Actions>{actions}</Styles.Actions>
      </Styles.Wrapper>
    );
  }
}

MicroserviceCard.propTypes = {
  ...microserviceType,
  actions: PropTypes.node.isRequired,
};

export default MicroserviceCard;
