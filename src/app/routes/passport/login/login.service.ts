import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class LoginService {

    private url = 'system/newLogin';

    constructor(private http: HttpClient) {
    }

    login(params): Observable<any> {
        return this.http.post(this.url, params);
    }


}
