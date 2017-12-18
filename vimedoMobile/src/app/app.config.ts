import { OpaqueToken } from "@angular/core";

export let APP_CONFIG = new OpaqueToken("app.config");

export interface IAppConfig {
    apiEndpoint: string;
}

export const AppConfig: IAppConfig = {    
    apiEndpoint:'http://apivimedo.us-east-1.elasticbeanstalk.com/'
    //apiEndpoint:'http://localhost:3000/'
};