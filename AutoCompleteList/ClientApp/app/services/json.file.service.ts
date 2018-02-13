import { Injectable, Inject } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class JSONFileService {

    constructor(private http: Http, @Inject('BASE_URL') private originUrl: string) {

    }

    public getFile<T>(url: string): Promise<void | T> {
        return this.http.get(this.originUrl + url)
            .toPromise()
            .then(response => {
                var retVal: T = {} as T;
                retVal = <T>JSON.parse(response.text());
                return retVal;
            }).catch(ex => {
                
            });
    }
}