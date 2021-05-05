import web3provider from './web3provider';
import identity from './identity';
import certificate from './certificate';
import ipfs from './ipfs';

export default {
  ...web3provider,
  ...identity,
  ...certificate,
  ...ipfs,
};
