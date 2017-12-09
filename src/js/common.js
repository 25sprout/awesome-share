import { config } from './appConfig';

export const isGuest = () => config.user === 'guest';

export default 'common';
