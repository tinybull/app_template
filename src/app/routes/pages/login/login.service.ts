import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '@env/environment';

@Injectable()
export class LoginService {

    private url = environment.SERVER_URL + 'system/newLogin';

    constructor(private http: HttpClient) {
    }

    login(params): Observable<any> {
        return this.http.post(this.url, params);
    }


}
