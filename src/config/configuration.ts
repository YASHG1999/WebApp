import { EnvironmentVariables } from './env.validation';

export interface Config {
  appEnv: string;
  port: string;
  db_url: string;
  
}

export default (): Config => {
  const processEnv = process.env as unknown as EnvironmentVariables;
  return {
    appEnv: processEnv.NODE_ENV,
    port: processEnv.PORT || '3000',
    db_url: processEnv.DATABASE_URL,
    
    
  };
};
