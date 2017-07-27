import { OpaqueToken } from "@angular/core";

export let APP_CONFIG = new OpaqueToken("app.config");

export interface IAppConfig {
    apiEndpoint: string;
}

export const AppConfig: IAppConfig = {    
    apiEndpoint:'http://localhost:3000/'
   //apiEndpoint:'http://vimedo.gunsha.c9users.io:8080/'
};